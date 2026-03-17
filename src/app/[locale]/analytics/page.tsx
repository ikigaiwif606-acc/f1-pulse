import { useTranslations } from "next-intl";
import { getQualifyingResults } from "@/lib/api/ergast";
import { getTeamColor } from "@/lib/data/transformers";
import { PointsProgressionChart } from "@/components/charts/points-chart";
import { LapComparisonChart } from "@/components/charts/lap-comparison";
import { Link } from "@/lib/i18n/navigation";

// ── Driver code → slug mapping ───────────────────────────────────────────────
const DRIVER_SLUG: Record<string, string> = {
  RUS: "russell", ANT: "antonelli", LEC: "leclerc", HAM: "hamilton",
  NOR: "norris", VER: "verstappen", PIA: "piastri", HAD: "hadjar",
  BEA: "bearman", GAS: "gasly", LAW: "lawson", LIN: "lindblad",
  SAI: "sainz", ALB: "albon", BOR: "bortoleto", HUL: "hulkenberg",
  COL: "colapinto", OCO: "ocon", ALO: "alonso", STR: "stroll",
  BOT: "bottas", PER: "perez",
};

// ── Fallback qualifying data (top 10, R2 China 2026) ─────────────────────────
const FALLBACK_QUALIFYING = [
  { name: "Antonelli", code: "ANT", gap: "+0.000s", color: "#27F4D2", pct: 100 },
  { name: "Russell", code: "RUS", gap: "+0.222s", color: "#27F4D2", pct: 78 },
  { name: "Hamilton", code: "HAM", gap: "+0.351s", color: "#E80020", pct: 65 },
  { name: "Leclerc", code: "LEC", gap: "+0.456s", color: "#E80020", pct: 54 },
  { name: "Norris", code: "NOR", gap: "+0.512s", color: "#FF8000", pct: 49 },
  { name: "Verstappen", code: "VER", gap: "+0.610s", color: "#3671C6", pct: 39 },
  { name: "Piastri", code: "PIA", gap: "+0.701s", color: "#FF8000", pct: 30 },
  { name: "Hadjar", code: "HAD", gap: "+0.785s", color: "#3671C6", pct: 22 },
  { name: "Bearman", code: "BEA", gap: "+0.812s", color: "#B6BABD", pct: 19 },
  { name: "Gasly", code: "GAS", gap: "+0.890s", color: "#0093CC", pct: 11 },
];

// ── Safety car data (12 circuits) ────────────────────────────────────────────
const SAFETY_CAR = [
  { circuit: "Monaco", rate: 75, icon: "\u{1F1F2}\u{1F1E8}" },
  { circuit: "Jeddah", rate: 70, icon: "\u{1F1F8}\u{1F1E6}" },
  { circuit: "Montreal", rate: 65, icon: "\u{1F1E8}\u{1F1E6}" },
  { circuit: "Melbourne", rate: 60, icon: "\u{1F1E6}\u{1F1FA}" },
  { circuit: "Miami", rate: 55, icon: "\u{1F1FA}\u{1F1F8}" },
  { circuit: "Bahrain", rate: 50, icon: "\u{1F1E7}\u{1F1ED}" },
  { circuit: "Spa", rate: 45, icon: "\u{1F1E7}\u{1F1EA}" },
  { circuit: "Shanghai", rate: 42, icon: "\u{1F1E8}\u{1F1F3}" },
  { circuit: "Spielberg", rate: 40, icon: "\u{1F1E6}\u{1F1F9}" },
  { circuit: "Silverstone", rate: 38, icon: "\u{1F1EC}\u{1F1E7}" },
  { circuit: "Suzuka", rate: 35, icon: "\u{1F1EF}\u{1F1F5}" },
  { circuit: "Monza", rate: 30, icon: "\u{1F1EE}\u{1F1F9}" },
];

