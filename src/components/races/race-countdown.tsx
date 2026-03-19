"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface RaceCountdownProps {
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

export function RaceCountdown({ race }: RaceCountdownProps) {
  const t = useTranslations("home");
  const tRace = useTranslations("race");
  const locale = useLocale();
  const [time, setTime] = useState(getTimeLeft(race.date));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(race.date)), 1000);
    return () => clearInterval(interval);
  }, [race.date]);

  const name = locale === "zh" ? race.nameZh : race.name;
  const circuit = locale === "zh" ? race.circuitZh : race.circuit;

  const units = [
    { value: time.days, label: t("days") },
    { value: time.hours, label: t("hours") },
    { value: time.minutes, label: t("minutes") },
    { value: time.seconds, label: t("seconds") },
  ];

  const sessions = [
    { label: tRace("fp1"), time: "FRI 03:30", active: false, dot: "bg-[#444]" },
    { label: tRace("qualifying"), time: "SAT 07:00", active: false, dot: "bg-[#f59e0b]" },
    { label: tRace("race"), time: "SUN 06:00", active: true, dot: "bg-[#22c55e]" },
  ];

  return (
    <div>
      {/* Race header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="f1-label rounded bg-[#E10600] px-1.5 py-0.5 !text-white">
              {t("round")} {race.round}
            </span>
            {race.isSprint && (
              <span className="f1-label rounded border border-[#E10600]/30 px-1.5 py-0.5 !text-[#E10600]">
                {tRace("sprint")}
              </span>
            )}
          </div>
          <h2 className="f1-display-lg text-white">{name}</h2>
          <p className="f1-body-sm mt-0.5" style={{ color: "var(--text-dim)" }}>{circuit}</p>
        </div>

        {/* Countdown — massive blocks */}
        <div className="flex gap-2 sm:gap-3">
          {units.map((unit, i) => (
            <div key={unit.label} className="text-center">
              <div className="countdown-block">
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums text-white relative">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <p className="f1-label-xs mt-1.5">{unit.label}</p>
              {/* Colon separator (except last) */}
              {i < units.length - 1 && (
                <span className="hidden" aria-hidden="true">:</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session timeline — horizontal */}
      <div className="session-timeline gap-2 sm:gap-3">
        {sessions.map((s) => (
          <div
            key={s.label}
            className={`session-card f1-transition rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 ${
              s.active
                ? "border-[#E10600]/30 bg-[#E10600]/5"
                : "border-[rgba(255,255,255,0.06)] bg-[rgba(15,15,15,0.4)]"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-2 w-2 rounded-full ${s.dot} ${s.active ? "animate-live" : ""}`} />
              <p className={`f1-label-xs ${s.active ? "!text-[#E10600]" : ""}`}>
                {s.label}
              </p>
              {s.active && (
                <span className="f1-label-xs !text-[#E10600] ml-auto">NEXT</span>
              )}
            </div>
            <p className={`font-mono text-xs tabular-nums ${s.active ? "text-white font-bold" : "text-[var(--text-dim)]"}`}>
              {s.time} UTC
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
