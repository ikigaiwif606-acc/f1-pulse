"use client";

import { useTranslations } from "next-intl";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { MarketOutcomeItem } from "@/types";

interface Mover extends MarketOutcomeItem {
  market: string;
  url?: string;
}

export function MarketMovers() {
  const t = useTranslations("home");
  const { markets } = useMarkets();

  const movers: Mover[] = [...markets.championship, ...markets.raceWinner]
    .flatMap((m) =>
      m.outcomes.map((o) => ({
        ...o,
        market: m.question.replace(/\s*Grand Prix.*$/i, " GP").replace("F1 ", ""),
        url: m.url,
      }))
    )
    .filter((o) => o.change24h !== undefined && Math.abs(o.change24h!) >= 0.001)
    .sort((a, b) => Math.abs(b.change24h!) - Math.abs(a.change24h!))
    .slice(0, 5);

  if (movers.length === 0) return null;

  return (
    <div className="f1-surface" style={{ padding: "22px", height: "100%" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "18px" }}>
        <div className="flex items-center gap-2">
          <span className="f1-accent-bar" />
          <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("topMovers")}</span>
        </div>
        <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>24H</span>
      </div>

      {movers.map((m) => {
        const up = (m.change24h ?? 0) > 0;
        const color = up ? "var(--accent-green, #00d26a)" : "var(--accent-red, #ff4757)";
        return (
          <a
            key={m.market + m.name}
            href={m.url || "https://polymarket.com/sports/f1/props"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center f1-transition"
            style={{
              padding: "11px 4px",
              borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              textDecoration: "none",
              gap: "10px",
            }}
          >
            <div style={{ width: "3px", height: "26px", borderRadius: "1px", background: m.color }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary, #eeeef0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.name}
              </div>
              <div className="f1-label-xs" style={{ marginTop: "3px", color: "var(--text-dim, #888)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.market}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="f1-data" style={{ fontSize: "14px", color: "var(--text-primary, #eeeef0)" }}>
                {(m.price * 100).toFixed(m.price < 0.1 ? 1 : 0)}%
              </div>
              <div className="f1-data" style={{ fontSize: "11px", color, marginTop: "2px" }}>
                {up ? "▲" : "▼"} {Math.abs((m.change24h ?? 0) * 100).toFixed(1)}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