// ── DNF rate by team (all 11 teams) ──────────────────────────────────────────
const DNF = [
  { team: "Williams", rate: 25, color: "#1868DB" },
  { team: "Haas", rate: 20, color: "#B6BABD" },
  { team: "Audi", rate: 15, color: "#00594F" },
  { team: "Cadillac", rate: 13, color: "#C0C0C0" },
  { team: "Alpine", rate: 12, color: "#0093CC" },
  { team: "Red Bull", rate: 10, color: "#3671C6" },
  { team: "Aston Martin", rate: 8, color: "#229971" },
  { team: "Racing Bulls", rate: 5, color: "#6692FF" },
  { team: "McLaren", rate: 5, color: "#FF8000" },
  { team: "Ferrari", rate: 0, color: "#E80020" },
  { team: "Mercedes", rate: 0, color: "#27F4D2" },
];

// ── Teammate battles (after R2) ─────────────────────────────────────────────
const TEAMMATE_BATTLES = [
  { team: "Mercedes", color: "#27F4D2", d1: "Russell", c1: "RUS", d2: "Antonelli", c2: "ANT", qualiH2H: [2, 0], raceH2H: [1, 1], pts: [51, 47] },
  { team: "Ferrari", color: "#E80020", d1: "Leclerc", c1: "LEC", d2: "Hamilton", c2: "HAM", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [34, 33] },
  { team: "McLaren", color: "#FF8000", d1: "Norris", c1: "NOR", d2: "Piastri", c2: "PIA", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [15, 3] },
  { team: "Red Bull", color: "#3671C6", d1: "Verstappen", c1: "VER", d2: "Hadjar", c2: "HAD", qualiH2H: [2, 0], raceH2H: [1, 1], pts: [8, 4] },
  { team: "Haas", color: "#B6BABD", d1: "Bearman", c1: "BEA", d2: "Ocon", c2: "OCO", qualiH2H: [2, 0], raceH2H: [2, 0], pts: [17, 0] },
  { team: "Alpine", color: "#0093CC", d1: "Gasly", c1: "GAS", d2: "Colapinto", c2: "COL", qualiH2H: [2, 0], raceH2H: [2, 0], pts: [9, 1] },
  { team: "Racing Bulls", color: "#6692FF", d1: "Lawson", c1: "LAW", d2: "Lindblad", c2: "LIN", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [8, 4] },
  { team: "Williams", color: "#1868DB", d1: "Sainz", c1: "SAI", d2: "Albon", c2: "ALB", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [2, 0] },
  { team: "Audi", color: "#00594F", d1: "Bortoleto", c1: "BOR", d2: "Hulkenberg", c2: "HUL", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [2, 0] },
  { team: "Aston Martin", color: "#229971", d1: "Alonso", c1: "ALO", d2: "Stroll", c2: "STR", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [0, 0] },
  { team: "Cadillac", color: "#C0C0C0", d1: "Bottas", c1: "BOT", d2: "Perez", c2: "PER", qualiH2H: [1, 1], raceH2H: [1, 1], pts: [0, 0] },
];

// ── Grid vs Finish (after R2) ───────────────────────────────────────────────
const GRID_VS_FINISH = [
  { name: "Russell", code: "RUS", color: "#27F4D2", avgGrid: 1.5, avgFinish: 1.5, delta: 0 },
  { name: "Antonelli", code: "ANT", color: "#27F4D2", avgGrid: 2.0, avgFinish: 2.0, delta: 0 },
  { name: "Leclerc", code: "LEC", color: "#E80020", avgGrid: 4.0, avgFinish: 3.5, delta: 0.5 },
  { name: "Hamilton", code: "HAM", color: "#E80020", avgGrid: 5.0, avgFinish: 4.0, delta: 1.0 },
  { name: "Bearman", code: "BEA", color: "#B6BABD", avgGrid: 8.5, avgFinish: 5.5, delta: 3.0 },
  { name: "Norris", code: "NOR", color: "#FF8000", avgGrid: 3.5, avgFinish: 6.0, delta: -2.5 },
  { name: "Gasly", code: "GAS", color: "#0093CC", avgGrid: 9.0, avgFinish: 7.5, delta: 1.5 },
  { name: "Verstappen", code: "VER", color: "#3671C6", avgGrid: 6.0, avgFinish: 8.0, delta: -2.0 },
  { name: "Lawson", code: "LAW", color: "#6692FF", avgGrid: 10.0, avgFinish: 9.0, delta: 1.0 },
  { name: "Piastri", code: "PIA", color: "#FF8000", avgGrid: 7.0, avgFinish: 10.5, delta: -3.5 },
];

