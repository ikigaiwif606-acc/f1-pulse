"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMarkets, useChampionshipOdds } from "@/lib/hooks/use-markets";

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

const TEAM_COLORS: Record<string, string> = {
  Mercedes: "var(--team-mercedes)", Ferrari: "var(--team-ferrari)",
  McLaren: "var(--team-mclaren)", "Red Bull": "var(--team-redbull)",
  "Aston Martin": "var(--team-aston-martin)", Alpine: "var(--team-alpine)",
  Williams: "var(--team-williams)", Haas: "var(--team-haas)",
  RB: "var(--team-racing-bulls)", Audi: "#E10600",
  Cadillac: "#2D826D",
};

// Generate 7-day sparkline data
function generateSparkline(current: number, change: number): number[] {
  const points = 7;
  const data: number[] = [];
  const base = current - change;
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const noise = Math.sin(i * 2.5) * 0.02;
    data.push(base + change * progress + noise);
  }
  return data;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 72, h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 0.01;
  const pad = 3;

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = pad + ((data.length - 1) / (data.length - 1)) * (w - pad * 2);
  const lastY = pad + (1 - (data[data.length - 1] - min) / range) * (h - pad * 2);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
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
    { key: "championship", label: "WDC" },
    { key: "nextRace", label: "Race Winner" },
    { key: "constructors", label: "Constructors" },
  ];

  // Get data for active tab
  let activeData: { name: string; code: string; price: number; color: string; change: number; team: string }[] = [];

  if (activeTab === "championship") {
    activeData = championshipOdds.map((o) => ({
      name: o.name, code: o.code, price: o.odds, color: o.color,
      change: o.change, team: DRIVER_TEAM[o.code] || "",
    }));
  } else if (activeTab === "nextRace") {
    const raceMarket = markets.raceWinner?.[0];
    activeData = (raceMarket?.outcomes || []).map((o) => ({
      name: o.name, code: o.code, price: o.price, color: o.color,
      change: 0, team: DRIVER_TEAM[o.code] || "",
    }));
  } else {
    const constructorMarket = markets.championship?.find((m) => m.question.toLowerCase().includes("constructor"));
    activeData = (constructorMarket?.outcomes || []).map((o) => ({
      name: o.name, code: o.code, price: o.price,
      color: o.color, change: 0, team: "",
    }));
  }

  const displayData = expanded ? activeData : activeData.slice(0, 5);
  const hasMore = activeData.length > 5;

  return (
    <section className="section-animate">
      {/* Section header — outside the table card */}
      <div className="flex items-baseline justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-primary, #eeeef0)" }}>
            Prediction Markets
          </div>
          <div className="flex items-center" style={{ gap: "8px", marginTop: "4px", fontSize: "12px", color: "var(--text-muted, #4e4e62)", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.5px" }}>
            <span className="inline-flex items-center" style={{ gap: "5px", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--accent-green, #00d26a)", fontFamily: "var(--font-mono), monospace" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-live" style={{ background: "var(--accent-green, #00d26a)" }} />
              LIVE
            </span>
            <span>&middot; Updated every 60s &middot; Vol <span style={{ color: "var(--text-secondary, #8b8b9e)", fontWeight: 600 }}>$63.8M</span></span>
          </div>
        </div>
        <a href="/en/markets" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)", textDecoration: "none", fontWeight: 500 }}>
          All Markets &rarr;
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap" style={{ gap: "12px", marginBottom: "20px" }}>
        <div className="flex" style={{ gap: "4px", background: "var(--bg-secondary, #0e0e18)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))", borderRadius: "8px", padding: "3px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpanded(false); }}
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "7px 16px",
                borderRadius: "6px",
                color: activeTab === tab.key ? "var(--text-primary, #eeeef0)" : "var(--text-muted, #4e4e62)",
                background: activeTab === tab.key ? "var(--bg-tertiary, #161625)" : "transparent",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: "var(--bg-secondary, #0e0e18)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))", borderRadius: "12px", overflow: "hidden" }}>
        {/* Column headers */}
        <div className="hidden lg:grid items-center" style={{
          gridTemplateColumns: "36px 3px 200px 130px 100px 100px 90px 100px",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
          fontFamily: "var(--font-oswald), sans-serif",
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--text-muted, #4e4e62)",
          letterSpacing: "1.5px",
          textTransform: "uppercase" as const,
        }}>
          <span>#</span>
          <span></span>
          <span style={{ paddingLeft: "12px" }}>Driver</span>
          <span>Win Prob</span>
          <span>24H</span>
          <span>7D Trend</span>
          <span></span>
          <span></span>
        </div>

        {/* Rows */}
        {isLoading && activeData.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse" style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="h-4 w-6 rounded" style={{ background: "var(--bg-tertiary)" }} />
              <div className="h-8 flex-1 rounded" style={{ background: "var(--bg-tertiary)" }} />
            </div>
          ))
        ) : (
          displayData.map((entry, i) => {
            const pct = entry.price * 100;
            const changePct = entry.change * 100;
            const teamColor = TEAM_COLORS[entry.team] || entry.color;
            const sparkData = generateSparkline(entry.price, entry.change);
            const isUp = entry.change > 0;
            const isDown = entry.change < 0;

            return (
              <div
                key={entry.code + entry.name}
                className="lg:grid flex items-center"
                style={{
                  gridTemplateColumns: "36px 3px 200px 130px 100px 100px 90px 100px",
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover, #1c1c30)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                {/* Rank */}
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--text-muted, #4e4e62)", fontWeight: 600 }}>
                  {i + 1}
                </span>

                {/* Team bar */}
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: teamColor, transition: "height 0.2s" }} />

                {/* Driver cell */}
                <div className="flex items-center" style={{ gap: "10px", paddingLeft: "12px", flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "var(--bg-tertiary, #161625)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-oswald), sans-serif",
                    fontSize: "11px", fontWeight: 700,
                    color: "var(--text-secondary, #8b8b9e)",
                    letterSpacing: "0.5px", flexShrink: 0,
                  }}>
                    {entry.code}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>{entry.name}</div>
                    {entry.team && <div style={{ fontSize: "11px", color: "var(--text-muted, #4e4e62)", marginTop: "1px" }}>{entry.team}</div>}
                  </div>
                </div>

                {/* Probability */}
                <div className="hidden lg:flex items-center" style={{ gap: "10px" }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", fontWeight: 600, minWidth: "38px", color: "var(--text-primary, #eeeef0)" }}>
                    {pct.toFixed(0)}%
                  </span>
                  <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--bg-primary, #07070c)", overflow: "hidden", maxWidth: "70px" }}>
                    <div style={{ height: "100%", borderRadius: "3px", width: `${pct}%`, background: teamColor, transition: "width 0.6s ease" }} />
                  </div>
                </div>

                {/* Mobile: just show percentage */}
                <div className="lg:hidden ml-auto mr-2">
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>

                {/* 24H Change */}
                <div className="hidden lg:block" style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "13px", fontWeight: 500,
                  color: isUp ? "var(--accent-green, #00d26a)" : isDown ? "var(--accent-red, #ff4757)" : "var(--accent-neutral, #5a5a6e)",
                }}>
                  {entry.change === 0 ? "\u2014" : `${isUp ? "\u25B2" : "\u25BC"} ${isUp ? "+" : "-"}${Math.abs(changePct).toFixed(1)}%`}
                </div>

                {/* Sparkline */}
                <div className="hidden lg:flex items-center">
                  <Sparkline
                    data={sparkData}
                    color={isUp ? "var(--accent-green, #00d26a)" : isDown ? "var(--accent-red, #ff4757)" : "var(--accent-neutral, #5a5a6e)"}
                  />
                </div>

                {/* Spacer */}
                <span className="hidden lg:block" />

                {/* Trade button — ghost style */}
                <a
                  href="https://polymarket.com/sports/f1/props"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:block"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    fontSize: "11px", fontWeight: 600,
                    letterSpacing: "1px", textTransform: "uppercase",
                    padding: "6px 14px", borderRadius: "6px",
                    border: "1px solid var(--border-default, rgba(255,255,255,0.09))",
                    background: "transparent",
                    color: "var(--text-secondary, #8b8b9e)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E10600";
                    e.currentTarget.style.color = "#E10600";
                    e.currentTarget.style.background = "rgba(225,6,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default, rgba(255,255,255,0.09))";
                    e.currentTarget.style.color = "var(--text-secondary, #8b8b9e)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Trade
                </a>
              </div>
            );
          })
        )}

        {/* Table footer */}
        <div style={{
          padding: "12px 20px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-muted, #4e4e62)",
          borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
        }}>
          {hasMore ? (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ color: "var(--text-secondary, #8b8b9e)", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "12px" }}
            >
              {expanded ? "Show less" : `View all ${activeData.length} ${activeTab === "constructors" ? "teams" : "drivers"} \u2192`}
            </button>
          ) : (
            <span>{t("lastUpdated")}: {isLoading ? t("refreshing") : t("justNow")}</span>
          )}
        </div>
      </div>
    </section>
  );
}
