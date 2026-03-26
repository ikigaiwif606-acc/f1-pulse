"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMarkets, useChampionshipOdds } from "@/lib/hooks/use-markets";
import type { MarketListItem } from "@/types";

// Team name → color mapping
const TEAM_COLORS: Record<string, string> = {
  Mercedes: "#27F4D2",
  Ferrari: "#E80020",
  McLaren: "#FF8000",
  "Red Bull": "#3671C6",
  "Aston Martin": "#229971",
  Alpine: "#FF87BC",
  Williams: "#64C4FF",
  Haas: "#B6BABD",
  "Kick Sauber": "#52E252",
  Audi: "#E10600",
  RB: "#6692FF",
  Cadillac: "#2D826D",
};

// Driver code → team mapping
const DRIVER_TEAM: Record<string, string> = {
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

// Static sparkline data — simulates 7-day trends
function generateSparkline(current: number, change: number): number[] {
  const points = 7;
  const data: number[] = [];
  const base = current - change;
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const noise = (Math.sin(i * 2.5) * 0.02);
    data.push(base + (change * progress) + noise);
  }
  return data;
}

function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 0.01;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.7}
      />
    </svg>
  );
}

type TabKey = "championship" | "nextRace" | "constructors";

export function MarketOverview() {
  const t = useTranslations("markets");
  const tCommon = useTranslations("common");
  const { markets, isLoading } = useMarkets();
  const { odds: championshipOdds } = useChampionshipOdds();
  const [activeTab, setActiveTab] = useState<TabKey>("championship");
  const [expanded, setExpanded] = useState(false);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "championship", label: t("championship") },
    { key: "nextRace", label: t("raceWinner") },
    { key: "constructors", label: "Constructors" },
  ];

  // Get data for active tab
  let activeData: { name: string; code: string; price: number; color: string; change: number; team: string }[] = [];

  if (activeTab === "championship") {
    activeData = championshipOdds.map((o) => ({
      name: o.name,
      code: o.code,
      price: o.odds,
      color: o.color,
      change: o.change,
      team: DRIVER_TEAM[o.code] || "",
    }));
  } else if (activeTab === "nextRace") {
    const raceMarket = markets.raceWinner?.[0];
    activeData = (raceMarket?.outcomes || []).map((o) => ({
      name: o.name,
      code: o.code,
      price: o.price,
      color: o.color,
      change: 0,
      team: DRIVER_TEAM[o.code] || "",
    }));
  } else if (activeTab === "constructors") {
    const constructorMarket = markets.championship?.find((m) =>
      m.question.toLowerCase().includes("constructor")
    );
    activeData = (constructorMarket?.outcomes || []).map((o) => ({
      name: o.name,
      code: o.code,
      price: o.price,
      color: TEAM_COLORS[o.name] || o.color,
      change: 0,
      team: "",
    }));
  }

  const displayData = expanded ? activeData : activeData.slice(0, 5);
  const hasMore = activeData.length > 5;

  return (
    <section className="animate-fade-up stagger-1">
      <div className="f1-surface p-5 sm:p-6">
        {/* Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="f1-accent-bar" />
              <h2 className="f1-heading text-white">Prediction Markets</h2>
              <span className="f1-label-xs rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 !text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-live mr-1" style={{ verticalAlign: "middle" }} />
                Live
              </span>
            </div>
            <p className="f1-label-xs !text-[var(--text-ghost)] ml-4">
              {t("updatedEvery60s")} &middot; {t("totalVol")}: $63.8M
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.5)] p-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setExpanded(false); }}
                className={`f1-transition f1-label px-3 py-1.5 rounded-md ${
                  activeTab === tab.key
                    ? "bg-[rgba(225,6,0,0.15)] !text-[#E10600]"
                    : "!text-[var(--text-ghost)] hover:!text-white"
                }`}
                style={{ fontSize: "0.625rem" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:grid items-center gap-3 px-3 py-2 mb-1" style={{ gridTemplateColumns: "2rem 3px 1fr 4.5rem 5rem 5rem 5rem 5rem" }}>
          <span className="f1-label-xs text-center">#</span>
          <span />
          <span className="f1-label-xs">Driver</span>
          <span className="f1-label-xs text-center hidden md:block">Team</span>
          <span className="f1-label-xs text-center hidden lg:block">Win Prob</span>
          <span className="f1-label-xs text-center">Odds</span>
          <span className="f1-label-xs text-center hidden md:block">24H</span>
          <span className="f1-label-xs text-center hidden lg:block">Trend</span>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {isLoading && activeData.length === 0 ? (
            // Skeleton loading
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-[rgba(15,15,15,0.4)] rounded-lg p-3 animate-pulse">
                <div className="h-4 w-6 rounded bg-[#161616]" />
                <div className="h-8 flex-1 rounded bg-[#161616]" />
              </div>
            ))
          ) : (
            displayData.map((entry, i) => {
              const pct = entry.price * 100;
              const changePct = entry.change * 100;
              const teamColor = entry.color || TEAM_COLORS[entry.team] || "#666";
              const sparkData = generateSparkline(entry.price, entry.change);
              const isUp = entry.change > 0;
              const isDown = entry.change < 0;
              const isFlat = entry.change === 0;

              return (
                <div
                  key={entry.code + entry.name}
                  className="odds-row f1-transition group sm:grid flex items-center gap-3 bg-[rgba(15,15,15,0.4)] p-2.5 sm:p-3 hover:bg-[rgba(20,20,20,0.6)]"
                  style={{ gridTemplateColumns: "2rem 3px 1fr 4.5rem 5rem 5rem 5rem 5rem", minHeight: "56px" }}
                >
                  {/* Progress bar background */}
                  <div className="odds-row-bg" style={{ width: `${pct}%`, backgroundColor: teamColor }} />

                  {/* Rank */}
                  <span className="font-mono text-xs tabular-nums text-center relative" style={{ color: "var(--text-dim)" }}>
                    {i + 1}
                  </span>

                  {/* Team color bar */}
                  <div
                    className="h-6 rounded-sm relative f1-transition shrink-0"
                    style={{
                      width: "3px",
                      backgroundColor: teamColor,
                      transition: "height 0.2s ease",
                    }}
                  />

                  {/* Name + Team */}
                  <div className="flex-1 min-w-0 relative">
                    <span className="f1-body-sm font-semibold text-white truncate block">{entry.name}</span>
                    {entry.team && (
                      <span className="f1-label-xs sm:hidden" style={{ color: "var(--text-ghost)" }}>{entry.team}</span>
                    )}
                  </div>

                  {/* Team (desktop) */}
                  <span className="f1-label-xs text-center hidden md:block relative" style={{ color: "var(--text-ghost)" }}>
                    {entry.team}
                  </span>

                  {/* Win probability bar (desktop) */}
                  <div className="hidden lg:flex items-center gap-1.5 relative">
                    <div className="flex-1 h-1.5 rounded-full bg-[#161616] overflow-hidden">
                      <div
                        className="h-full rounded-full f1-transition"
                        style={{ width: `${pct}%`, backgroundColor: teamColor }}
                      />
                    </div>
                  </div>

                  {/* Odds box */}
                  <div className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.5)] py-1.5 text-center relative">
                    <span className="font-mono text-sm tabular-nums font-bold text-white">{pct.toFixed(0)}</span>
                    <span className="f1-label-xs ml-px">%</span>
                  </div>

                  {/* 24H Change */}
                  <span className={`font-mono text-xs tabular-nums text-center relative font-bold hidden md:block ${
                    isUp ? "text-[#00d26a]" : isDown ? "text-[#ff4757]" : "text-[var(--text-ghost)]"
                  }`}>
                    {isFlat
                      ? "\u2014"
                      : `${isUp ? "\u25B2" : "\u25BC"} ${Math.abs(changePct).toFixed(1)}%`}
                  </span>

                  {/* Sparkline */}
                  <div className="hidden lg:flex items-center justify-center relative">
                    <Sparkline
                      data={sparkData}
                      color={isUp ? "#00d26a" : isDown ? "#ff4757" : "#6c6c7a"}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
              {t("lastUpdated")}: {isLoading ? t("refreshing") : t("justNow")}
            </span>
            {hasMore && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
              >
                {expanded
                  ? (tCommon("viewAll").replace("All", "Less"))
                  : `${tCommon("viewAll")} ${activeData.length} ${activeTab === "constructors" ? "teams" : "drivers"} \u2192`}
              </button>
            )}
          </div>
          <a
            href="https://polymarket.com/sports/f1/props"
            target="_blank"
            rel="noopener noreferrer"
            className="trade-btn hidden sm:block"
          >
            Trade &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
