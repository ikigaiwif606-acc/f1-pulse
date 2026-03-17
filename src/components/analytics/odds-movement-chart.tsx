"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OddsDriver {
  name: string;
  code: string;
  color: string;
  tokenId: string;
}

interface OddsMovementChartProps {
  drivers: OddsDriver[];
  title: string;
  subtitle?: string;
}

type Interval = "1d" | "1w" | "1m" | "all";

interface ChartPoint {
  time: string;
  timestamp: number;
  [driverCode: string]: string | number;
}

export function OddsMovementChart({ drivers, title, subtitle }: OddsMovementChartProps) {
  const [interval, setInterval] = useState<Interval>("1w");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const fidelity = interval === "1d" ? 15 : interval === "1w" ? 60 : interval === "1m" ? 360 : 1440;

        const histories = await Promise.allSettled(
          drivers.map(async (d) => {
            const res = await fetch(
              `https://clob.polymarket.com/prices-history?market=${d.tokenId}&interval=${interval}&fidelity=${fidelity}`,
              { signal: AbortSignal.timeout(8000) }
            );
            if (!res.ok) return { code: d.code, history: [] };
            const json = await res.json();
            return { code: d.code, history: json.history || [] };
          })
        );

        if (cancelled) return;

        // Build unified timeline
        const allTimestamps = new Set<number>();
        const driverData: Record<string, Map<number, number>> = {};

        for (const result of histories) {
          if (result.status !== "fulfilled") continue;
          const { code, history } = result.value;
          driverData[code] = new Map();
          for (const point of history) {
            allTimestamps.add(point.t);
            driverData[code].set(point.t, point.p);
          }
        }

        const sortedTimestamps = [...allTimestamps].sort((a, b) => a - b);

        const chartData: ChartPoint[] = sortedTimestamps.map((ts) => {
          const date = new Date(ts * 1000);
          const point: ChartPoint = {
            time: date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
            timestamp: ts,
          };
          for (const d of drivers) {
            const price = driverData[d.code]?.get(ts);
            if (price !== undefined) {
              point[d.code] = Math.round(price * 1000) / 10; // convert to %
            }
          }
          return point;
        });

        setData(chartData);
      } catch {
        // Keep existing data on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (drivers.some(d => d.tokenId)) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [drivers, interval]);

  const intervals: { key: Interval; label: string }[] = [
    { key: "1d", label: "1D" },
    { key: "1w", label: "1W" },
    { key: "1m", label: "1M" },
    { key: "all", label: "ALL" },
  ];

  const hasData = data.length > 0 && !loading;
  const noTokens = drivers.every(d => !d.tokenId);

  return (
    <div className="f1-surface p-5">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="f1-accent-bar" />
          <span className="f1-heading text-white">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {intervals.map((i) => (
            <button
              key={i.key}
              onClick={() => setInterval(i.key)}
              className={`f1-label-xs rounded px-2 py-1 f1-transition ${
                interval === i.key
                  ? "bg-[#E10600] !text-white"
                  : "bg-[#0a0a0a] border border-[#1c1c1c] hover:border-[#333]"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      {subtitle && <p className="f1-label mb-4">{subtitle}</p>}

      <div className="h-64 sm:h-80">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="f1-label animate-pulse">Loading odds data...</span>
          </div>
        ) : noTokens ? (
          <div className="flex h-full items-center justify-center">
            <span className="f1-label" style={{ color: "var(--text-dim)" }}>
              Token IDs required for live odds chart
            </span>
          </div>
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center">
            <span className="f1-label" style={{ color: "var(--text-dim)" }}>
              No price history available for selected interval
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="time"
                stroke="#1c1c1c"
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#1c1c1c"
                tick={{ fill: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f0f0f",
                  border: "1px solid #1c1c1c",
                  borderRadius: "0.375rem",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                }}
                labelStyle={{ color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}
                formatter={(value, name) => {
                  const numValue = typeof value === "number" ? value : Number(value);
                  return [`${numValue.toFixed(1)}%`, String(name)];
                }}
              />
              {drivers.map((d) => (
                <Line
                  key={d.code}
                  type="monotone"
                  dataKey={d.code}
                  stroke={d.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {drivers.map((d) => (
          <div key={d.code} className="flex items-center gap-1.5">
            <div className="h-[2px] w-4" style={{ backgroundColor: d.color }} />
            <span className="f1-label-xs" style={{ color: d.color }}>{d.code}</span>
            <span className="f1-label-xs">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
