"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PointsData {
  round: string;
  [driver: string]: number | string;
}

const SEASON_DATA: PointsData[] = [
  { round: "R1", RUS: 25, ANT: 18, LEC: 15, HAM: 12, BEA: 10, NOR: 8 },
  { round: "R2", RUS: 51, ANT: 47, LEC: 34, HAM: 33, BEA: 17, NOR: 15 },
];

const DRIVERS = [
  { key: "RUS", name: "Russell", color: "#27F4D2" },
  { key: "ANT", name: "Antonelli", color: "#27F4D2" },
  { key: "LEC", name: "Leclerc", color: "#E80020" },
  { key: "HAM", name: "Hamilton", color: "#E80020" },
  { key: "BEA", name: "Bearman", color: "#B6BABD" },
  { key: "NOR", name: "Norris", color: "#FF8000" },
];

export function PointsProgressionChart() {
  return (
    <div className="f1-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="f1-accent-bar" />
        <span className="f1-heading text-white">Season Points Progression</span>
      </div>
      <p className="f1-label mb-4">Cumulative points — top 6 drivers</p>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {DRIVERS.map((d) => (
          <div key={d.key} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="f1-label-xs !text-[#888]">{d.key}</span>
          </div>
        ))}
      </div>

      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SEASON_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="round"
              stroke="#333"
              tick={{ fill: "#666", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#1c1c1c" }}
              tickLine={false}
            />
            <YAxis
              stroke="#333"
              tick={{ fill: "#666", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "#1c1c1c" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f0f0f",
                border: "1px solid #1c1c1c",
                borderRadius: "0.375rem",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
              itemStyle={{ color: "#ededed", padding: "1px 0" }}
              labelStyle={{ color: "#666", fontWeight: 700, marginBottom: 4 }}
            />
            {DRIVERS.map((d, i) => (
              <Line
                key={d.key}
                type="monotone"
                dataKey={d.key}
                stroke={d.color}
                strokeWidth={2}
                dot={{ r: 3, fill: d.color, stroke: "#080808", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: d.color, stroke: "#080808", strokeWidth: 2 }}
                strokeOpacity={i < 2 ? 1 : 0.6}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
