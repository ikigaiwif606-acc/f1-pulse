import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { OnThisDay } from "@/components/shared/on-this-day";
import { Link } from "@/lib/i18n/navigation";
import { getHomepageData } from "@/lib/data/home";
import type { HomepageData } from "@/types";

// ── Top Movers (static enrichment for homepage) ──────────────────────────────
const TOP_MOVERS = [
  { name: "George Russell", code: "RUS", market: "WDC", oldPct: 57, newPct: 60, color: "#27F4D2" },
  { name: "Kimi Antonelli", code: "ANT", market: "JPN Win", oldPct: 16, newPct: 21, color: "#27F4D2" },
  { name: "Safety Car", code: "SC", market: "JPN GP", oldPct: 55, newPct: 67, color: "#f59e0b" },
  { name: "Max Verstappen", code: "VER", market: "WDC", oldPct: 5, newPct: 3, color: "#3671C6" },
  { name: "Charles Leclerc", code: "LEC", market: "JPN Win", oldPct: 11, newPct: 8, color: "#E80020" },
];

// ── Latest Deals ─────────────────────────────────────────────────────────────
const LATEST_DEALS = [
  { team: "F1 Global", color: "#E10600", sponsor: "LVMH (10-yr deal)", type: "Global", value: "$150M/yr" },
  { team: "McLaren", color: "#FF8000", sponsor: "Mastercard", type: "Title", value: "$100M/yr" },
  { team: "Red Bull", color: "#3671C6", sponsor: "Oracle (extended)", type: "Title", value: "$110M/yr" },
  { team: "Haas", color: "#B6BABD", sponsor: "Toyota Gazoo Racing", type: "New Title", value: "TBD" },
  { team: "Williams", color: "#1868DB", sponsor: "Atlassian", type: "New Title", value: "TBD" },
];

export default async function HomePage() {
  const data = await getHomepageData();
  return <HomePageContent data={data} />;
}

