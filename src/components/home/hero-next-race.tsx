"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { HomepageData } from "@/types";

interface HeroNextRaceProps {
  race: HomepageData["nextRace"];
  status: HomepageData["seasonStatus"];
  liveSession: string | null;
  seasonProgress: HomepageData["seasonProgress"];
}

const SESSION_KEY: Record<string, string> = {
  fp1: "fp1",
  fp2: "fp2",
  fp3: "fp3",
  sprintQualifying: "qualifying",
  sprint: "sprint",
  qualifying: "qualifying",
  race: "race",
};

const SESSION_SHORT: Record<string, string> = {
  fp1: "FP1",
  fp2: "FP2",
  fp3: "FP3",
  sprintQualifying: "SQ",
  sprint: "SPR",
  qualifying: "QUA",
  race: "RACE",
};

// Live-session windows (minutes) — mirrors season.ts
const SESSION_MINUTES: Record<string, number> = {
  fp1: 90, fp2: 90, fp3: 90, sprintQualifying: 75, sprint: 90, qualifying: 90, race: 180,
};

function getTimeLeft(targetMs: number, now: number) {
  const diff = targetMs - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function HeroNextRace({ race, status, liveSession: liveSessionSSR, seasonProgress }: HeroNextRaceProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const tRace = useTranslations("race");
  const locale = useLocale();
  const { markets } = useMarkets();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const name = locale === "zh" ? race.nameZh : race.name;
  const circuit = locale === "zh" ? race.circuitZh : race.circuit;

  // Client-side session state machine (SSR value seeds it, then ticks live)
  const { liveNow, nextSession } = useMemo(() => {
    let live: string | null = null;
    let next: { type: string; iso: string } | null = null;
    for (const s of race.sessions) {
      const start = new Date(s.iso).getTime();
      const end = start + (SESSION_MINUTES[s.type] || 90) * 60_000;
      if (now >= start && now <= end) live = s.type;
      if (!next && now < start) next = s;
    }
    return { liveNow: live || (status === "live" && now < new Date(race.date).getTime() ? liveSessionSSR : null), nextSession: next };
  }, [race.sessions, race.date, now, status, liveSessionSSR]);

  const countdownTarget = nextSession ? new Date(nextSession.iso).getTime() : new Date(race.date).getTime();
  const time = getTimeLeft(countdownTarget, now);
  const countdownLabel = nextSession && nextSession.type !== "race"
    ? tRace(SESSION_KEY[nextSession.type] || "race")
    : tRace("race");

  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" }),
    [locale]
  );
  const tzLabel = useMemo(() => {
    const offsetMin = -new Date().getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const h = Math.floor(Math.abs(offsetMin) / 60);
    return `UTC${sign}${h}`;
  }, []);

  // Right panel: prefer this race's winner market, fall back to WDC
  const raceMarket = markets.raceWinner?.find((m) => m.question.toLowerCase().includes("driver winner"));
  const wdcMarket = markets.championship?.find((m) => m.question.toLowerCase().includes("driver"));
  const panelMarket = raceMarket || wdcMarket;
  const panelTitle = raceMarket ? t("winProbability") : t("wdcProbability");
  const outcomes = (panelMarket?.outcomes || []).slice(0, 5);
  const maxPrice = outcomes[0]?.price || 1;

  const units = [
    { value: time.days, label: t("days") },
    { value: time.hours, label: t("hours") },
    { value: time.minutes, label: t("minutes") },
    { value: time.seconds, label: t("seconds") },
  ];

  return (
    <section className="hero-section relative overflow-hidden" style={{ padding: "40px 20px 48px" }}>
      {/* Background layers */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 70% 20%, rgba(225,6,0,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 50% 50% at 10% 90%, rgba(39,244,210,0.04) 0%, transparent 60%),
          linear-gradient(180deg, var(--bg-primary, #07070c) 0%, #0a0a14 100%)
        `,
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)",
      }} />

      <div className="relative z-10 mx-auto grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]" style={{ maxWidth: "1200px", animation: "heroFadeIn 0.7s ease-out" }}>
        {/* ── Left: race + countdown ── */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "14px" }}>
            <span className="f1-data" style={{ fontSize: "12px", color: "#E10600", letterSpacing: "2.5px" }}>
              {t("round")} {race.round}/{seasonProgress.total} · {t("nextRace")}
            </span>
            {race.isSprint && (
              <span className="f1-label-xs" style={{ color: "#FF8000", border: "1px solid rgba(255,128,0,0.3)", borderRadius: "4px", padding: "3px 6px" }}>
                {tRace("sprint")}
              </span>
            )}
            {liveNow && (
              <span className="live-chip">
                <span className="dot" />
                {SESSION_SHORT[liveNow] || "LIVE"} {tc("live")}
              </span>
            )}
          </div>

          <h1 className="f1-display-xl" style={{
            fontSize: "clamp(26px, 6.5vw, 56px)",
            overflowWrap: "break-word",
            marginBottom: "8px",
            background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            <span style={{ WebkitTextFillColor: "initial", marginRight: "12px" }}>{race.flag}</span>
            {name}
          </h1>
          <p className="f1-body" style={{ fontSize: "15px", color: "var(--text-secondary, #8b8b9e)", marginBottom: "28px" }}>
            {circuit}
          </p>

          {/* Countdown to next session */}
          <div style={{ marginBottom: "10px" }}>
            <span className="f1-label" style={{ color: "var(--text-dim, #888)" }}>
              {liveNow ? t("upNext") : countdownLabel} · {timeFmt.format(new Date(countdownTarget))} {tzLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: "8px", marginBottom: "28px" }}>
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center" style={{ gap: "8px" }}>
                <div className="countdown-unit-hero text-center">
                  <span className="f1-data" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, lineHeight: 1, color: "var(--text-primary, #eeeef0)" }}>
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="block f1-label-xs" style={{ marginTop: "8px", color: "var(--text-dim, #888)", letterSpacing: "2px" }}>
                    {unit.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className="countdown-sep-blink f1-data" style={{ fontSize: "26px", color: "var(--text-subtle, #777)", paddingBottom: "16px" }}>:</span>
                )}
              </div>
            ))}
          </div>

          {/* Weekend session timeline */}
          <div className="flex flex-wrap" style={{ gap: "10px" }}>
            {race.sessions.map((s) => {
              const start = new Date(s.iso).getTime();
              const end = start + (SESSION_MINUTES[s.type] || 90) * 60_000;
              const done = now > end;
              const isLive = now >= start && now <= end;
              return (
                <div
                  key={s.type}
                  className="flex items-center f1-transition"
                  style={{
                    gap: "8px",
                    padding: "8px 14px",
                    background: isLive ? "rgba(225,6,0,0.1)" : "var(--bg-secondary, #0e0e18)",
                    border: `1px solid ${isLive ? "rgba(225,6,0,0.45)" : "var(--border-subtle, rgba(255,255,255,0.05))"}`,
                    borderRadius: "8px",
                    opacity: done ? 0.45 : 1,
                  }}
                >
                  <span className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: isLive ? "#E10600" : done ? "var(--text-dim, #888)" : "var(--text-primary, #eeeef0)" }}>
                    {SESSION_SHORT[s.type] || s.type.toUpperCase()}
                  </span>
                  <span className="f1-data" style={{ fontSize: "11px", color: "var(--text-secondary, #8b8b9e)", textDecoration: done ? "line-through" : "none" }}>
                    {timeFmt.format(new Date(s.iso))}
                  </span>
                  {isLive && <span className="h-1.5 w-1.5 rounded-full animate-live" style={{ background: "#E10600" }} />}
                  {done && <span style={{ color: "var(--accent-green, #00d26a)", fontSize: "10px" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: market pulse panel ── */}
        {outcomes.length > 0 && (
          <div className="f1-surface-primary f1-corner-accent min-w-0" style={{ padding: "22px 22px 16px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "18px" }}>
              <div className="flex items-center gap-2">
                <span className="f1-accent-bar" />
                <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{panelTitle}</span>
              </div>
              <span className="f1-freshness-badge">
                <span className="pulse-dot" />
                {t("liveOdds")}
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: "14px" }}>
              {outcomes.map((o, i) => {
                const change = o.change24h ?? 0;
                const up = change > 0.0005;
                const down = change < -0.0005;
                return (
                  <div key={o.name}>
                    <div className="flex items-baseline justify-between" style={{ marginBottom: "6px" }}>
                      <div className="flex items-center gap-2">
                        <span className="f1-data" style={{ fontSize: "10px", color: "var(--text-subtle, #777)", width: "14px" }}>{i + 1}</span>
                        <span className="f1-body" style={{ fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>
                          {o.name.split(" ").pop()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        {(up || down) && (
                          <span className="f1-data" style={{ fontSize: "10px", color: up ? "var(--accent-green, #00d26a)" : "var(--accent-red, #ff4757)" }}>
                            {up ? "▲" : "▼"}{Math.abs(change * 100).toFixed(1)}
                          </span>
                        )}
                        <span className="f1-data" style={{ fontSize: "16px", color: "var(--text-primary, #eeeef0)" }}>
                          {(o.price * 100).toFixed(o.price < 0.1 ? 1 : 0)}%
                        </span>
                      </div>
                    </div>
                    <div className="prob-bar-track">
                      <div
                        className="prob-bar-fill"
                        style={{
                          width: `${Math.max((o.price / maxPrice) * 100, 2)}%`,
                          background: `linear-gradient(90deg, ${o.color}66, ${o.color})`,
                          animationDelay: `${i * 0.08}s`,
                          boxShadow: `0 0 12px ${o.color}44`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between" style={{ gap: "8px", marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.05))" }}>
              <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>
                {panelMarket?.volume} · Polymarket
              </span>
              {panelMarket?.url ? (
                <a href={panelMarket.url} target="_blank" rel="noopener noreferrer" className="f1-heading" style={{ fontSize: "11px", color: "#E10600", textDecoration: "none", letterSpacing: "1px" }}>
                  {t("tradeOnPolymarket")} →
                </a>
              ) : (
                <Link href="/markets" className="f1-heading" style={{ fontSize: "11px", color: "#E10600", textDecoration: "none", letterSpacing: "1px" }}>
                  {t("viewMarkets")} →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
