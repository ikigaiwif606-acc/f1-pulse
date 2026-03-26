"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMarkets } from "@/lib/hooks/use-markets";

interface HeroNextRaceProps {
  race: {
    name: string;
    nameZh: string;
    circuit: string;
    circuitZh: string;
    date: string;
    round: number;
    isSprint: boolean;
  };
}

// Country flag mapping
const RACE_FLAGS: Record<string, string> = {
  Australian: "\u{1F1E6}\u{1F1FA}",
  Chinese: "\u{1F1E8}\u{1F1F3}",
  Japanese: "\u{1F1EF}\u{1F1F5}",
  Bahrain: "\u{1F1E7}\u{1F1ED}",
  "Saudi Arabian": "\u{1F1F8}\u{1F1E6}",
  Miami: "\u{1F1FA}\u{1F1F8}",
  Canadian: "\u{1F1E8}\u{1F1E6}",
  Monaco: "\u{1F1F2}\u{1F1E8}",
  Spanish: "\u{1F1EA}\u{1F1F8}",
  Austrian: "\u{1F1E6}\u{1F1F9}",
  British: "\u{1F1EC}\u{1F1E7}",
  Belgian: "\u{1F1E7}\u{1F1EA}",
  Hungarian: "\u{1F1ED}\u{1F1FA}",
  Dutch: "\u{1F1F3}\u{1F1F1}",
  Italian: "\u{1F1EE}\u{1F1F9}",
  Madrid: "\u{1F1EA}\u{1F1F8}",
  Azerbaijan: "\u{1F1E6}\u{1F1FF}",
  Singapore: "\u{1F1F8}\u{1F1EC}",
  "United States": "\u{1F1FA}\u{1F1F8}",
  "Mexico City": "\u{1F1F2}\u{1F1FD}",
  Brazilian: "\u{1F1E7}\u{1F1F7}",
  "Las Vegas": "\u{1F1FA}\u{1F1F8}",
  Qatar: "\u{1F1F6}\u{1F1E6}",
  "Abu Dhabi": "\u{1F1E6}\u{1F1EA}",
};

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function getRaceKeyword(name: string): string {
  for (const key of Object.keys(RACE_FLAGS)) {
    if (name.includes(key)) return key;
  }
  return "";
}

// Team color mapping for market preview
const TEAM_DOT_COLORS: Record<string, string> = {
  RUS: "var(--team-mercedes)",
  ANT: "var(--team-mercedes)",
  LEC: "var(--team-ferrari)",
  HAM: "var(--team-ferrari)",
  NOR: "var(--team-mclaren)",
  PIA: "var(--team-mclaren)",
  VER: "var(--team-redbull)",
  HAD: "var(--team-redbull)",
  BEA: "var(--team-haas)",
  ALO: "var(--team-aston-martin)",
};

