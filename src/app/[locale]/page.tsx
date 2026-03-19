import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { OnThisDay } from "@/components/shared/on-this-day";
import { Link } from "@/lib/i18n/navigation";
import { getHomepageData } from "@/lib/data/home";
import { getNewsData, type NewsItem } from "@/lib/data/news";
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
  const [data, news] = await Promise.all([
    getHomepageData(),
    getNewsData().catch(() => [] as NewsItem[]),
  ]);
  return <HomePageContent data={data} news={news.slice(0, 4)} />;
}

const CATEGORY_COLORS: Record<string, string> = {
  official: "#E10600",
  analysis: "#FF8000",
  tech: "#27F4D2",
  general: "#3671C6",
};

function HomePageContent({ data, news }: { data: HomepageData; news: NewsItem[] }) {
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
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Next Race
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.04)]">
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
              <p className="font-mono text-2xl tabular-nums text-[var(--text-ghost)] mt-0.5 font-bold">
                R{completedCount}<span style={{ color: "#1c1c1c" }}>/</span>{totalRounds}
              </p>
            </div>
          </div>

          {/* Hero card — col-span-12 */}
          <Link href={`/races/${nextRaceSlug}` as "/"} className="f1-surface-primary f1-corner-accent glow-red block p-5 sm:p-6 f1-transition animate-fade-up">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              <span className="f1-label !text-[#E10600]">{t("nextRace")}</span>
            </div>
            <RaceCountdown race={nextRace} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BENTO DASHBOARD
          ══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="bento-grid">

          {/* ── 24H TOP MOVERS — full width row of micro-cards ────── */}
          <div className="md:col-span-12">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("topMovers")}</span>
                <span className="f1-label-xs rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.5)] px-2 py-0.5">24H</span>
              </div>
              <Link href="/markets" className="f1-transition f1-label hover:!text-white">
                {tCommon("viewAll")} &rarr;
              </Link>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {TOP_MOVERS.map((m) => {
                const change = m.newPct - m.oldPct;
                const isUp = change > 0;

                return (
                  <div
                    key={m.name + m.market}
                    className="f1-surface p-4 f1-transition hover:border-[rgba(255,255,255,0.12)] group"
                    style={{ borderLeft: `2px solid ${m.color}` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: "var(--text-ghost)" }}>{m.code}</span>
                          <span className="f1-body-sm font-semibold text-white truncate">{m.name}</span>
                        </div>
                        <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>{m.market}</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className={`font-mono text-xl tabular-nums font-bold ${isUp ? "text-emerald-400" : "text-rose-500"}`}>
                        {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{change}%
                      </span>
                      <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: "var(--text-ghost)" }}>
                        {m.oldPct}→{m.newPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── LIVE ODDS TRADING BOARD — full width ──────────────── */}
          <div className="md:col-span-12">
            <div className="f1-surface p-5 sm:p-6 animate-fade-up stagger-1">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("liveOdds")}</span>
                  <span className="f1-label-xs rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 !text-emerald-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-live mr-1" style={{ verticalAlign: "middle" }} />
                    Live
                  </span>
                </div>
                <Link href="/markets" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>
              <OddsSummary />
            </div>
          </div>

          {/* ── DATA CENTER HEADER ────────────────────────────────── */}
          <div className="md:col-span-12">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">Data Center</span>
            </div>
          </div>

          {/* ── STANDINGS — left column (6/12) ───────────────────── */}
          <div className="md:col-span-6">
            <div className="f1-surface p-5 h-full">
              <div className="mb-4 flex items-center justify-between">
                <span className="f1-heading text-white">{t("championshipStandings")}</span>
                <Link href="/drivers" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {standings.map((d) => (
                  <Link
                    key={d.pos}
                    href={`/drivers/${d.id}` as "/"}
                    className="f1-transition flex items-center gap-2.5 f1-surface-inner p-2.5 hover:bg-[rgba(15,15,15,0.8)]"
                    style={{ borderLeft: `2px solid ${d.color}` }}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[0.625rem] tabular-nums font-bold ${
                      d.pos === 1 ? "bg-[#E10600] text-white" : "text-[var(--text-ghost)]"
                    }`}>
                      {d.pos}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="f1-body-sm font-semibold text-white truncate">{d.name}</span>
                        <span className="font-mono text-xs tabular-nums text-white ml-2 font-bold">{d.pts}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-[#161616] overflow-hidden">
                        <div className="h-full rounded-full f1-transition" style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RECENT RESULTS — right column (6/12) ─────────────── */}
          <div className="md:col-span-6">
            <div className="f1-surface p-5 h-full">
              <div className="mb-4 flex items-center justify-between">
                <span className="f1-heading text-white">{t("recentResults")}</span>
                <Link href="/races" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {recent.map((r) => (
                  <Link key={r.round} href={`/races/${r.slug}` as "/"} className="f1-transition flex items-center gap-3 f1-surface-inner p-3 hover:bg-[rgba(15,15,15,0.8)]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(20,20,20,0.6)] font-mono text-[0.625rem] tabular-nums font-bold" style={{ color: "var(--text-dim)" }}>
                      R{r.round}
                    </span>
                    <span className="f1-body-sm flex-1" style={{ color: "var(--text-muted)" }}>{r.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="f1-team-bar h-4" style={{ backgroundColor: r.color }} />
                      <span className="font-mono text-xs tabular-nums font-bold" style={{ color: r.color }}>{r.code}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── LATEST DEALS (4/12) ──────────────────────────────── */}
          <div className="md:col-span-6 lg:col-span-4">
            <div className="f1-surface p-5 h-full">
              <div className="mb-4 flex items-center justify-between">
                <span className="f1-heading text-white">{t("latestDeals")}</span>
                <Link href="/sponsorships" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {LATEST_DEALS.map((deal) => (
                  <div
                    key={deal.sponsor}
                    className="f1-transition flex items-center gap-3 f1-surface-inner p-3 hover:bg-[rgba(15,15,15,0.8)]"
                    style={{ borderLeft: `2px solid ${deal.color}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="f1-body-sm font-semibold text-white truncate block">{deal.sponsor}</span>
                      <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>{deal.team}</span>
                    </div>
                    <span className="f1-label rounded-full bg-[rgba(20,20,20,0.6)] px-2 py-0.5 !text-[var(--text-ghost)] shrink-0">{deal.type}</span>
                    <span className="value-pill shrink-0">{deal.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HEADLINES — compact news widget (4/12) ─────────── */}
          <div className="md:col-span-6 lg:col-span-4">
            <div className="f1-surface p-5 h-full">
              <div className="mb-4 flex items-center justify-between">
                <span className="f1-heading text-white">Headlines</span>
                <Link href="/news" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {news.map((item, i) => (
                  <a
                    key={item.link + i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f1-transition flex items-start gap-3 f1-surface-inner p-3 hover:bg-[rgba(15,15,15,0.8)] group rounded"
                    style={{ borderLeft: `2px solid ${CATEGORY_COLORS[item.category] || "#666"}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="f1-body-sm font-semibold text-white group-hover:text-[#E10600] f1-transition line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.sourceColor }} />
                        <span className="f1-label-xs" style={{ color: item.sourceColor }}>{item.source}</span>
                        <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>{item.timeAgo}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── ON THIS DAY (4/12) ───────────────────────────────── */}
          <div className="md:col-span-12 lg:col-span-4">
            <OnThisDay />
          </div>

          {/* ── DISCLAIMER ────────────────────────────────────────── */}
          <div className="md:col-span-12 border-t border-[rgba(255,255,255,0.04)] pt-4">
            <p className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>
              F1 Pulse displays prediction market data for informational purposes only. This is not financial advice. Always do your own research. Data powered by OpenF1, Polymarket, and Jolpica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
