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
      {/* Tags */}
      <div className="mb-2 flex items-center gap-2">
        <span className="f1-label rounded bg-[#E10600] px-1.5 py-0.5 !text-white">
          Round {race.round}
        </span>
        {race.isSprint && (
          <span className="f1-label rounded border border-[#E10600]/30 px-1.5 py-0.5 !text-[#E10600]">
            Sprint
          </span>
        )}
      </div>

      {/* Race name */}
      <h2 className="f1-display-lg text-white">{name}</h2>
      <p className="f1-body-sm mt-0.5" style={{ color: "#555" }}>{circuit}</p>

      {/* Sessions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { label: tRace("fp1"), time: "FRI 03:30", active: false },
          { label: tRace("qualifying"), time: "SAT 07:00", active: false },
          { label: tRace("race"), time: "SUN 06:00", active: true },
        ].map((s) => (
          <div
            key={s.label}
            className={`f1-transition rounded border px-3 py-2 ${
              s.active
                ? "border-[#E10600]/20 bg-[#E10600]/5"
                : "border-[#1c1c1c] bg-[#0f0f0f]"
            }`}
          >
            <p className={`f1-label-xs ${s.active ? "!text-[#E10600]" : ""}`}>
              {s.label}
            </p>
            <p className={`f1-data mt-0.5 text-xs ${s.active ? "text-white" : "text-[#666]"}`}>
              {s.time} UTC
            </p>
          </div>
        ))}
      </div>

      {/* Countdown */}
      <div className="mt-6">
        <p className="f1-label-xs mb-2.5">{t("countdown")}</p>
        <div className="flex gap-2 sm:gap-3">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="relative overflow-hidden rounded border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent" />
                <span className="f1-data-xl relative text-white">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <p className="f1-label-xs mt-1.5">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
