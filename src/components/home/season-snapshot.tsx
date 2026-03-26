"use client";

import { useTranslations } from "next-intl";
import { useChampionshipOdds } from "@/lib/hooks/use-markets";
import { Link } from "@/lib/i18n/navigation";

interface SeasonSnapshotProps {
  standings: { pos: number; id: string; name: string; code: string; pts: number; color: string }[];
  recent: { round: number; slug: string; name: string; code: string; color: string }[];
  maxPts: number;
}

const MEDAL = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export function SeasonSnapshot({ standings, recent, maxPts }: SeasonSnapshotProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const { odds } = useChampionshipOdds();

  // Find ranking mismatches between standings and market
  const standingsNames = new Set(standings.map((s) => s.code));
  const marketCodes = new Set(odds.map((o) => o.code));
  const onlyInStandings = standings.filter((s) => !marketCodes.has(s.code)).map((s) => s.code);
  const onlyInMarket = odds.filter((o) => !standingsNames.has(o.code)).map((o) => o.code);

  // Latest race result one-liner
  const latest = recent[0];

  return (
    <section className="animate-fade-up stagger-2">
      {/* Latest result one-liner */}
      {latest && (
        <div className="mb-4 flex items-center gap-2 px-1">
          <span className="f1-label-xs !text-[var(--text-ghost)]">Latest:</span>
          <Link
            href={`/races/${latest.slug}` as "/"}
            className="f1-label-xs !text-[var(--text-dim)] hover:!text-white f1-transition"
          >
            R{latest.round} {latest.name}
            {recent.slice(0, 3).map((r, i) => (
              <span key={r.code} className="ml-2">
                {MEDAL[i] || ""} <span className="font-mono" style={{ color: r.color }}>{r.code}</span>
              </span>
            ))}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Championship Standings */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("championshipStandings")}</span>
            </div>
            <Link href="/drivers" className="f1-transition f1-label hover:!text-white">
              {tCommon("viewAll")} &rarr;
            </Link>
          </div>

          <div className="space-y-1.5">
            {standings.map((d) => {
              const isMarketMismatch = onlyInStandings.includes(d.code);
              return (
                <Link
                  key={d.pos}
                  href={`/drivers/${d.id}` as "/"}
                  className={`f1-transition flex items-center gap-2.5 f1-surface-inner p-2.5 hover:bg-[rgba(15,15,15,0.8)] ${
                    isMarketMismatch ? "ring-1 ring-[#f59e0b]/20" : ""
                  }`}
                  style={{ borderLeft: `2px solid ${d.color}` }}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[0.625rem] tabular-nums font-bold ${
                      d.pos === 1 ? "bg-[#E10600] text-white" : "text-[var(--text-ghost)]"
                    }`}
                  >
                    {d.pos}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="f1-body-sm font-semibold text-white truncate">{d.name}</span>
                      <span className="font-mono text-xs tabular-nums text-white ml-2 font-bold">
                        {d.pts}<span className="f1-label-xs ml-0.5 !text-[var(--text-ghost)]">pts</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-[#161616] overflow-hidden">
                      <div
                        className="h-full rounded-full f1-transition"
                        style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Market Prediction */}
        <div className="f1-surface p-5" style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" style={{ opacity: 0.5 }} />
              <span className="f1-heading text-white" style={{ opacity: 0.9 }}>
                Market Says...
              </span>
            </div>
            <Link href="/markets" className="f1-transition f1-label hover:!text-white">
              {tCommon("viewAll")} &rarr;
            </Link>
          </div>

          <div className="space-y-1.5">
            {odds.slice(0, 5).map((o, i) => {
              const pct = Math.round(o.odds * 100);
              const isStandingsMismatch = onlyInMarket.includes(o.code);
              return (
                <div
                  key={o.code}
                  className={`f1-transition flex items-center gap-2.5 f1-surface-inner p-2.5 hover:bg-[rgba(15,15,15,0.8)] ${
                    isStandingsMismatch ? "ring-1 ring-[#3b82f6]/20" : ""
                  }`}
                  style={{ borderLeft: `2px solid ${o.color}`, borderLeftStyle: "dashed" }}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[0.625rem] tabular-nums font-bold text-[var(--text-ghost)]">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="f1-body-sm font-semibold text-white truncate">{o.name}</span>
                      <span className="font-mono text-xs tabular-nums font-bold" style={{ color: o.color }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-[#161616] overflow-hidden">
                      <div
                        className="h-full rounded-full f1-transition"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: o.color,
                          opacity: 0.6,
                          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