function HomePageContent({ data }: { data: HomepageData }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  const { nextRace, standings, recent, maxPts } = data;
  const completedCount = recent.length;
  const totalRounds = 22;

  const nextRaceSlug = nextRace.name
    .replace(/Grand Prix$/i, "GP")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#E10600]/8 blur-[100px] animate-live" style={{ animationDuration: "4s" }} />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="f1-label !text-[#E10600]">{t("liveDashboard")}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              </div>
              <h1 className="f1-display-xl text-white">{tCommon("appName")}</h1>
              <p className="f1-body-sm mt-1" style={{ color: "var(--text-dim)" }}>
                {tCommon("tagline")}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="f1-label-xs">{t("season2026")}</p>
              <p className="f1-data-lg text-[#666] mt-0.5">
                R{completedCount}<span style={{ color: "#2a2a2a" }}>/</span>{totalRounds}
              </p>
            </div>
          </div>

          <Link href={`/races/${nextRaceSlug}` as "/"} className="f1-surface-primary f1-corner-accent glow-red block p-5 sm:p-6 f1-transition animate-fade-up">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              <span className="f1-label !text-[#E10600]">{t("nextRace")}</span>
            </div>
            <RaceCountdown race={nextRace} />
          </Link>
        </div>
      </section>

      {/* ═══ 24H TOP MOVERS — Full-width feature cards ═══════════════ */}
      <section className="mx-auto max-w-7xl px-5 pt-8 pb-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("topMovers")}</span>
            <span className="f1-label-xs rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">24H</span>
          </div>
          <Link href="/markets" className="f1-transition f1-label hover:!text-white">
            {tCommon("viewAll")} &rarr;
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TOP_MOVERS.map((m) => {
            const change = m.newPct - m.oldPct;
            const isUp = change > 0;

            return (
              <div key={m.name + m.market} className="f1-surface p-4 f1-transition hover:border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="f1-team-bar h-5" style={{ backgroundColor: m.color }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="f1-data text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{m.code}</span>
                      <span className="f1-body-sm font-semibold text-white truncate">{m.name}</span>
                    </div>
                    <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>{m.market}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`f1-data text-xl font-bold ${isUp ? "text-[#22c55e]" : "text-[#E10600]"}`}>
                    {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{change}%
                  </span>
                  <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
                    {m.oldPct}% → {m.newPct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ LIVE ODDS — Full-width ═════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 pt-6 pb-0">
        <div className="f1-surface p-5 animate-fade-up stagger-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("liveOdds")}</span>
              <span className="f1-label-xs rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-live mr-1" style={{ verticalAlign: "middle" }} />
                Live
              </span>
            </div>
            <Link href="/markets" className="f1-transition f1-label hover:!text-white">
              {tCommon("viewAll")} &rarr;
            </Link>
          </div>
          <OddsSummary />
        </div>
      </section>

      {/* ═══ DATA CENTER — 3-column bento grid ══════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="f1-accent-bar" />
          <span className="f1-heading text-white">Data Center</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* ── Standings ──────────────────────────────────────────── */}
          <div className="f1-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="f1-heading text-white">{t("championshipStandings")}</span>
              <Link href="/drivers" className="f1-transition f1-label hover:!text-white">
                {tCommon("viewAll")} &rarr;
              </Link>
            </div>

            <div className="space-y-1.5">
              {standings.map((d) => (
                <Link key={d.pos} href={`/drivers/${d.id}` as "/"} className="f1-transition flex items-center gap-2.5 f1-surface-inner p-2 hover:bg-[#0d0d0d]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded f1-data text-[0.625rem] ${
                    d.pos === 1 ? "bg-[#E10600] text-white" : "text-[#444]"
                  }`}>
                    {d.pos}
                  </span>
                  <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="f1-body-sm font-semibold text-white truncate">{d.name}</span>
                      <span className="f1-data text-xs text-white ml-2">{d.pts}</span>
                    </div>
                    <div className="mt-1 h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full" style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Recent Results ─────────────────────────────────────── */}
          <div className="f1-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="f1-heading text-white">{t("recentResults")}</span>
              <Link href="/races" className="f1-transition f1-label hover:!text-white">
                {tCommon("viewAll")} &rarr;
              </Link>
            </div>

            <div className="space-y-1.5">
              {recent.map((r) => (
                <Link key={r.round} href={`/races/${r.slug}` as "/"} className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#131313] f1-data text-[0.625rem]" style={{ color: "#444" }}>
                    R{r.round}
                  </span>
                  <span className="f1-body-sm flex-1" style={{ color: "var(--text-muted)" }}>{r.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="f1-team-bar h-3" style={{ backgroundColor: r.color }} />
                    <span className="f1-data text-xs font-bold" style={{ color: r.color }}>{r.code}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Latest Deals ───────────────────────────────────────── */}
          <div className="f1-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="f1-heading text-white">{t("latestDeals")}</span>
              <Link href="/sponsorships" className="f1-transition f1-label hover:!text-white">
                {tCommon("viewAll")} &rarr;
              </Link>
            </div>

            <div className="space-y-1.5">
              {LATEST_DEALS.map((deal) => (
                <div key={deal.sponsor} className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]">
                  <div className="f1-team-bar h-5" style={{ backgroundColor: deal.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="f1-body-sm font-semibold text-white truncate block">{deal.sponsor}</span>
                    <span className="f1-label-xs" style={{ color: "#444" }}>{deal.team}</span>
                  </div>
                  <span className="f1-label rounded bg-[#131313] px-1.5 py-0.5 !text-[#444] shrink-0">{deal.type}</span>
                  <span className="f1-data text-xs text-[#22c55e] shrink-0">{deal.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── On This Day ─────────────────────────────────────────── */}
        <div className="mt-4">
          <OnThisDay />
        </div>

        {/* ── Disclaimer ──────────────────────────────────────────── */}
        <div className="mt-6 border-t border-[#1c1c1c] pt-4">
          <p className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
            F1 Pulse displays prediction market data for informational purposes only. This is not financial advice. Always do your own research. Data powered by OpenF1, Polymarket, and Jolpica.
          </p>
        </div>
      </section>
    </div>
  );
}
