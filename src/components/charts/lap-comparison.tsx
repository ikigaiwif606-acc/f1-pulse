"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Static lap time data (China GP R2, 20 representative laps) ──────────────
interface DriverLapData {
  code: string;
  name: string;
  color: string;
  laps: number[];
}

const LAP_DRIVERS: DriverLapData[] = [
  {
    code: "RUS",
    name: "Russell",
    color: "#27F4D2",
    laps: [95.2, 94.8, 94.5, 94.3, 94.1, 94.0, 93.9, 94.0, 94.2, 94.5,
           98.5, 94.0, 93.8, 93.7, 93.6, 93.5, 93.8, 94.0, 94.2, 94.5],
  },
  {
    code: "ANT",
    name: "Antonelli",
    color: "#27F4D2",
    laps: [95.5, 95.0, 94.6, 94.2, 94.0, 93.9, 93.8, 93.9, 94.0, 94.3,
           99.0, 93.9, 93.7, 93.6, 93.5, 93.4, 93.7, 93.9, 94.1, 94.3],
  },
  {
    code: "LEC",
    name: "Leclerc",
    color: "#E80020",
    laps: [95.8, 95.2, 94.8, 94.5, 94.3, 94.2, 94.1, 94.2, 94.4, 94.6,
           98.8, 94.3, 94.1, 94.0, 93.9, 93.8, 94.0, 94.2, 94.4, 94.7],
  },
  {
    code: "HAM",
    name: "Hamilton",
    color: "#E80020",
    laps: [96.0, 95.3, 94.9, 94.6, 94.4, 94.3, 94.2, 94.3, 94.5, 94.7,
           99.2, 94.2, 94.0, 93.9, 93.8, 93.7, 94.0, 94.3, 94.5, 94.8],
  },
  {
    code: "VER",
    name: "Verstappen",
    color: "#3671C6",
    laps: [96.2, 95.5, 95.0, 94.7, 94.5, 94.4, 94.3, 94.5, 94.7, 95.0,
           99.5, 94.5, 94.2, 94.0, 93.9, 93.8, 94.1, 94.4, 94.6, 95.0],
  },
  {
    code: "NOR",
    name: "Norris",
    color: "#FF8000",
    laps: [95.6, 95.1, 94.7, 94.4, 94.2, 94.1, 94.0, 94.1, 94.3, 94.6,
           99.0, 94.1, 93.9, 93.8, 93.7, 93.6, 93.9, 94.1, 94.3, 94.6],
  },
];

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
  }
  return `${secs.toFixed(3)}s`;
}