// ── Betting edge finder ─────────────────────────────────────────────────────
const TOTAL_POINTS = 193;
const BETTING_EDGE = [
  { name: "Russell", code: "RUS", color: "#27F4D2", odds: 60, pts: 51 },
  { name: "Antonelli", code: "ANT", color: "#27F4D2", odds: 18, pts: 47 },
  { name: "Leclerc", code: "LEC", color: "#E80020", odds: 10, pts: 34 },
  { name: "Hamilton", code: "HAM", color: "#E80020", odds: 5, pts: 33 },
  { name: "Norris", code: "NOR", color: "#FF8000", odds: 5, pts: 15 },
  { name: "Verstappen", code: "VER", color: "#3671C6", odds: 3, pts: 8 },
];

// ── Tire strategy data ──────────────────────────────────────────────────────
const TIRE_STRATEGY = {
  totalStints: 30,
  compounds: [
    { compound: "Hard", abbr: "H", color: "#ededed", textColor: "#000", count: 14, pct: 47 },
    { compound: "Medium", abbr: "M", color: "#f59e0b", textColor: "#000", count: 10, pct: 33 },
    { compound: "Soft", abbr: "S", color: "#E10600", textColor: "#fff", count: 6, pct: 20 },
  ],
  avgStints: 3.0,
  mostPopularStrategy: "M \u2192 H \u2192 H",
};

// ── Tab categories for sticky pill bar ──────────────────────────────────────
const TAB_CATEGORIES = [
  { label: "Pace", href: "#pace" },
  { label: "Reliability", href: "#reliability" },
  { label: "Strategy", href: "#strategy" },
  { label: "Betting", href: "#betting" },
  { label: "Head-to-Head", href: "#head-to-head" },
];

// ── Types ────────────────────────────────────────────────────────────────────
type QualifyingEntry = { name: string; code: string; gap: string; color: string; pct: number };

function parseQualifyingTime(time: string): number | null {
  if (!time) return null;
  const parts = time.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  const val = parseFloat(time);
  return isNaN(val) ? null : val;
}

async function getQualifyingData(): Promise<QualifyingEntry[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await getQualifyingResults(2026)) as any;
    const races = data?.MRData?.RaceTable?.Races || [];
    if (races.length === 0) return FALLBACK_QUALIFYING;

    const latestRace = races[races.length - 1];
    const results = latestRace?.QualifyingResults || [];
    if (results.length === 0) return FALLBACK_QUALIFYING;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = results.slice(0, 10).map((r: any) => {
      const time = r.Q3 || r.Q2 || r.Q1 || "";
      const driver = r.Driver;
      const team = r.Constructor?.name || "";
      return {
        name: driver.familyName,
        code: driver.code || driver.familyName.slice(0, 3).toUpperCase(),
        time,
        color: getTeamColor(team),
      };
    });

    const poleTime = parseQualifyingTime(parsed[0]?.time);
    if (!poleTime) return FALLBACK_QUALIFYING;

    return parsed.map(
      (p: { name: string; code: string; time: string; color: string }, i: number) => {
        const t = parseQualifyingTime(p.time);
        const gap = t ? t - poleTime : 0;
        const maxGap = 1.0;
        const pct = Math.max(0, 100 - (gap / maxGap) * 100);
        return {
          name: p.name,
          code: p.code,
          gap: i === 0 ? "+0.000s" : `+${gap.toFixed(3)}s`,
          color: p.color,
          pct: Math.round(pct),
        };
      }
    );
  } catch {
    return FALLBACK_QUALIFYING;
  }
}

export default async function AnalyticsPage() {
  const qualifying = await getQualifyingData();
  return <AnalyticsPageContent qualifying={qualifying} />;
}

