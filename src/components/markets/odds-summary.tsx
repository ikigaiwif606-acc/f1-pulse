"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

// Placeholder data — will be fetched from Polymarket API in Phase 1b
const CHAMPIONSHIP_ODDS = [
  { name: "George Russell", code: "RUS", odds: 0.57, volume: "$18.2M", change: +0.05, color: "#27F4D2" },
  { name: "Kimi Antonelli", code: "ANT", odds: 0.15, volume: "$8.4M", change: +0.03, color: "#27F4D2" },
  { name: "Charles Leclerc", code: "LEC", odds: 0.10, volume: "$6.1M", change: -0.02, color: "#E80020" },
  { name: "Lando Norris", code: "NOR", odds: 0.08, volume: "$5.7M", change: +0.01, color: "#FF8000" },
  { name: "Max Verstappen", code: "VER", odds: 0.05, volume: "$4.9M", change: -0.04, color: "#3671C6" },
];

export function OddsSummary() {
  const t = useTranslations("markets");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Drivers&apos; Champion 2026
        </h3>
        <Badge variant="outline" className="text-[10px]">
          {t("volume")}: $63.8M+
        </Badge>
      </div>

      <div className="space-y-2.5">
        {CHAMPIONSHIP_ODDS.map((entry) => (
          <div key={entry.name} className="group">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-8">
                  {entry.code}
                </span>
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    entry.change > 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {entry.change > 0 ? "+" : ""}
                  {(entry.change * 100).toFixed(0)}%
                </span>
                <span className="w-10 text-right text-sm font-bold tabular-nums">
                  {(entry.odds * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            {/* Probability bar */}
            <div className="h-1.5 w-full rounded-full bg-accent/50">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${entry.odds * 100}%`,
                  backgroundColor: entry.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[10px] text-muted-foreground">
          {t("lastUpdated")}: 2 min ago
        </span>
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-red-500 hover:text-red-400"
        >
          {t("betOn")} &rarr;
        </a>
      </div>
    </div>
  );
}
