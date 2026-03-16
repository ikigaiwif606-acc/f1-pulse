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
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-sm text-muted-foreground">
          Round {race.round} &middot; {circuit}
        </p>
      </div>

      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        {t("countdown")}
      </p>

      <div className="flex gap-4">
        {[
          { value: time.days, label: t("days") },
          { value: time.hours, label: t("hours") },
          { value: time.minutes, label: t("minutes") },
          { value: time.seconds, label: t("seconds") },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="rounded-lg bg-accent px-4 py-3 text-3xl font-bold tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
