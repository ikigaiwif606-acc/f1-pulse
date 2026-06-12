"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { HomepageData } from "@/types";

interface SeasonSnapshotProps {
  standings: HomepageData["standings"];
  recent: HomepageData["recent"];
  maxPts: number;
  seasonProgress: HomepageData["seasonProgress"];
}

export function SeasonSnapshot({ standings, recent, maxPts, seasonProgress }: SeasonSnapshotProps) {
  const t = useTranslations("home");
  const tStandings = useTranslations("standings");

  return (
    <section className="section-animate grid gap-5 md:grid-cols-2">
      {/* ── Championship standings ── */}
      <div className="f1-surface" style={{ padding: "22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
        <div className="flex items-center justify-between" style={{ marginBottom: "18px" }}>
          <div className="flex items-center gap-2">
            <span className="f1-accent-bar" />
            <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("championshipStandings")}</span>
          </div>
          <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>
            {seasonProgress.completed}/{seasonProgress.total} GP
          </span>
        </div>

        {standings.map((d) => (
          <Link
            key={d.pos}
            href={`/drivers/${d.id}` as "/"}
            className="block f1-transition"
            style={{
              padding: "9px 4px",
              borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
              textDecoration: "none",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "5px" }}>
              <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-dim, #888)", width: "26px" }}>{d.pos}</span>
              <div style={{ width: "3px", height: "18px", borderRadius: "1px", marginRight: "12px", background: d.color }} />
              <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-primary, #eeeef0)" }}>{d.name}</span>
              <span className="f1-data" style={{ fontSize: "14px", color: "var(--text-secondary, #8b8b9e)" }}>
                {d.pts} <span style={{ fontSize: "10px", color: "var(--text-dim, #888)" }}>PTS</span>
              </span>
            </div>
            {/* Gap-to-leader bar */}
            <div style={{ marginLeft: "41px" }}>
              <div
                className="gap-bar"
                style={{
                  width: `${Math.max((d.pts / (maxPts || 1)) * 100, 2)}%`,
                  background: `linear-gradient(90deg, ${d.color}55, ${d.color})`,
                }}
              />
            </div>
          </Link>
        ))}

        <div style={{ marginTop: "14px", textAlign: "right" }}>
          <Link href="/standings" className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: "#E10600", textDecoration: "none" }}>
            {t("fullStandings")} →
          </Link>
        </div>
      </div>

      {/* ── Recent results ── */}
      <div className="f1-surface" style={{ padding: "22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(225,6,0,0.2), transparent)" }} />
        <div className="flex items-center gap-2" style={{ marginBottom: "18px" }}>
          <span className="f1-accent-bar" />
          <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("recentResults")}</span>
        </div>

        {recent.length === 0 ? (
          <p className="f1-body" style={{ color: "var(--text-dim, #888)" }}>—</p>
        ) : (
          recent.map((r, i) => (
            <Link
              key={r.slug}
              href={`/races/${r.slug}` as "/"}
              className="flex items-center f1-transition"
              style={{
                padding: "12px 4px",
                borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                textDecoration: "none",
                opacity: 1 - i * 0.15,
              }}
            >
              <span className="f1-data" style={{ fontSize: "11px", color: "var(--text-dim, #888)", width: "34px" }}>R{r.round}</span>
              <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-primary, #eeeef0)" }}>{r.name}</span>
              <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)", marginRight: "10px" }}>🏆</span>
              <div style={{ width: "3px", height: "18px", borderRadius: "1px", marginRight: "8px", background: r.color }} />
              <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)" }}>{r.winner || r.code}</span>
            </Link>
          ))
        )}

        <div style={{ marginTop: "14px", textAlign: "right" }}>
          <Link href="/races" className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: "#E10600", textDecoration: "none" }}>
            {tStandings("fullCalendar")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
