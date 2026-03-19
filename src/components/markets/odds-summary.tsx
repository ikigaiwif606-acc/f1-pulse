"use client";

import { useTranslations } from "next-intl";
import { useChampionshipOdds } from "@/lib/hooks/use-markets";

// Team name mapping for display
const TEAM_MAP: Record<string, string> = {
  RUS: "Mercedes", ANT: "Mercedes",
  LEC: "Ferrari", HAM: "Ferrari",
  NOR: "McLaren", PIA: "McLaren",
  VER: "Red Bull", HAD: "Red Bull",
  BEA: "Haas", OCO: "Haas",
  GAS: "Alpine", COL: "Alpine",
  LAW: "RB", LIN: "RB",
  SAI: "Williams", ALB: "Williams",
  BOR: "Audi", HUL: "Audi",
  ALO: "Aston Martin", STR: "Aston Martin",
  BOT: "Cadillac", PER: "Cadillac",
};

export function OddsSummary() {
  const t = useTranslations("markets");
  const { odds, isLoading } = useChampionshipOdds();

  return (
    <div>
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="f1-heading" style={{ color: "var(--text-dim)" }}>
          Drivers&apos; Champion 2026
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.6)] px-2.5 py-1">
            <span className="f1-label-xs">Vol</span>
            <span className="font-mono text-xs tabular-nums text-[var(--text-dim)]">$63.8M</span>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden sm:flex items-center gap-3 px-3 py-2 mb-1">
        <span className="f1-label-xs w-5 text-center">#</span>
        <span className="f1-label-xs w-8" />
        <span className="f1-label-xs flex-1">Driver</span>
        <span className="f1-label-xs w-16 text-center hidden md:block">Team</span>
        <span className="f1-label-xs w-40 text-center hidden lg:block">Win Probability</span>
        <span className="f1-label-xs w-14 text-center">Odds</span>
        <span className="f1-label-xs w-12 text-center">Trend</span>
        <span className="f1-label-xs w-20 text-center">Action</span>
      </div>

      {/* Driver rows */}
      <div className="space-y-1">
        {odds.map((entry, i) => {
          const pct = entry.odds * 100;
          const team = TEAM_MAP[entry.code] || "";

          return (
            <div
              key={entry.name}
              className="odds-row f1-transition group flex items-center gap-3 bg-[rgba(15,15,15,0.4)] p-2.5 sm:p-3 hover:bg-[rgba(20,20,20,0.6)]"
            >
              {/* Progress bar background fill */}
              <div
                className="odds-row-bg"
                style={{ width: `${pct}%`, backgroundColor: entry.color }}
              />

              {/* Rank */}
              <span className="font-mono w-5 text-center text-xs tabular-nums relative" style={{ color: "var(--text-dim)" }}>
                {i + 1}
              </span>

              {/* Avatar placeholder */}
              <div className="driver-avatar relative" style={{ borderColor: entry.color }}>
                <span className="f1-data text-[0.5rem]" style={{ color: entry.color }}>
                  {entry.code.slice(0, 2)}
                </span>
              </div>

              {/* Team color bar */}
              <div className="f1-team-bar h-7 relative" style={{ backgroundColor: entry.color }} />

              {/* Driver name */}
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: "var(--text-ghost)" }}>
                    {entry.code}
                  </span>
                  <span className="f1-body-sm font-semibold text-white truncate">{entry.name}</span>
                </div>
                {/* Team shown inline on mobile, separate column on md+ */}
                <span className="f1-label-xs md:hidden" style={{ color: "var(--text-ghost)" }}>{team}</span>
              </div>

              {/* Team column (desktop) */}
              <span className="f1-label-xs w-16 text-center hidden md:block relative" style={{ color: "var(--text-ghost)" }}>
                {team}
              </span>

              {/* Visual probability bar (desktop) */}
              <div className="w-40 hidden lg:flex items-center gap-2 relative">
                <div className="flex-1 h-2 rounded-full bg-[#161616] overflow-hidden">
                  <div
                    className="h-full rounded-full f1-transition"
                    style={{ width: `${pct}%`, backgroundColor: entry.color }}
                  />
                </div>
                <span className="font-mono text-[0.625rem] tabular-nums text-white w-8 text-right">
                  {pct.toFixed(0)}%
                </span>
              </div>

              {/* Odds box */}
              <div className="w-14 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.5)] py-1.5 text-center relative">
                <span className="font-mono text-sm tabular-nums font-bold text-white">{pct.toFixed(0)}</span>
                <span className="f1-label-xs ml-px">%</span>
              </div>

              {/* Trend */}
              <span className={`font-mono text-xs tabular-nums w-12 text-center relative font-bold ${
                entry.change > 0 ? "text-emerald-400" : entry.change < 0 ? "text-rose-500" : "text-[var(--text-ghost)]"
              }`}>
                {entry.change > 0 ? "▲" : entry.change < 0 ? "▼" : "—"} {entry.change !== 0 ? `${Math.abs(entry.change * 100).toFixed(0)}%` : ""}
              </span>

              {/* Trade button */}
              <a
                href={`https://polymarket.com/sports/f1/props`}
                target="_blank"
                rel="noopener noreferrer"
                className="trade-btn relative hidden sm:block"
              >
                Trade
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
          {t("lastUpdated")}: {isLoading ? "refreshing..." : "just now"}
        </span>
        <a
          href="https://polymarket.com/sports/f1/props"
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
