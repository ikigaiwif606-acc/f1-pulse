"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { MarketsMeta } from "@/lib/data/markets";
import type { HomepageData } from "@/types";

interface HeroNextRaceProps {
  race: HomepageData["nextRace"];
  status: HomepageData["seasonStatus"];
  liveSession: string | null;
  seasonProgress: HomepageData["seasonProgress"];
  marketsInitial?: MarketsMeta;
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

// Bilingual signage — fixed EN/中文 pairs shown together, like FIA event boards.
// The primary line is localized via next-intl; the echo is the other language.
const SIGNAGE = {
  championship: { en: "FIA FORMULA ONE WORLD CHAMPIONSHIP", zh: "世界一级方程式锦标赛" },
  theMarket: { en: "THE MARKET", zh: "市场行情" },
  unitEcho: { en: ["天", "时", "分", "秒"], zh: ["DAYS", "HRS", "MIN", "SEC"] },
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

export function HeroNextRace({ race, status, liveSession: liveSessionSSR, seasonProgress, marketsInitial }: HeroNextRaceProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const tRace = useTranslations("race");
  const locale = useLocale();
  const { markets, stale, timestamp } = useMarkets(marketsInitial);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const name = locale === "zh" ? race.nameZh : race.name;
  const circuit = locale === "zh" ? race.circuitZh : race.circuit;
  const echo = (pair: { en: string; zh: string }) => (locale === "zh" ? pair.en : pair.zh);

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
  // Beijing time — always shown next to local time (bilingual by design)
  const beijingFmt = useMemo(
    () => new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit" }),
    []
  );
  const tzLabel = useMemo(() => {
    const offsetMin = -new Date().getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const h = Math.floor(Math.abs(offsetMin) / 60);
    return `UTC${sign}${h}`;
  }, []);

  // Data provenance — deterministic UTC so SSR and client agree
  const syncedAt = useMemo(() => {
    if (!timestamp) return null;
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime()) || d.getTime() === 0) return null;
    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" }).format(d);
  }, [timestamp]);

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
  const unitEcho = SIGNAGE.unitEcho[locale === "zh" ? "zh" : "en"];

