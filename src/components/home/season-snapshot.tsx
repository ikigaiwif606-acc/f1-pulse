"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { MarketsMeta } from "@/lib/data/markets";
import type { HomepageData } from "@/types";

interface SeasonSnapshotProps {
  standings: HomepageData["standings"];
  recent: HomepageData["recent"];
  maxPts: number;
  seasonProgress: HomepageData["seasonProgress"];
  marketsInitial?: MarketsMeta;
}

// Bilingual signage — fixed EN/中文 pair, like FIA event boards
const SIGNAGE = {
  timingTower: { en: "TIMING TOWER", zh: "计时塔" },
};

export function SeasonSnapshot({ standings, recent, seasonProgress, marketsInitial }: SeasonSnapshotProps) {
  const t = useTranslations("home");
  const tStandings = useTranslations("standings");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { markets, stale } = useMarkets(marketsInitial);

  const echo = locale === "zh" ? SIGNAGE.timingTower.en : SIGNAGE.timingTower.zh;

  // Market price per driver code, from the WDC market
  const wdcMarket = markets.championship?.find((m) => m.question.toLowerCase().includes("driver"));
  const priceByCode = new Map<string, number>(
    (wdcMarket?.outcomes || []).map((o) => [o.code, o.price])
  );

  // EDGE = points rank vs market rank, computed within the displayed field.
  // Positive → the money rates the driver higher than the table does.
  const withPrices = standings.filter((d) => priceByCode.has(d.code));
  const marketOrder = [...withPrices].sort(
    (a, b) => (priceByCode.get(b.code) ?? 0) - (priceByCode.get(a.code) ?? 0)
  );
  const marketRank = new Map<string, number>(marketOrder.map((d, i) => [d.code, i + 1]));
  const pointsRank = new Map<string, number>(
    withPrices.map((d, i) => [d.code, i + 1])
  );

  const leaderPts = standings[0]?.pts ?? 0;

  return (
    <section className="section-animate flex flex-col" style={{ gap: "40px" }}>
      {/* ── Timing tower ── */}
      <div>
        <div className="flex flex-wrap items-end justify-between" style={{ gap: "12px", marginBottom: "16px" }}>
          <div>
            <span className="pw-eyebrow">
              <b>{t("timingTower")}</b>
              <span className="pw-echo">{echo}</span>
            </span>
            <h2 className="f1-display-lg pw-skew" style={{ fontSize: "clamp(22px, 3vw, 30px)", color: "var(--text-primary, #eeeef0)", marginTop: "8px" }}>
              {t("championshipStandings")}
            </h2>
          </div>
          <div className="flex items-center" style={{ gap: "10px" }}>
            <span className={`pw-asof${stale ? " stale" : ""}`}>
              <span className="dot" />
              {stale ? tc("dataStale") : tc("dataLive")} · {seasonProgress.completed}/{seasonProgress.total} GP
            </span>
            <Link href="/standings" className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--timing-purple, #B78CFF)", textDecoration: "none" }}>
              {t("fullStandings")} →
            </Link>
          </div>
        </div>

        <div className="pw-tower-wrap">
          <table className="pw-tower">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{tStandings("driver")}</th>
                <th scope="col">{tStandings("points")}</th>
                <th scope="col">{tStandings("gap")}</th>
                <th scope="col">{tStandings("wins")}</th>
                <th scope="col">{tStandings("market")}</th>
                <th scope="col">{tStandings("edge")}</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((d) => {
                const price = priceByCode.get(d.code);
                const pRank = pointsRank.get(d.code);
                const mRank = marketRank.get(d.code);
                const edge = pRank != null && mRank != null ? pRank - mRank : null;
                return (
                  <tr key={d.pos} className={d.pos === 1 ? "pw-p1" : undefined}>
                    <td><span className="pw-pos">{d.pos}</span></td>
                    <td>
                      <Link href={`/drivers/${d.id}` as "/"} className="flex items-center" style={{ gap: "12px", textDecoration: "none" }}>
                        <span className="f1-team-bar-wide" style={{ height: "26px", background: d.color }} />
                        <span className="f1-display-md" style={{ fontSize: "16px", color: "var(--text-primary, #eeeef0)", width: "48px" }}>{d.code}</span>
                        <span className="f1-body-sm" style={{ color: "var(--text-secondary, #8b8b9e)" }}>{d.name}</span>
                      </Link>
                    </td>
                    <td style={{ color: "var(--text-primary, #eeeef0)", fontWeight: 600 }}>{d.pts}</td>
                    <td style={{ color: "var(--text-dim, #888)" }}>{d.pos === 1 ? "—" : `−${leaderPts - d.pts}`}</td>
                    <td style={{ color: "var(--text-secondary, #8b8b9e)" }}>{d.wins}</td>
                    <td className="pw-mkt" style={{ fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>
                      {price != null ? <>{(price * 100).toFixed(1)}<span style={{ fontSize: "11px", color: "var(--text-subtle, #777)" }}>¢</span></> : "—"}
                    </td>
                    <td>
                      {edge != null && edge !== 0 ? (
                        <span className={`pw-edge ${edge > 0 ? "up" : "dn"}`}>
                          MKT {edge > 0 ? `+${edge}` : edge}
                        </span>
                      ) : (
                        <span className="pw-edge flat">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <span className="pw-tower-note">
            {t("edgeNote")} · <em>MKT + {t("edgeUp")}</em> · <i>MKT − {t("edgeDown")}</i>
          </span>
        </div>
      </div>

      {/* ── Recent results strip ── */}
      <div>
        <div className="flex items-end justify-between" style={{ marginBottom: "14px" }}>
          <span className="pw-eyebrow"><b>{t("recentResults")}</b></span>
          <Link href="/races" className="f1-heading" style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--timing-purple, #B78CFF)", textDecoration: "none" }}>
            {tStandings("fullCalendar")} →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="f1-body" style={{ color: "var(--text-dim, #888)" }}>—</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {recent.map((r) => (
              <Link
                key={r.slug}
                href={`/races/${r.slug}` as "/"}
                className="f1-surface-tertiary flex items-center f1-transition"
                style={{ gap: "12px", padding: "14px 16px", textDecoration: "none", border: "1px solid var(--border-subtle, rgba(255,255,255,0.05))" }}
              >
                <span className="f1-data" style={{ fontSize: "11px", color: "var(--text-subtle, #777)", width: "28px" }}>R{r.round}</span>
                <span className="f1-body-sm" style={{ flex: 1, color: "var(--text-primary, #eeeef0)", fontWeight: 600 }}>{r.name}</span>
                <span className="f1-team-bar-wide" style={{ height: "18px", background: r.color }} />
                <span className="f1-data" style={{ fontSize: "12px", color: "var(--text-secondary, #8b8b9e)" }}>🏆 {r.code || r.winner}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
