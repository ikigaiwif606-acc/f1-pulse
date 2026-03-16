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
      <div className="mb-4 flex items-center justify-between">
        <span className="f1-heading" style={{ color: "#666" }}>
          Drivers&apos; Champion 2026
        </span>
        <div className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
          <span className="f1-label-xs">Vol</span>
          <span className="f1-data text-xs text-[#666]">$63.8M</span>
        </div>
      </div>

      <div className="space-y-1">
        {CHAMPIONSHIP_ODDS.map((entry, i) => (
          <div
            key={entry.name}
            className="f1-transition group flex items-center gap-3 rounded bg-[#0f0f0f] p-2.5 hover:bg-[#131313]"
          >
            <span className="f1-data w-4 text-center text-xs" style={{ color: "#444" }}>
              {i + 1}
            </span>

            <div className="f1-team-bar h-6" style={{ backgroundColor: entry.color }} />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="f1-data text-[0.625rem]" style={{ color: "#444" }}>
                  {entry.code}
                </span>
                <span className="f1-body-sm font-semibold text-white truncate">{entry.name}</span>
              </div>
              <div className="mt-1 h-[3px] w-full rounded-full bg-[#161616]">
                <div
                  className="h-[3px] rounded-full f1-transition"
                  style={{ width: `${entry.odds * 100}%`, backgroundColor: entry.color }}
                />
              </div>
            </div>

            <span className={`f1-data text-xs ${entry.change > 0 ? "text-emerald-400" : "text-[#E10600]"}`}>
              {entry.change > 0 ? "+" : ""}{(entry.change * 100).toFixed(0)}%
            </span>

            <div className="w-14 rounded border border-[#1c1c1c] bg-[#0a0a0a] py-1 text-center">
              <span className="f1-data text-sm text-white">{(entry.odds * 100).toFixed(0)}</span>
              <span className="f1-label-xs ml-px">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
          {t("lastUpdated")}: 2 min ago
        </span>
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
        >
          {t("betOn")} &rarr;
        </a>
      </div>
    </div>
  );
}