export function LapComparisonChart() {
  const [driverACode, setDriverACode] = useState("RUS");
  const [driverBCode, setDriverBCode] = useState("ANT");

  const driverA = LAP_DRIVERS.find((d) => d.code === driverACode)!;
  const driverB = LAP_DRIVERS.find((d) => d.code === driverBCode)!;

  // Build chart data
  const chartData = useMemo(() => {
    return driverA.laps.map((_, i) => ({
      lap: i + 1,
      [driverA.code]: driverA.laps[i],
      [driverB.code]: driverB.laps[i],
    }));
  }, [driverA, driverB]);

  // Compute stats (excluding pit stop laps — those with time > 97s)
  const stats = useMemo(() => {
    const cleanA = driverA.laps.filter((t) => t < 97);
    const cleanB = driverB.laps.filter((t) => t < 97);
    const avgA = cleanA.reduce((a, b) => a + b, 0) / cleanA.length;
    const avgB = cleanB.reduce((a, b) => a + b, 0) / cleanB.length;
    const fastA = Math.min(...cleanA);
    const fastB = Math.min(...cleanB);
    const gap = Math.abs(avgA - avgB);
    return { avgA, avgB, fastA, fastB, gap };
  }, [driverA, driverB]);

  // Determine if both drivers share the same color
  const sameColor = driverA.color === driverB.color;

  return (
    <div className="f1-surface p-5">
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <div className="f1-accent-bar" />
        <span className="f1-heading text-white">Lap Time Comparison</span>
      </div>
      <p className="f1-label mb-4">China GP — R2</p>

      {/* Driver selectors */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: driverA.color }}
          />
          <select
            value={driverACode}
            onChange={(e) => setDriverACode(e.target.value)}
            className="rounded border border-[#1c1c1c] bg-[#0a0a0a] px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-[#E10600]"
          >
            {LAP_DRIVERS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <span className="f1-label text-[0.5rem] text-[#333] hidden sm:block">vs</span>

        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: driverB.color }}
          />
          <select
            value={driverBCode}
            onChange={(e) => setDriverBCode(e.target.value)}
            className="rounded border border-[#1c1c1c] bg-[#0a0a0a] px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-[#E10600]"
          >
            {LAP_DRIVERS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <XAxis
              dataKey="lap"
              stroke="#333"
              tick={{ fill: "#666", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#1c1c1c" }}
              tickLine={false}
              label={{
                value: "Lap",
                position: "insideBottomRight",
                offset: -5,
                fill: "#444",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              reversed
              stroke="#333"
              tick={{ fill: "#666", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#1c1c1c" }}
              tickLine={false}
              tickFormatter={(v: number) => `${v.toFixed(1)}s`}
              label={{
                value: "Time (s)",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                fill: "#444",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f0f0f",
                border: "1px solid #1c1c1c",
                borderRadius: "0.375rem",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
              itemStyle={{ padding: "1px 0" }}
              labelStyle={{ color: "#666", fontWeight: 700, marginBottom: 4 }}
              labelFormatter={(label) => `Lap ${label}`}
              formatter={(value, name) => {
                const numValue = typeof value === "number" ? value : Number(value);
                const strName = String(name);
                const driver = LAP_DRIVERS.find((d) => d.code === strName);
                return [
                  formatLapTime(numValue),
                  driver ? `${driver.name} (${driver.code})` : strName,
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey={driverA.code}
              stroke={driverA.color}
              strokeWidth={2}
              dot={{ r: 2, fill: driverA.color, stroke: "#080808", strokeWidth: 1 }}
              activeDot={{ r: 4, fill: driverA.color, stroke: "#080808", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey={driverB.code}
              stroke={driverB.color}
              strokeWidth={2}
              strokeDasharray={sameColor ? "6 3" : undefined}
              dot={{ r: 2, fill: driverB.color, stroke: "#080808", strokeWidth: 1 }}
              activeDot={{ r: 4, fill: driverB.color, stroke: "#080808", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-[2px] w-4" style={{ backgroundColor: driverA.color }} />
          <span className="f1-label-xs !text-[#888]">{driverA.code}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-[2px] w-4"
            style={{
              backgroundColor: driverB.color,
              ...(sameColor
                ? {
                    backgroundImage: `repeating-linear-gradient(90deg, ${driverB.color} 0px, ${driverB.color} 4px, transparent 4px, transparent 7px)`,
                    backgroundColor: "transparent",
                  }
                : {}),
            }}
          />
          <span className="f1-label-xs !text-[#888]">{driverB.code}{sameColor ? " (dashed)" : ""}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Driver A avg */}
        <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-3">
          <p className="f1-label text-[0.5rem] mb-1">Avg Lap Time</p>
          <div className="flex items-center gap-1.5">
            <div className="f1-team-bar h-4" style={{ backgroundColor: driverA.color }} />
            <span className="f1-data text-sm text-white">{stats.avgA.toFixed(3)}s</span>
          </div>
          <p className="f1-label text-[0.5rem] mt-0.5" style={{ color: driverA.color }}>{driverA.code}</p>
        </div>

        {/* Driver B avg */}
        <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-3">
          <p className="f1-label text-[0.5rem] mb-1">Avg Lap Time</p>
          <div className="flex items-center gap-1.5">
            <div className="f1-team-bar h-4" style={{ backgroundColor: driverB.color }} />
            <span className="f1-data text-sm text-white">{stats.avgB.toFixed(3)}s</span>
          </div>
          <p className="f1-label text-[0.5rem] mt-0.5" style={{ color: driverB.color }}>{driverB.code}</p>
        </div>

        {/* Driver A fastest */}
        <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-3">
          <p className="f1-label text-[0.5rem] mb-1">Fastest Lap</p>
          <div className="flex items-center gap-1.5">
            <div className="f1-team-bar h-4" style={{ backgroundColor: driverA.color }} />
            <span className="f1-data text-sm text-white">{stats.fastA.toFixed(3)}s</span>
          </div>
          <p className="f1-label text-[0.5rem] mt-0.5" style={{ color: driverA.color }}>{driverA.code}</p>
        </div>

        {/* Driver B fastest */}
        <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-3">
          <p className="f1-label text-[0.5rem] mb-1">Fastest Lap</p>
          <div className="flex items-center gap-1.5">
            <div className="f1-team-bar h-4" style={{ backgroundColor: driverB.color }} />
            <span className="f1-data text-sm text-white">{stats.fastB.toFixed(3)}s</span>
          </div>
          <p className="f1-label text-[0.5rem] mt-0.5" style={{ color: driverB.color }}>{driverB.code}</p>
        </div>
      </div>

      {/* Gap */}
      <div className="mt-3 rounded border border-[#1c1c1c] bg-[#0c0c0c] p-3 text-center">
        <p className="f1-label text-[0.5rem] mb-1">Average Gap</p>
        <span className="f1-data text-lg text-white">{stats.gap.toFixed(3)}s</span>
        <p className="f1-label text-[0.5rem] mt-0.5" style={{ color: "#666" }}>
          {stats.avgA < stats.avgB ? driverA.code : driverB.code} faster on average
        </p>
      </div>
    </div>
  );
}
