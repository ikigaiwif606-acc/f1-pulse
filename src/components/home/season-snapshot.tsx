"use client";

import { useTranslations } from "next-intl";
import { useChampionshipOdds } from "@/lib/hooks/use-markets";
import { Link } from "@/lib/i18n/navigation";

interface SeasonSnapshotProps {
  standings: { pos: number; id: string; name: string; code: string; pts: number; color: string }[];
  recent: { round: number; slug: string; name: string; code: string; color: string }[];
  maxPts: number;
}

export function SeasonSnapshot({ standings, recent }: SeasonSnapshotProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const { odds } = useChampionshipOdds();

  // Find ranking mismatches
  const standingsCodes = standings.map((s) => s.code);
  const marketCodes = odds.slice(0, 5).map((o) => o.code);
  const standingsMismatches = standings.filter((s) => !marketCodes.includes(s.code)).map((s) => s.code);
  const marketMismatches = odds.slice(0, 5).filter((o) => !standingsCodes.includes(o.code)).map((o) => o.code);

  const latest = recent[0];

  return (
    <section className="section-animate">
      <div className="flex items-baseline justify-between" style={{ marginBottom: "20px" }}>
        <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-primary, #eeeef0)" }}>
          Season Snapshot
        </div>
        <Link href="/drivers" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)", textDecoration: "none", fontWeight: 500 }}>
          Full Standings &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "20px" }}>
        {/* Standings card */}
        <div className="snapshot-card-standings" style={{
          background: "var(--bg-secondary, #0e0e18)",
          border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
          borderRadius: "12px",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* White gradient top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

          <div className="flex items-center" style={{
            gap: "8px",
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: "13px", fontWeight: 600,
            letterSpacing: "1.5px", textTransform: "uppercase" as const,
            color: "var(--text-muted, #4e4e62)",
            marginBottom: "20px",
          }}>
            <span style={{ fontSize: "14px" }}>{"\u{1F3C6}"}</span> {t("championshipStandings")}
          </div>

          {/* Latest result */}
          {latest && (
            <div style={{
              fontSize: "12px",
              color: "var(--text-muted, #4e4e62)",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "6px",
              marginBottom: "16px",
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "0.3px",
            }}>
              <strong style={{ color: "var(--text-secondary, #8b8b9e)" }}>R{latest.round} {latest.name}</strong>
              {" \u2014 "}
              {recent.slice(0, 3).map((r, i) => (
                <span key={r.code}>
                  {["\u{1F947}", "\u{1F948}", "\u{1F949}"][i]} {r.code}
                  {i < 2 ? " \u00A0" : ""}
                </span>
              ))}
            </div>
          )}

          {/* Standings rows */}
          {standings.map((d) => {
            const isMismatch = standingsMismatches.includes(d.code);
            return (
              <Link
                key={d.pos}
                href={`/drivers/${d.id}` as "/"}
                className="flex items-center"
                style={{
                  padding: isMismatch ? "10px 8px" : "10px 0",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  textDecoration: "none",
                  borderRadius: isMismatch ? "6px" : "0",
                  background: isMismatch ? "rgba(255,200,0,0.04)" : "transparent",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--text-muted, #4e4e62)", width: "28px", fontWeight: 600 }}>
                  {d.pos}
                </span>
                <div style={{ width: "3px", height: "20px", borderRadius: "1px", marginRight: "12px", background: d.color }} />
                <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-primary, #eeeef0)" }}>
                  {d.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary, #8b8b9e)" }}>
                  {d.pts} pts
                </span>
              </Link>
            );
          })}
        </div>

        {/* Market prediction card */}
        <div style={{
          background: "var(--bg-secondary, #0e0e18)",
          border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
          borderRadius: "12px",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Red gradient top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(225,6,0,0.2), transparent)" }} />

          <div className="flex items-center" style={{
            gap: "8px",
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: "13px", fontWeight: 600,
            letterSpacing: "1.5px", textTransform: "uppercase" as const,
            color: "#E10600",
            marginBottom: "20px",
          }}>
            <span style={{ fontSize: "14px" }}>{"\u{1F4CA}"}</span> Market Says...
          </div>

          {/* Market subtitle */}
          <div style={{
            fontSize: "12px",
            color: "var(--text-muted, #4e4e62)",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "6px",
            marginBottom: "16px",
            fontFamily: "var(--font-mono), monospace",
            letterSpacing: "0.3px",
          }}>
            Polymarket WDC odds &middot; Vol <strong style={{ color: "var(--text-secondary, #8b8b9e)" }}>$63.8M</strong>
          </div>

          {/* Market rows */}
          {odds.slice(0, 5).map((o, i) => {
            const pct = Math.round(o.odds * 100);
            const isMismatch = marketMismatches.includes(o.code);
            return (
              <div
                key={o.code}
                className="flex items-center"
                style={{
                  padding: isMismatch ? "10px 8px" : "10px 0",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  borderRadius: isMismatch ? "6px" : "0",
                  background: isMismatch ? "rgba(255,200,0,0.04)" : "transparent",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--text-muted, #4e4e62)", width: "28px", fontWeight: 600 }}>
                  {i + 1}
                </span>
                <div style={{ width: "3px", height: "20px", borderRadius: "1px", marginRight: "12px", background: o.color }} />
                <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-primary, #eeeef0)" }}>
                  {o.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", fontWeight: 600, color: "var(--accent-green, #00d26a)" }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
