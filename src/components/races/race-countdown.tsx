"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

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
    const interval = setInterval(() => {
      setTime(getTimeLeft(race.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [race.date]);

  const name = locale === "zh" ? race.nameZh : race.name;
  const circuit = locale === "zh" ? race.circuitZh : race.circuit;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* Left — Race info */}
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">{name}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Round {race.round} &middot; {circuit}
        </p>
        {/* Session times */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{tRace("fp1")}: Fri 03:30 UTC</span>
          <span>{tRace("qualifying")}: Sat 07:00 UTC</span>
          <span className="font-medium text-foreground">{tRace("race")}: Sun 06:00 UTC</span>
        </div>
      </div>

      {/* Right — Countdown */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("countdown")}
        </p>
        <div className="flex gap-2 sm:gap-3">
          {[
            { value: time.days, label: t("days") },
            { value: time.hours, label: t("hours") },
            { value: time.minutes, label: t("minutes") },
            { value: time.seconds, label: t("seconds") },
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="rounded-lg bg-accent/80 px-2.5 py-2 text-2xl font-bold tabular-nums sm:px-3 sm:text-3xl">
                {String(unit.value).padStart(2, "0")}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
