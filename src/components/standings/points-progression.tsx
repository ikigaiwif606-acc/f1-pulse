"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PointsProgression } from "@/lib/data/standings";

export function PointsProgressionChart({ data }: { data: PointsProgression }) {
  if (!data || data.points.length === 0) return null;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.points} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="round"
            tickFormatter={(r) => `R${r}`}
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: "#888", fontSize: 11, fontFamily: "var(--font-mono), monospace" }}
            tickLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.15)"
            tick={{ fill: "#888", fontSize: 11, fontFamily: "var(--font-mono), monospace" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#0e0e18",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "var(--font-mono), monospace",
            }}
            labelStyle={{ color: "#eeeef0", fontWeight: 700 }}
            labelFormatter={(round, payload) => {
              const race = payload?.[0]?.payload?.race;
              return race ? `R${round} · ${race}` : `R${round}`;
            }}
            itemSorter={(item) => -(item.value as number)}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.5px" }}
            iconType="plainline"
          />
          {data.series.map((s) => (
            <Line
              key={s.code}
              type="monotone"
              dataKey={s.code}
              name={s.code}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 2.5, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              animationDuration={800}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
