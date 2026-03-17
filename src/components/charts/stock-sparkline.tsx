"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color: string;
  isPositive: boolean;
}

export function StockSparkline({ data, color, isPositive }: SparklineProps) {
  const chartData = data.map((v, i) => ({ v, i }));

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={isPositive ? "#22c55e" : "#E10600"}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Generate fake 30-day sparkline data based on current price and YTD change
export function generateSparklineData(price: number, changeYtd: number): number[] {
  const points = 20;
  const startPrice = price / (1 + changeYtd / 100);
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const noise = (Math.sin(i * 1.5) * 0.02 + Math.cos(i * 0.8) * 0.015) * price;
    data.push(startPrice + (price - startPrice) * progress + noise);
  }
  return data;
}
