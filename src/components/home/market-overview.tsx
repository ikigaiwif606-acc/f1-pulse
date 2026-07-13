"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { MarketsMeta } from "@/lib/data/markets";
import type { MarketOutcomeItem } from "@/types";

// Driver code → team mapping (2026 grid)
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

/** Real 7-day trend from the live snapshot: price 7d ago → 24h ago → now. */
function trendPoints(o: MarketOutcomeItem): number[] | null {
  if (o.change7d === undefined && o.change24h === undefined) return null;
  const now = o.price;
  const points = [now - (o.change7d ?? 0), now - (o.change24h ?? 0), now];
  return points;
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

  const lastY = pad + (1 - (data[data.length - 1] - min) / range) * (h - pad * 2);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={w - pad} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

type TabKey = "championship" | "nextRace" | "constructors";

export function MarketOverview({ initial }: { initial?: MarketsMeta }) {
  const t = useTranslations("markets");
  const tHome = useTranslations("home");
  const { markets, isLoading } = useMarkets(initial);
  const [activeTab, setActiveTab] = useState<TabKey>("championship");
  const [expanded, setExpanded] = useState(false);

  const wdcMarket = markets.championship?.find((m) => m.question.toLowerCase().includes("driver"));
  const wccMarket = markets.championship?.find((m) => m.question.toLowerCase().includes("constructor"));
  const raceMarket = markets.raceWinner?.find((m) => m.question.toLowerCase().includes("driver winner")) || markets.raceWinner?.[0];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "championship", label: "WDC" },
    { key: "nextRace", label: t("raceWinner") },
    { key: "constructors", label: t("championship") },
  ];

  const activeMarket =
    activeTab === "championship" ? wdcMarket : activeTab === "nextRace" ? raceMarket : wccMarket;
  const activeData = activeMarket?.outcomes || [];
  const tradeUrl = activeMarket?.url || "https://polymarket.com/sports/f1/props";
  const totalVolume = wdcMarket?.volume || activeMarket?.volume || "";

  const displayData = expanded ? activeData : activeData.slice(0, 5);
  const hasMore = activeData.length > 5;

  return (
    <section className="section-animate">
      {/* Section header */}
      <div className="flex items-baseline justify-between" style={{ marginBottom: "20px" }}>
        <div>
          <div className="f1-display-lg" style={{ fontSize: "22px", color: "var(--text-primary, #eeeef0)" }}>
            {tHome("predictionMarkets")}
          </div>
          <div className="flex items-center f1-data" style={{ gap: "8px", marginTop: "6px", fontSize: "12px", color: "var(--text-dim, #888)", letterSpacing: "0.5px" }}>
            <span className="inline-flex items-center" style={{ gap: "5px", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--accent-green, #00d26a)" }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-live" style={{ background: "var(--accent-green, #00d26a)" }} />
              {t("liveOdds")}
            </span>
            <span>· {t("updatedEvery60s")} · {t("totalVol")} <span style={{ color: "var(--text-secondary, #8b8b9e)", fontWeight: 600 }}>{totalVolume}</span></span>
          </div>
        </div>
        <Link href="/markets" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)", textDecoration: "none", fontWeight: 500 }}>
          {tHome("allMarkets")} →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap" style={{ gap: "12px", marginBottom: "20px" }}>
        <div className="flex" style={{ gap: "4px", background: "var(--bg-secondary, #0e0e18)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))", borderRadius: "8px", padding: "3px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpanded(false); }}
              className="f1-heading"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.8px",
                padding: "7px 16px",
                borderRadius: "6px",
                color: activeTab === tab.key ? "var(--text-primary, #eeeef0)" : "var(--text-dim, #888)",
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
        {activeTab === "nextRace" && raceMarket && (
          <span className="f1-label" style={{ color: "var(--text-dim, #888)" }}>{raceMarket.question}</span>
        )}
      </div>

      {/* Table card */}
      <div style={{ background: "var(--bg-secondary, #0e0e18)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))", borderRadius: "12px", overflow: "hidden" }}>
        {/* Column headers */}
        <div className="hidden lg:grid items-center f1-heading" style={{
          gridTemplateColumns: "36px 3px minmax(200px, 1fr) 150px 90px 100px 100px",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
          fontSize: "10px",
          color: "var(--text-dim, #888)",
          letterSpacing: "1.5px",
        }}>
          <span>#</span>
          <span></span>
          <span style={{ paddingLeft: "12px" }}>{activeTab === "constructors" ? t("championship") : "Driver"}</span>
          <span>{t("odds")}</span>
          <span>{t("h24")}</span>
          <span>{t("d7Trend")}</span>
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
            const change = entry.change24h ?? 0;
            const changePct = change * 100;
            const isUp = change > 0.0005;
            const isDown = change < -0.0005;
            const trend = trendPoints(entry);
            const trendUp = trend ? trend[trend.length - 1] >= trend[0] : false;

            return (
              <div
                key={entry.code + entry.name}
                className="lg:grid flex items-center"
                style={{
                  gridTemplateColumns: "36px 3px minmax(200px, 1fr) 150px 90px 100px 100px",
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover, #1c1c30)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-dim, #888)" }}>{i + 1}</span>
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: entry.color }} />

                <div className="flex items-center" style={{ gap: "10px", paddingLeft: "12px", flex: 1, minWidth: 0 }}>
                  <div className="f1-heading" style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "var(--bg-tertiary, #161625)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px",
                    color: "var(--text-secondary, #8b8b9e)",
                    letterSpacing: "0.5px", flexShrink: 0,
                  }}>
                    {entry.code}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>{entry.name}</div>
                    {DRIVER_TEAM[entry.code] && <div style={{ fontSize: "11px", color: "var(--text-dim, #888)", marginTop: "1px" }}>{DRIVER_TEAM[entry.code]}</div>}
                  </div>
                </div>

                {/* Probability */}
                <div className="hidden lg:flex items-center" style={{ gap: "10px" }}>
                  <span className="f1-data" style={{ fontSize: "14px", minWidth: "44px", color: "var(--text-primary, #eeeef0)" }}>
                    {pct.toFixed(pct < 10 ? 1 : 0)}%
                  </span>
                  <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--bg-primary, #07070c)", overflow: "hidden", maxWidth: "70px" }}>
                    <div style={{ height: "100%", borderRadius: "3px", width: `${pct}%`, background: entry.color, transition: "width 0.6s ease" }} />
                  </div>
                </div>

                {/* Mobile: percentage */}
                <div className="lg:hidden ml-auto mr-2">
                  <span className="f1-data" style={{ fontSize: "14px", color: "var(--text-primary, #eeeef0)" }}>{pct.toFixed(0)}%</span>
                </div>

                {/* 24H change */}
                <div className="hidden lg:block f1-data" style={{
                  fontSize: "13px",
                  color: isUp ? "var(--accent-green, #00d26a)" : isDown ? "var(--accent-red, #ff4757)" : "var(--text-subtle, #777)",
                }}>
                  {!isUp && !isDown ? "—" : `${isUp ? "▲" : "▼"} ${Math.abs(changePct).toFixed(1)}%`}
                </div>

                {/* 7D trend — real data */}
                <div className="hidden lg:flex items-center">
                  {trend ? (
                    <Sparkline data={trend} color={trendUp ? "var(--accent-green, #00d26a)" : "var(--accent-red, #ff4757)"} />
                  ) : (
                    <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-subtle, #777)" }}>—</span>
                  )}
                </div>

                {/* Trade */}
                <a
                  href={tradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:block f1-heading"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "1px",
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
                  {t("betOn")}
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
          color: "var(--text-dim, #888)",
          borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
        }}>
          {hasMore ? (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ color: "var(--text-secondary, #8b8b9e)", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "12px" }}
            >
              {expanded ? t("showLess") : `${t("viewAllOutcomes")} (${activeData.length}) →`}
            </button>
          ) : (
            <span>{t("lastUpdated")}: {isLoading ? t("refreshing") : t("justNow")}</span>
          )}
        </div>
      </div>
    </section>
  );
}
