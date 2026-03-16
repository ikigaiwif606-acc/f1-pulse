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

  return (
    <div>
      {/* Race info */}
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-[#E10600] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
          Round {race.round}
        </span>
        {race.isSprint && (
          <span className="rounded border border-[#E10600]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#E10600]">
            Sprint
          </span>
        )}
      </div>

      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
        {name}
      </h2>
      <p className="mt-0.5 text-xs text-[#737373]">{circuit}</p>

      {/* Session schedule */}
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          { label: tRace("fp1"), time: "FRI 03:30", dim: true },
          { label: tRace("qualifying"), time: "SAT 07:00", dim: true },
          { label: tRace("race"), time: "SUN 06:00", dim: false },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded border px-2.5 py-1.5 ${
              s.dim
                ? "border-[#1f1f1f] bg-[#111]"
                : "border-[#E10600]/30 bg-[#E10600]/5"
            }`}
          >
            <p className={`text-[9px] font-bold uppercase tracking-widest ${s.dim ? "text-[#4a4a4a]" : "text-[#E10600]"}`}>
              {s.label}
            </p>
            <p className={`timing-number text-xs font-bold ${s.dim ? "text-[#737373]" : "text-white"}`}>
              {s.time} UTC
            </p>
          </div>
        ))}
      </div>

      {/* Countdown */}
      <div className="mt-6">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#4a4a4a]">
          {t("countdown")}
        </p>
        <div className="flex gap-2 sm:gap-3">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="relative overflow-hidden rounded-md border border-[#1f1f1f] bg-[#111] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                <span className="timing-number relative text-2xl font-bold text-white sm:text-4xl">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
