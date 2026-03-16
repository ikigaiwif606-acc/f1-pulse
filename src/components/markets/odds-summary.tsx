"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

// Placeholder data — will be fetched from Polymarket API in Phase 1b
const CHAMPIONSHIP_ODDS = [
  { name: "George Russell", odds: 0.57, volume: "$18.2M", change: +0.05 },
  { name: "Kimi Antonelli", odds: 0.15, volume: "$8.4M", change: +0.03 },
  { name: "Charles Leclerc", odds: 0.10, volume: "$6.1M", change: -0.02 },
  { name: "Lando Norris", odds: 0.08, volume: "$5.7M", change: +0.01 },
  { name: "Max Verstappen", odds: 0.05, volume: "$4.9M", change: -0.04 },
];

export function OddsSummary() {
  const t = useTranslations("markets");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("championship")} — Drivers&apos; Champion 2026
        </h3>
        <Badge variant="outline" className="text-xs">
          {t("volume")}: $63.8M+
        </Badge>
      </div>

      <div className="space-y-3">
        {CHAMPIONSHIP_ODDS.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{entry.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  entry.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {entry.change > 0 ? "+" : ""}
                {(entry.change * 100).toFixed(0)}%
              </span>
              <div className="w-16 rounded-md bg-accent px-2 py-1 text-center text-sm font-bold">
                {(entry.odds * 100).toFixed(0)}%
              </div>
              <span className="w-16 text-right text-xs text-muted-foreground">
                {entry.volume}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("betOn")} &rarr;
        </a>
      </div>
    </div>
  );
}
