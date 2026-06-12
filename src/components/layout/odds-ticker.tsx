"use client";

import { useChampionshipOdds } from "@/lib/hooks/use-markets";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

function TickerEntry({ code, odds, change, color }: { code: string; odds: number; change: number; color: string }) {
  const up = change > 0.0005;
  const down = change < -0.0005;
  const changeColor = up ? "var(--accent-green, #00d26a)" : down ? "var(--accent-red, #ff4757)" : "var(--text-subtle, #777)";
  return (
    <span className="inline-flex items-center gap-1.5 f1-data" style={{ fontSize: "11px" }}>
      <span style={{ width: "3px", height: "12px", borderRadius: "1px", background: color, display: "inline-block" }} />
      <span style={{ color: "var(--text-primary, #eeeef0)", fontWeight: 700 }}>{code}</span>
      <span style={{ color: "var(--text-secondary, #8b8b9e)" }}>{Math.round(odds * 100)}%</span>
      <span style={{ color: changeColor }}>
        {up ? "▲" : down ? "▼" : "·"}
        {Math.abs(change * 100).toFixed(1)}
      </span>
    </span>
  );
}

export function OddsTicker() {
  const t = useTranslations("home");
  const { odds } = useChampionshipOdds();
  const entries = odds.filter((o) => o.odds >= 0.005).slice(0, 12);
  if (entries.length === 0) return null;

  // Track is duplicated so the -50% translate loops seamlessly
  const lap = (
    <>
      <span className="f1-label-xs inline-flex items-center gap-1.5" style={{ color: "#E10600", letterSpacing: "0.2em" }}>
        <span className="h-1 w-1 rounded-full animate-live" style={{ background: "#E10600" }} />
        {t("wdcTicker")}
      </span>
      {entries.map((o) => (
        <TickerEntry key={o.code} code={o.code} odds={o.odds} change={o.change} color={o.color} />
      ))}
    </>
  );

  return (
    <Link href="/markets" aria-label={t("wdcTicker")} style={{ textDecoration: "none" }}>
      <div className="ticker-strip" role="marquee">
        <div className="ticker-track">
          <div className="inline-flex items-center" style={{ gap: "2.5rem", paddingRight: "2.5rem" }}>{lap}</div>
          <div className="inline-flex items-center" style={{ gap: "2.5rem", paddingRight: "2.5rem" }} aria-hidden="true">{lap}</div>
        </div>
      </div>
    </Link>
  );
}