export function HeroNextRace({ race }: HeroNextRaceProps) {
  const t = useTranslations("home");
  const tRace = useTranslations("race");
  const locale = useLocale();
  const { markets } = useMarkets();
  const [time, setTime] = useState(getTimeLeft(race.date));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(race.date)), 1000);
    return () => clearInterval(interval);
  }, [race.date]);

  const name = locale === "zh" ? race.nameZh : race.name;
  const circuit = locale === "zh" ? race.circuitZh : race.circuit;
  const keyword = getRaceKeyword(race.name);
  const flag = RACE_FLAGS[keyword] || "";

  // Get race winner top 4 from market data
  const raceWinnerMarket = markets.raceWinner?.[0];
  const top4 = raceWinnerMarket?.outcomes?.slice(0, 4) || [];

  const units = [
    { value: time.days, label: t("days") },
    { value: time.hours, label: t("hours") },
    { value: time.minutes, label: t("minutes") },
    { value: time.seconds, label: t("seconds") },
  ];

  const sessions = [
    { label: "FP1", time: "FRI 03:30 UTC", isNext: false },
    { label: "QUAL", time: "SAT 07:00 UTC", isNext: false },
    { label: "RACE", time: "SUN 06:00 UTC", isNext: true },
  ];

  return (
    <section className="hero-section relative overflow-hidden flex items-center justify-center" style={{ minHeight: "75vh", padding: "80px 40px 60px" }}>
      {/* Background layers */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 60% 40%, rgba(225,6,0,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 50% 50% at 20% 80%, rgba(39,244,210,0.04) 0%, transparent 60%),
          linear-gradient(180deg, var(--bg-primary, #07070c) 0%, #0a0a14 100%)
        `,
      }} />
      {/* Grid pattern with mask */}
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%)",
      }} />
      {/* Diagonal track line */}
      <div className="absolute left-[-10%] w-[120%] z-0" style={{
        top: "50%",
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, rgba(225,6,0,0.15) 30%, rgba(225,6,0,0.3) 50%, rgba(225,6,0,0.15) 70%, transparent 100%)",
        transform: "rotate(-3deg)",
      }} />

      {/* Content — centered */}
      <div className="relative z-10 text-center" style={{ maxWidth: "800px", animation: "heroFadeIn 0.8s ease-out" }}>
        {/* Round label */}
        <div style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "12px",
          fontWeight: 500,
          color: "#E10600",
          letterSpacing: "3px",
          textTransform: "uppercase" as const,
          marginBottom: "16px",
        }}>
          Round {race.round} &middot; {t("nextRace")}
        </div>

        {/* Flag — large */}
        {flag && (
          <div style={{ fontSize: "56px", marginBottom: "12px", filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.4))" }}>
            {flag}
          </div>
        )}

        {/* Race name — gradient text */}
        <h1 style={{
          fontFamily: "var(--font-oswald), sans-serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          marginBottom: "6px",
          background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>
          {name}
        </h1>

        {/* Venue */}
        <p style={{
          fontSize: "15px",
          color: "var(--text-secondary, #8b8b9e)",
          fontWeight: 400,
          letterSpacing: "0.5px",
          marginBottom: "40px",
        }}>
          {circuit}
        </p>

        {/* Countdown — centered */}
        <div className="flex items-center justify-center" style={{ gap: "8px", marginBottom: "36px" }}>
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center" style={{ gap: "8px" }}>
              <div className="countdown-unit-hero text-center">
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "clamp(36px, 5vw, 52px)",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "var(--text-primary, #eeeef0)",
                }}>
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="block" style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "var(--text-muted, #4e4e62)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "2px",
                  marginTop: "8px",
                }}>
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="countdown-sep-blink" style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "36px",
                  color: "var(--text-muted, #4e4e62)",
                  paddingBottom: "18px",
                }}>
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Session badges — centered */}
        <div className="flex justify-center flex-wrap" style={{ gap: "12px", marginBottom: "32px" }}>
          {sessions.map((s) => (
            <div
              key={s.label}
              className="flex items-center"
              style={{
                gap: "8px",
                padding: "8px 16px",
                background: s.isNext ? "rgba(225,6,0,0.06)" : "var(--bg-secondary, #0e0e18)",
                border: `1px solid ${s.isNext ? "rgba(225,6,0,0.3)" : "var(--border-subtle, rgba(255,255,255,0.05))"}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--text-secondary, #8b8b9e)",
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.5px",
              }}
            >
              <span style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontWeight: 600,
                color: s.isNext ? "#E10600" : "var(--text-primary, #eeeef0)",
                fontSize: "11px",
                letterSpacing: "1px",
                textTransform: "uppercase" as const,
              }}>
                {s.label}
              </span>
              {s.time}
            </div>
          ))}
        </div>

        {/* Market prediction — centered box */}
        {top4.length > 0 && (
          <div>
            <div style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "var(--text-muted, #4e4e62)",
              textTransform: "uppercase" as const,
              marginBottom: "12px",
            }}>
              Race Win Probability
            </div>
            <div className="inline-flex flex-wrap justify-center" style={{
              gap: "24px",
              padding: "16px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              borderRadius: "10px",
            }}>
              {top4.map((o) => (
                <div key={o.name} className="flex items-center" style={{ gap: "10px", fontSize: "14px", color: "var(--text-secondary, #8b8b9e)" }}>
                  <div style={{
                    width: "4px",
                    height: "20px",
                    borderRadius: "2px",
                    background: TEAM_DOT_COLORS[o.code] || o.color,
                  }} />
                  <span style={{ fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>
                    {o.name.split(" ").pop()}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "13px",
                    color: "var(--accent-green, #00d26a)",
                  }}>
                    {Math.round(o.price * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
