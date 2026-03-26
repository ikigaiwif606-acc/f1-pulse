"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMarkets } from "@/lib/hooks/use-markets";
import { Link } from "@/lib/i18n/navigation";

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

// Country-inspired gradient accents
const RACE_ACCENT: Record<string, string> = {
  Japanese: "#BC002D",
  Australian: "#012169",
  Chinese: "#DE2910",
  Bahrain: "#CE1126",
  "Saudi Arabian": "#006C35",
  Miami: "#FF6B35",
  Canadian: "#FF0000",
  Monaco: "#CE1126",
  Spanish: "#F1BF00",
  Austrian: "#ED2939",
  British: "#012169",
  Belgian: "#FDDA24",
  Hungarian: "#477050",
  Dutch: "#FF6600",
  Italian: "#008C45",
  Madrid: "#F1BF00",
  Azerbaijan: "#00B5E2",
  Singapore: "#EF3340",
  "United States": "#3C3B6E",
  "Mexico City": "#006847",
  Brazilian: "#009B3A",
  "Las Vegas": "#B8860B",
  Qatar: "#8D1B3D",
  "Abu Dhabi": "#000000",
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

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlipping(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="text-center">
      <div className="countdown-block-hero">
        <span
          className={`font-mono text-4xl sm:text-5xl lg:text-[4rem] font-bold tabular-nums text-white relative transition-opacity duration-200 ${
            flipping ? "opacity-40" : "opacity-100"
          }`}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <p className="f1-label-xs mt-2">{label}</p>
    </div>
  );
}

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
  const accent = RACE_ACCENT[keyword] || "#E10600";

  // Get race winner top 3 from market data
  const raceWinnerMarket = markets.raceWinner?.[0];
  const top3 = raceWinnerMarket?.outcomes?.slice(0, 3) || [];

  const units = [
    { value: time.days, label: t("days") },
    { value: time.hours, label: t("hours") },
    { value: time.minutes, label: t("minutes") },
    { value: time.seconds, label: t("seconds") },
  ];

  const sessions = [
    { label: "FP1", time: "FRI 03:30", day: tRace("fp1") },
    { label: "QUAL", time: "SAT 07:00", day: tRace("qualifying") },
    { label: "RACE", time: "SUN 06:00", day: tRace("race") },
  ];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "55vh" }}>
      {/* Dynamic gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, ${accent}15 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, #E1060010 0%, transparent 50%),
            linear-gradient(to bottom, #0a0a0f, #080808)
          `,
        }}
      />
      {/* Geometric grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      {/* Top glow */}
      <div
        className="absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: `${accent}20` }}
      />

      <div className="relative mx-auto max-w-7xl px-5 flex flex-col justify-center" style={{ minHeight: "55vh", paddingTop: "3rem", paddingBottom: "3rem" }}>
        {/* Round badge */}
        <div className="mb-6 flex items-center gap-3 animate-fade-up">
          <span className="f1-label rounded bg-[#E10600] px-2 py-1 !text-white !text-[0.6875rem]">
            {t("round")} {race.round}
          </span>
          <span className="f1-label !text-[var(--text-ghost)]">{t("nextRace")}</span>
          {race.isSprint && (
            <span className="f1-label rounded border border-[#E10600]/30 px-2 py-1 !text-[#E10600]">
              {tRace("sprint")}
            </span>
          )}
        </div>

        {/* Race name */}
        <div className="mb-8 animate-fade-up stagger-1">
          <h1 className="f1-display-xl text-white mb-2">
            {flag && <span className="mr-3">{flag}</span>}
            {name}
          </h1>
          <p className="f1-body text-[var(--text-dim)]">{circuit}</p>
        </div>

        {/* Countdown */}
        <div className="flex gap-3 sm:gap-4 mb-8 animate-fade-up stagger-2">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
              <CountdownDigit value={unit.value} label={unit.label} />
              {i < units.length - 1 && (
                <span className="font-mono text-2xl sm:text-3xl text-[var(--text-ghost)] font-light -mt-6">:</span>
              )}
            </div>
          ))}
        </div>

        {/* Session badges */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 animate-fade-up stagger-3">
          {sessions.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(15,15,15,0.5)] backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2.5"
            >
              <span className="f1-label-xs !text-[var(--text-dim)]">{s.label}</span>
              <span className="font-mono text-xs tabular-nums text-white">{s.time} UTC</span>
            </div>
          ))}
        </div>

        {/* Market prediction top 3 */}
        {top3.length > 0 && (
          <div className="animate-fade-up stagger-4">
            <Link
              href="/markets"
              className="inline-flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,15,15,0.4)] backdrop-blur-sm px-4 py-3 f1-transition hover:border-[rgba(255,255,255,0.12)] group"
            >
              <span className="f1-label-xs !text-[var(--text-ghost)]">
                {locale === "zh" ? "市场预测" : "Market Prediction"}
              </span>
              <div className="flex items-center gap-4">
                {top3.map((o) => (
                  <div key={o.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-0.5 rounded-full" style={{ backgroundColor: o.color }} />
                    <span className="f1-body-sm text-white">{o.name.split(" ").pop()}</span>
                    <span className="font-mono text-xs tabular-nums font-bold" style={{ color: o.color }}>
                      {Math.round(o.price * 100)}%
                    </span>
                  </div>
                ))}
              </div>
              <span className="f1-label-xs !text-[var(--text-ghost)] group-hover:!text-white f1-transition">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
