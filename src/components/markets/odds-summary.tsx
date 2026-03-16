"use client";

import { useTranslations } from "next-intl";

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
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#737373]">
            Drivers&apos; Champion 2026
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded border border-[#1f1f1f] bg-[#111] px-2 py-0.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
            Vol
          </span>
          <span className="timing-number text-[10px] font-bold text-[#737373]">
            $63.8M
          </span>
        </div>
      </div>

      {/* Odds rows */}
      <div className="space-y-1.5">
        {CHAMPIONSHIP_ODDS.map((entry, i) => (
          <div
            key={entry.name}
            className="group flex items-center gap-3 rounded border border-transparent bg-[#111] p-2 transition-all hover:border-[#2a2a2a]"
          >
            {/* Position */}
            <span className="w-4 text-center text-[10px] font-bold text-[#4a4a4a]">
              {i + 1}
            </span>

            {/* Team color bar */}
            <div className="h-6 w-0.5 rounded-full" style={{ backgroundColor: entry.color }} />

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="timing-number text-[10px] font-bold text-[#4a4a4a]">
                  {entry.code}
                </span>
                <span className="text-sm font-medium text-white truncate">{entry.name}</span>
              </div>
              {/* Odds bar */}
              <div className="mt-1 h-[3px] w-full rounded-full bg-[#1a1a1a]">
                <div
                  className="h-[3px] rounded-full transition-all duration-700"
                  style={{ width: `${entry.odds * 100}%`, backgroundColor: entry.color }}
                />
              </div>
            </div>

            {/* Change */}
            <span
              className={`timing-number text-[11px] font-bold ${
                entry.change > 0 ? "text-emerald-400" : "text-[#E10600]"
              }`}
            >
              {entry.change > 0 ? "+" : ""}
              {(entry.change * 100).toFixed(0)}%
            </span>

            {/* Odds */}
            <div className="w-14 rounded border border-[#1f1f1f] bg-[#0a0a0a] py-1 text-center">
              <span className="timing-number text-sm font-bold text-white">
                {(entry.odds * 100).toFixed(0)}
              </span>
              <span className="text-[9px] text-[#4a4a4a]">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#2a2a2a]">
          {t("lastUpdated")}: 2 min ago
        </span>
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest text-[#E10600] transition-opacity hover:opacity-70"
        >
          {t("betOn")} &rarr;
        </a>
      </div>
    </div>
  );
}