  return (
    <section className="hero-section relative overflow-hidden" style={{ padding: "44px 20px 52px" }}>
      {/* Background — carbon ground, timing-purple hint. Red is reserved for LIVE. */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 70% 0%, rgba(183,140,255,0.06) 0%, transparent 65%),
          linear-gradient(180deg, var(--bg-primary, #07070c) 0%, #0a0a12 100%)
        `,
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.010) 0 2px, transparent 2px 6px)",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 80%)",
      }} />

      <div className="relative z-10 mx-auto grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]" style={{ maxWidth: "1200px", animation: "heroFadeIn 0.7s ease-out" }}>
        {/* ── Left: race + countdown ── */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "18px" }}>
            <span className="pw-eyebrow">
              <b>{t("round", { round: race.round, total: seasonProgress.total })}</b>
              {echo(SIGNAGE.championship)}
            </span>
            {race.isSprint && (
              <span className="f1-label-xs" style={{ color: "var(--team-mclaren, #FF8000)", border: "1px solid rgba(255,128,0,0.3)", borderRadius: "4px", padding: "3px 6px" }}>
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

          <h1 className="f1-display-xl pw-skew" style={{
            fontSize: "clamp(34px, 7.5vw, 72px)",
            overflowWrap: "break-word",
            marginBottom: "6px",
            color: "var(--text-primary, #eeeef0)",
          }}>
            <span style={{ marginRight: "12px", display: "inline-block", transform: "skewX(6deg)" }}>{race.flag}</span>
            {name}
          </h1>
          <p className="f1-display-lg pw-skew pw-outline" style={{ fontSize: "clamp(16px, 2.6vw, 26px)", marginBottom: "30px" }}>
            {circuit}
          </p>

          {/* Countdown to next session */}
          <div style={{ marginBottom: "10px" }}>
            <span className="f1-label" style={{ color: "var(--text-dim, #888)" }}>
              {liveNow ? t("upNext") : countdownLabel} · {timeFmt.format(new Date(countdownTarget))} {tzLabel} · 北京 {beijingFmt.format(new Date(countdownTarget))}
            </span>
          </div>
          <div className="flex" style={{ gap: "8px", marginBottom: "28px", maxWidth: "460px" }}>
            {units.map((unit, i) => (
              <div key={unit.label} className="pw-cd-cell">
                <span className="f1-data" style={{
                  fontSize: "clamp(26px, 4vw, 36px)",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: i === units.length - 1 ? "var(--timing-red, #FF3B57)" : "var(--text-primary, #eeeef0)",
                }}>
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="block f1-label-xs" style={{ marginTop: "8px", color: "var(--text-dim, #888)", letterSpacing: "2px" }}>
                  {unit.label} <span style={{ color: "var(--text-ghost, #666)" }}>{unitEcho[i]}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Weekend session timeline — local + Beijing time */}
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
                    background: isLive ? "rgba(255,59,87,0.1)" : "var(--bg-secondary, #0e0e18)",
                    border: `1px solid ${isLive ? "rgba(255,59,87,0.45)" : "var(--border-subtle, rgba(255,255,255,0.05))"}`,
                    borderRadius: "4px",
                    opacity: done ? 0.45 : 1,
                  }}
                >
                  <span className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: isLive ? "var(--timing-red, #FF3B57)" : done ? "var(--text-dim, #888)" : "var(--text-primary, #eeeef0)" }}>
                    {SESSION_SHORT[s.type] || s.type.toUpperCase()}
                  </span>
                  <span className="f1-data" style={{ fontSize: "11px", color: "var(--text-secondary, #8b8b9e)", textDecoration: done ? "line-through" : "none" }}>
                    {timeFmt.format(new Date(s.iso))}
                  </span>
                  {!done && (
                    <span className="f1-data" style={{ fontSize: "10px", color: "var(--text-subtle, #777)" }}>
                      北京 {beijingFmt.format(new Date(s.iso))}
                    </span>
                  )}
                  {isLive && <span className="h-1.5 w-1.5 rounded-full animate-live" style={{ background: "var(--timing-red, #FF3B57)" }} />}
                  {done && <span style={{ color: "var(--timing-green, #3DDC97)", fontSize: "10px" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: THE MARKET panel ── */}
        {outcomes.length > 0 && (
          <div className="f1-surface-primary min-w-0" style={{ padding: "22px 22px 16px", borderRadius: "6px" }}>
            <div className="flex flex-wrap items-center justify-between" style={{ gap: "10px", marginBottom: "6px" }}>
              <span className="pw-eyebrow">
                <b>{t("theMarket")}</b>
                <span className="pw-echo">{echo(SIGNAGE.theMarket)}</span>
              </span>
              <span className={`pw-asof${stale ? " stale" : ""}`}>
                <span className="dot" />
                {stale ? tc("dataStale") : syncedAt ? `${tc("dataLive")} · ${syncedAt} UTC` : tc("dataLive")}
              </span>
            </div>
            <div className="f1-label" style={{ color: "var(--text-dim, #888)", marginBottom: "18px" }}>{panelTitle}</div>

            <div className="flex flex-col" style={{ gap: "14px" }}>
              {outcomes.map((o, i) => {
                const change = o.change24h ?? 0;
                const up = change > 0.0005;
                const down = change < -0.0005;
                const leader = i === 0;
                return (
                  <div key={o.name}>
                    <div className="flex items-baseline justify-between" style={{ marginBottom: "6px" }}>
                      <div className="flex items-center gap-2">
                        <span className="f1-data" style={{ fontSize: "10px", color: leader ? "var(--timing-purple, #B78CFF)" : "var(--text-subtle, #777)", width: "14px" }}>{i + 1}</span>
                        <span className="f1-body" style={{ fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>
                          {o.name.split(" ").pop()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        {(up || down) && (
                          <span className="f1-data" style={{ fontSize: "10px", color: up ? "var(--timing-green, #3DDC97)" : "var(--timing-yellow, #FFC838)" }}>
                            {up ? "▲" : "▼"}{Math.abs(change * 100).toFixed(1)}
                          </span>
                        )}
                        <span className="f1-data" style={{ fontSize: "16px", color: leader ? "var(--timing-purple, #B78CFF)" : "var(--text-primary, #eeeef0)" }}>
                          {(o.price * 100).toFixed(1)}<span style={{ fontSize: "11px", color: "var(--text-subtle, #777)" }}>¢</span>
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
                <a href={panelMarket.url} target="_blank" rel="noopener noreferrer" className="f1-heading" style={{ fontSize: "11px", color: "var(--timing-purple, #B78CFF)", textDecoration: "none", letterSpacing: "1px" }}>
                  {t("tradeOnPolymarket")} →
                </a>
              ) : (
                <Link href="/markets" className="f1-heading" style={{ fontSize: "11px", color: "var(--timing-purple, #B78CFF)", textDecoration: "none", letterSpacing: "1px" }}>
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
