"use client";

import { useTranslations } from "next-intl";
import { F1_STOCKS, CORRELATION_INSIGHTS, type F1Stock } from "@/lib/data/stocks";
import { StockSparkline, generateSparklineData } from "@/components/charts/stock-sparkline";

function changeColor(n: number): string {
  return n > 0 ? "text-[#22c55e]" : n < 0 ? "text-[#E10600]" : "text-[#555]";
}

function changeBg(n: number): string {
  return n > 0 ? "bg-[#22c55e]/10" : n < 0 ? "bg-[#E10600]/10" : "bg-[#131313]";
}

function formatChange(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function pricePosition(stock: F1Stock): number {
  const range = stock.high52w - stock.low52w;
  if (range === 0) return 50;
  return ((stock.price - stock.low52w) / range) * 100;
}

export default function StocksPage() {
  return <StocksContent />;
}

function StocksContent() {
  const t = useTranslations("stocks");
  const tCommon = useTranslations("common");

  // Sort by market cap proxy (price * implied scale) — just show in order
  const avgChange1d = F1_STOCKS.reduce((s, st) => s + st.change1d, 0) / F1_STOCKS.length;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Financial Intelligence</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">
            {F1_STOCKS.length} tickers &middot; Auto, Luxury &amp; Media &middot; Daily close
          </p>
        </div>

        {/* Market overview bar */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-6">
          <div className="f1-surface p-4 text-center">
            <p className="f1-label-xs mb-2">{t("trackedStocks")}</p>
            <p className="f1-data-lg text-white">{F1_STOCKS.length}</p>
          </div>
          <div className="f1-surface p-4 text-center">
            <p className="f1-label-xs mb-2">{t("avgDailyChange")}</p>
            <p className={`f1-data-lg ${changeColor(avgChange1d)}`}>{formatChange(avgChange1d)}</p>
          </div>
          <div className="f1-surface p-4 text-center">
            <p className="f1-label-xs mb-2">{t("bestPerformer")}</p>
            <p className="f1-data-lg text-[#22c55e]">GM</p>
            <p className="f1-label-xs mt-1" style={{ color: "#444" }}>+12.3% YTD</p>
          </div>
          <div className="f1-surface p-4 text-center">
            <p className="f1-label-xs mb-2">{t("worstPerformer")}</p>
            <p className="f1-data-lg text-[#E10600]">AML</p>
            <p className="f1-label-xs mt-1" style={{ color: "#444" }}>-22.4% YTD</p>
          </div>
        </div>

        {/* Stock cards grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          {F1_STOCKS.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>

        {/* Correlation Insights */}
        <div className="f1-surface p-5 mb-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("correlation")}</span>
          </div>
          <p className="f1-label mb-4">How F1 performance connects to stock price movements</p>

          <div className="space-y-2">
            {CORRELATION_INSIGHTS.map((c) => {
              const stock = F1_STOCKS.find((s) => s.ticker === c.ticker);
              return (
                <div key={c.ticker} className="f1-surface-inner p-4 rounded flex gap-4 items-start">
                  <div className="shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="f1-team-bar h-5" style={{ backgroundColor: stock?.teamColor ?? "#666" }} />
                      <span className="f1-data text-sm font-bold text-white">{c.ticker}</span>
                    </div>
                    <span className="f1-label-xs" style={{ color: "#444" }}>{stock?.team}</span>
                  </div>
                  <p className="f1-body-sm text-[#888] flex-1">{c.insight}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full data table */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("detailedView")}</span>
          </div>

          {/* Table header */}
          <div className="hidden lg:grid lg:grid-cols-[5rem_1fr_5rem_5rem_5rem_5rem_10rem] items-center gap-3 mb-2 px-3">
            {["TICKER", "COMPANY", t("price"), "1D", "1W", "YTD", "52W RANGE"].map((h) => (
              <span key={h} className="f1-label-xs">{h}</span>
            ))}
          </div>

          <div className="space-y-1">
            {F1_STOCKS.map((stock) => (
              <div key={stock.ticker} className="f1-surface-inner rounded px-3 py-3 f1-transition hover:bg-[#0d0d0d]">
                {/* Mobile layout */}
                <div className="lg:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="f1-team-bar h-4" style={{ backgroundColor: stock.teamColor }} />
                      <span className="f1-data text-sm font-bold text-white">{stock.ticker}</span>
                      <span className="f1-label-xs" style={{ color: "#444" }}>{stock.team}</span>
                    </div>
                    <span className="f1-data text-sm text-white">
                      {stock.currency === "USD" ? "$" : stock.currency === "EUR" ? "€" : ""}{stock.price.toFixed(2)}
                      {stock.currency === "GBp" && <span className="f1-label-xs ml-0.5">p</span>}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: "1D", val: stock.change1d },
                      { label: "1W", val: stock.change1w },
                      { label: "YTD", val: stock.changeYtd },
                    ].map((c) => (
                      <span key={c.label} className={`f1-data text-xs px-1.5 py-0.5 rounded ${changeBg(c.val)} ${changeColor(c.val)}`}>
                        {formatChange(c.val)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-[5rem_1fr_5rem_5rem_5rem_5rem_10rem] items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="f1-team-bar h-4" style={{ backgroundColor: stock.teamColor }} />
                    <span className="f1-data text-sm font-bold text-white">{stock.ticker}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="f1-body-sm text-white truncate block">{stock.company}</span>
                    <span className="f1-label-xs" style={{ color: "#333" }}>{stock.team} &middot; {stock.exchange}</span>
                  </div>
                  <span className="f1-data text-sm text-white">
                    {stock.currency === "USD" ? "$" : stock.currency === "EUR" ? "€" : ""}{stock.price.toFixed(2)}
                    {stock.currency === "GBp" && <span className="f1-label-xs ml-0.5">p</span>}
                  </span>
                  <span className={`f1-data text-xs ${changeColor(stock.change1d)}`}>{formatChange(stock.change1d)}</span>
                  <span className={`f1-data text-xs ${changeColor(stock.change1w)}`}>{formatChange(stock.change1w)}</span>
                  <span className={`f1-data text-xs ${changeColor(stock.changeYtd)}`}>{formatChange(stock.changeYtd)}</span>
                  <div>
                    <div className="h-[3px] w-full rounded-full bg-[#161616] relative">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border border-[#0a0a0a]"
                        style={{ left: `${pricePosition(stock)}%`, backgroundColor: stock.teamColor }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="f1-label-xs" style={{ color: "#333" }}>{stock.low52w}</span>
                      <span className="f1-label-xs" style={{ color: "#333" }}>{stock.high52w}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 border-t border-[#131313] pt-5">
          <p className="f1-label-xs" style={{ color: "#222" }}>
            F1 Pulse &middot; Stock data is delayed and for informational purposes only &middot; Not financial advice &middot; Prices from public sources
          </p>
        </div>
      </div>
    </div>
  );
}

function StockCard({ stock }: { stock: F1Stock }) {
  const pos = pricePosition(stock);
  const currSymbol = stock.currency === "USD" ? "$" : stock.currency === "EUR" ? "€" : "";
  const suffix = stock.currency === "GBp" ? "p" : "";

  return (
    <div className="f1-surface p-4 f1-hover-scale">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="f1-team-bar h-5" style={{ backgroundColor: stock.teamColor }} />
            <span className="f1-data text-lg font-bold text-white">{stock.ticker}</span>
          </div>
          <p className="f1-label-xs mt-0.5" style={{ color: "#444" }}>{stock.company}</p>
        </div>
        {stock.team && (
          <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5 shrink-0" style={{ color: stock.teamColor }}>
            {stock.team}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="f1-data-lg text-white">{currSymbol}{stock.price.toFixed(2)}{suffix}</span>
        <span className={`f1-data text-xs ${changeColor(stock.change1d)}`}>
          {formatChange(stock.change1d)} 1d
        </span>
      </div>

      {/* Change pills */}
      <div className="flex gap-1.5 mb-3">
        {[
          { label: "1W", val: stock.change1w },
          { label: "YTD", val: stock.changeYtd },
        ].map((c) => (
          <span key={c.label} className={`f1-data text-[0.625rem] px-1.5 py-0.5 rounded ${changeBg(c.val)} ${changeColor(c.val)}`}>
            {c.label} {formatChange(c.val)}
          </span>
        ))}
      </div>

      {/* Sparkline */}
      <div className="mb-3 flex items-center justify-between">
        <span className="f1-label-xs">30D Trend</span>
        <StockSparkline
          data={generateSparklineData(stock.price, stock.changeYtd)}
          color={stock.teamColor}
          isPositive={stock.changeYtd > 0}
        />
      </div>

      {/* 52-week range */}
      <div>
        <p className="f1-label-xs mb-1">52W Range</p>
        <div className="h-[3px] w-full rounded-full bg-[#161616] relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border border-[#0a0a0a]"
            style={{ left: `${pos}%`, backgroundColor: stock.teamColor }}
          />
        </div>
        <div className="mt-1 flex justify-between">
          <span className="f1-label-xs" style={{ color: "#333" }}>{currSymbol}{stock.low52w}{suffix}</span>
          <span className="f1-label-xs" style={{ color: "#333" }}>{currSymbol}{stock.high52w}{suffix}</span>
        </div>
      </div>

      {/* Note */}
      <p className="f1-label-xs mt-3" style={{ color: "#444", lineHeight: 1.4 }}>{stock.note}</p>
    </div>
  );
}