function AnalyticsPageContent({ qualifying }: { qualifying: QualifyingEntry[] }) {
  const t = useTranslations("analytics");

  const roundsCompleted = TEAMMATE_BATTLES.length > 0
    ? TEAMMATE_BATTLES[0].qualiH2H[0] + TEAMMATE_BATTLES[0].qualiH2H[1]
    : 0;

  // Sort betting edge by absolute gap (biggest mispricing first)
  const sortedBettingEdge = [...BETTING_EDGE]
    .map((d) => {
      const ptsShare = parseFloat(((d.pts / TOTAL_POINTS) * 100).toFixed(1));
      const gap = ptsShare - d.odds;
      return { ...d, ptsShare, gap };
    })
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">{t("intelligence")}</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">{t("dataFromRounds", { count: roundsCompleted })} &middot; {t("season2026")}</p>
        </div>

        {/* ── Sticky Tab / Pill Bar ──────────────────────────────────────── */}
        <nav className="sticky top-12 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-[#1c1c1c] mb-6">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            {TAB_CATEGORIES.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="shrink-0 rounded-full px-4 py-1.5 f1-label border border-[#1c1c1c] bg-[#0c0c0c] f1-transition hover:!text-white hover:border-[#333] hover:bg-[#161616]"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="grid gap-4 md:grid-cols-2">
          {/* ── 1. QUALIFYING PACE ──────────────────────────────────────── */}
          <div id="pace" className="f1-surface p-5" style={{ scrollMarginTop: "4rem" }}>
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("qualifyingPace")}</span>
              <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Average gap to pole position across all qualifying sessions this season">&#9432;</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="f1-label">{t("qualifyingPaceDesc")}</p>
              <span className="f1-label-xs rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">Top 10 shown</span>
            </div>

            <div className="space-y-2">
              {qualifying.map((d, i) => (
                <Link key={d.code} href={"/drivers/" + (DRIVER_SLUG[d.code] || d.code.toLowerCase())} className="flex items-center gap-3 cursor-pointer hover:bg-[#111] rounded transition-colors -mx-1 px-1">
                  <span className="f1-data w-4 text-center text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{i + 1}</span>
                  <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                  <span className="f1-data w-8 text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{d.code}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                  <span className={`f1-data text-xs ${i === 0 ? "text-[#E10600]" : "text-[var(--text-muted)]"}`}>{d.gap}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── 2. GRID vs FINISH ───────────────────────────────────────── */}
          <div id="grid-vs-finish" className="f1-surface p-5" style={{ scrollMarginTop: "4rem" }}>
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("gridVsFinish")}</span>
              <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Compares average starting position to average finishing position — positive delta means gaining places">&#9432;</span>
            </div>
            <p className="f1-label mb-4">{t("gridVsFinishDesc")}</p>

            <div className="space-y-2">
              {GRID_VS_FINISH.map((d) => {
                const isGain = d.delta > 0;
                const isLoss = d.delta < 0;
                return (
                  <Link key={d.code} href={"/drivers/" + (DRIVER_SLUG[d.code] || d.code.toLowerCase())} className="flex items-center gap-3 cursor-pointer hover:bg-[#111] rounded transition-colors -mx-1 px-1">
                    <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                    <span className="f1-data w-8 text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{d.code}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="f1-data w-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>P{d.avgGrid.toFixed(1)}</span>
                      <div className="flex-1 flex items-center justify-center">
                        <svg width="16" height="10" viewBox="0 0 16 10" className="mx-1">
                          <path d="M0 5 L12 5 M9 2 L12 5 L9 8" stroke={isGain ? "#22c55e" : isLoss ? "#ef4444" : "var(--text-dim)"} strokeWidth="1.5" fill="none" />
                        </svg>
                      </div>
                      <span className="f1-data w-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>P{d.avgFinish.toFixed(1)}</span>
                    </div>
                    <span
                      className="f1-data w-12 text-right text-xs font-semibold"
                      style={{ color: isGain ? "#22c55e" : isLoss ? "#ef4444" : "var(--text-dim)" }}
                    >
                      {isGain && "+"}{d.delta.toFixed(1)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── 3. BETTING EDGE FINDER (full width) ─────────────────────── */}
          <div id="betting" className="f1-surface p-5 md:col-span-2" style={{ scrollMarginTop: "4rem" }}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("bettingEdge")}</span>
                <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Compares Polymarket championship odds to actual points share — positive gap suggests the market undervalues this driver">&#9432;</span>
              </div>
              <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">
                Polymarket
              </span>
            </div>
            <p className="f1-label mb-4">{t("bettingEdgeDesc")}</p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedBettingEdge.map((d) => {
                const isValue = d.gap > 0;
                const label = isValue ? t("valueBet") : t("overvalued");
                return (
                  <Link key={d.code} href={"/drivers/" + (DRIVER_SLUG[d.code] || d.code.toLowerCase())} className="block cursor-pointer">
                    <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-4 transition-colors hover:border-[#333]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                        <span className="f1-heading text-sm text-white">{d.name}</span>
                        <span className="f1-data text-[0.625rem]" style={{ color: "var(--text-dim)" }}>{d.code}</span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="f1-label text-[0.625rem]">{t("marketOdds")}</span>
                          <span className="f1-data text-sm text-white">{d.odds}%</span>
                        </div>
                        <div className="h-[3px] w-full rounded-full bg-[#161616]">
                          <div className="h-[3px] rounded-full bg-[var(--text-muted)]" style={{ width: `${d.odds}%` }} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="f1-label text-[0.625rem]">{t("actualPtsShare")}</span>
                          <span className="f1-data text-sm text-white">{d.ptsShare}%</span>
                        </div>
                        <div className="h-[3px] w-full rounded-full bg-[#161616]">
                          <div className="h-[3px] rounded-full" style={{ width: `${d.ptsShare}%`, backgroundColor: d.color }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1c1c1c] pt-2">
                        <span
                          className="f1-data text-xs font-bold"
                          style={{ color: isValue ? "#22c55e" : "#ef4444" }}
                        >
                          {isValue ? "+" : ""}{d.gap.toFixed(1)}%
                        </span>
                        <span
                          className="f1-label-xs rounded px-1.5 py-0.5"
                          style={{
                            backgroundColor: isValue ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                            color: isValue ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── 4. TIRE STRATEGY TRENDS (full width) ────────────────────── */}
          <div id="strategy" className="f1-surface p-5 md:col-span-2" style={{ scrollMarginTop: "4rem" }}>
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">Tire Strategy Trends</span>
            </div>
            <p className="f1-label mb-4">Compound distribution across {roundsCompleted} rounds</p>

            {/* Stacked bar */}
            <div className="flex h-6 w-full overflow-hidden rounded-full mb-4">
              {TIRE_STRATEGY.compounds.map((c) => (
                <div
                  key={c.abbr}
                  className="flex items-center justify-center f1-data text-[0.625rem]"
                  style={{
                    width: `${c.pct}%`,
                    backgroundColor: c.color,
                    color: c.textColor,
                  }}
                >
                  {c.abbr} {c.pct}%
                </div>
              ))}
            </div>

            {/* Stat cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-4 text-center">
                <p className="f1-label-xs mb-2">Most Used</p>
                <p className="f1-data-lg text-white">Hard</p>
                <p className="f1-label-xs mt-1" style={{ color: "var(--text-dim)" }}>47%</p>
              </div>
              <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-4 text-center">
                <p className="f1-label-xs mb-2">Avg Stints</p>
                <p className="f1-data-lg text-white">{TIRE_STRATEGY.avgStints.toFixed(1)}</p>
              </div>
              <div className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-4 text-center">
                <p className="f1-label-xs mb-2">Popular Strategy</p>
                <p className="f1-data-lg text-white">{TIRE_STRATEGY.mostPopularStrategy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Points Progression Chart ────────────────────────────────── */}
        <div className="mt-4">
          <PointsProgressionChart />
        </div>

        {/* ── Lap Time Comparison ─────────────────────────────────────── */}
        <div className="mt-4">
          <LapComparisonChart />
        </div>

        {/* ── DNF + Safety Car (2-column grid) ───────────────────────── */}
        <div id="reliability" className="grid gap-4 md:grid-cols-2 mt-4" style={{ scrollMarginTop: "4rem" }}>
          {/* ── DNF RATE BY TEAM ─────────────────────────────────────── */}
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("dnfRate")}</span>
              <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Percentage of race starts that ended in retirement per team">&#9432;</span>
            </div>
            <p className="f1-label mb-4">{t("dnfRateDesc")}</p>

            <div className="space-y-2">
              {DNF.map((d) => (
                <div key={d.team} className="flex items-center gap-3">
                  <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                  <span className="f1-body-sm w-24" style={{ color: "var(--text-muted)" }}>{d.team}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full" style={{ width: `${Math.max(d.rate, 1)}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                  <span className="f1-data w-8 text-right text-xs text-[var(--text-muted)]">{d.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SAFETY CAR PROBABILITY ───────────────────────────────── */}
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("safetyCarProbability")}</span>
                <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Historical safety car deployment rate at each circuit (pre-2026 data)">&#9432;</span>
              </div>
              <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">
                {t("preRegulationData")}
              </span>
            </div>
            <p className="f1-label mb-4">{t("safetyCarDesc")}</p>

            <div className="space-y-2">
              {SAFETY_CAR.map((c) => (
                <div key={c.circuit} className="flex items-center gap-3">
                  <span className="hidden text-sm sm:block">{c.icon}</span>
                  <span className="f1-body-sm w-24 truncate" style={{ color: "var(--text-muted)" }}>{c.circuit}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full bg-[#f59e0b]" style={{ width: `${c.rate}%` }} />
                    </div>
                  </div>
                  <span className="f1-data w-8 text-right text-xs text-[#f59e0b]">{c.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TEAMMATE BATTLES (full width) ──────────────────────────── */}
        <div id="head-to-head" className="mt-4" style={{ scrollMarginTop: "4rem" }}>
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("teammateBattles")}</span>
              <span className="cursor-help f1-label-xs !text-[var(--text-muted)]" title="Head-to-head qualifying and race finishing position comparison between teammates">&#9432;</span>
            </div>
            <p className="f1-label mb-4">{t("teammateBattlesDesc")}</p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TEAMMATE_BATTLES.map((b) => {
                const qualiTotal = b.qualiH2H[0] + b.qualiH2H[1];
                const raceTotal = b.raceH2H[0] + b.raceH2H[1];
                const qualiPct1 = qualiTotal > 0 ? (b.qualiH2H[0] / qualiTotal) * 100 : 50;
                const racePct1 = raceTotal > 0 ? (b.raceH2H[0] / raceTotal) * 100 : 50;

                return (
                  <div key={b.team} className="rounded border border-[#1c1c1c] bg-[#0c0c0c] p-4">
                    {/* Team header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="f1-team-bar h-5" style={{ backgroundColor: b.color }} />
                      <span className="f1-label text-[0.625rem] uppercase tracking-wider" style={{ color: b.color }}>{b.team}</span>
                    </div>

                    {/* Driver names and points */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-left">
                        <span className="f1-data text-sm font-bold text-white">{b.c1}</span>
                        <p className="f1-data text-[0.625rem] text-[var(--text-muted)]">{b.pts[0]} pts</p>
                      </div>
                      <span className="f1-label text-[0.5rem] text-[var(--text-subtle)]">vs</span>
                      <div className="text-right">
                        <span className="f1-data text-sm font-bold text-white">{b.c2}</span>
                        <p className="f1-data text-[0.625rem] text-[var(--text-muted)]">{b.pts[1]} pts</p>
                      </div>
                    </div>

                    {/* Quali H2H bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="f1-label text-[0.5rem]">{t("qualifying")}</span>
                        <span className="f1-data text-[0.5rem] text-[var(--text-dim)]">{b.qualiH2H[0]}-{b.qualiH2H[1]}</span>
                      </div>
                      <div className="flex h-[4px] w-full overflow-hidden rounded-full">
                        <div className="h-full" style={{ width: `${qualiPct1}%`, backgroundColor: b.color }} />
                        <div className="h-full" style={{ width: `${100 - qualiPct1}%`, backgroundColor: "#1c1c1c" }} />
                      </div>
                    </div>

                    {/* Race H2H bar */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="f1-label text-[0.5rem]">{t("raceH2H")}</span>
                        <span className="f1-data text-[0.5rem] text-[var(--text-dim)]">{b.raceH2H[0]}-{b.raceH2H[1]}</span>
                      </div>
                      <div className="flex h-[4px] w-full overflow-hidden rounded-full">
                        <div className="h-full" style={{ width: `${racePct1}%`, backgroundColor: b.color }} />
                        <div className="h-full" style={{ width: `${100 - racePct1}%`, backgroundColor: "#1c1c1c" }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
