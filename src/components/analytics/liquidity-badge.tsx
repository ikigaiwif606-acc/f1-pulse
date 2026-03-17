export function LiquidityBadge({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: { icon: "🟢", label: "High", color: "#22c55e" },
    medium: { icon: "🟡", label: "Medium", color: "#f59e0b" },
    low: { icon: "🔴", label: "Low", color: "#ef4444" },
  }[level];

  return (
    <span className="f1-label-xs inline-flex items-center gap-1" style={{ color: config.color }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
