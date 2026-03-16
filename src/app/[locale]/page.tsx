import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { Link } from "@/lib/i18n/navigation";

const NEXT_RACE = {
  name: "Japanese Grand Prix",
  nameZh: "日本大奖赛",
  circuit: "Suzuka International Racing Course",
  circuitZh: "铃鹿国际赛车场",
  date: "2026-03-29T06:00:00Z",
  round: 3,
  isSprint: false,
};

const STANDINGS = [
  { pos: 1, name: "George Russell", code: "RUS", team: "Mercedes", pts: 51, color: "#27F4D2" },
  { pos: 2, name: "Kimi Antonelli", code: "ANT", team: "Mercedes", pts: 37, color: "#27F4D2" },
  { pos: 3, name: "Charles Leclerc", code: "LEC", team: "Ferrari", pts: 31, color: "#E80020" },
  { pos: 4, name: "Lando Norris", code: "NOR", team: "McLaren", pts: 28, color: "#FF8000" },
  { pos: 5, name: "Max Verstappen", code: "VER", team: "Red Bull", pts: 25, color: "#3671C6" },
];

const RECENT_RESULTS = [
  { round: 1, name: "Australian GP", winner: "Russell", code: "RUS", color: "#27F4D2", gap: "—" },
  { round: 2, name: "Chinese GP", winner: "Antonelli", code: "ANT", color: "#27F4D2", gap: "+3.241s" },
];

const maxPts = 51;

export default function HomePage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1f1f1f]">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid" />
        {/* Red gradient glow */}
        <div className="absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-[#E10600]/8 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-6 sm:pb-12 sm:pt-8">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
                  Live Dashboard
                </span>
                <span className="h-1 w-1 rounded-full bg-[#E10600] animate-live" />
              </div>
              <h1 className="font-display mt-1 text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
                {tCommon("appName")}
              </h1>
              <p className="mt-0.5 text-xs text-[#4a4a4a]">
                {tCommon("tagline")}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                2026 Season
              </p>
              <p className="timing-number text-lg font-bold text-[#737373]">
                R2<span className="text-[#2a2a2a]">/</span>22
              </p>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111]/80 p-4 backdrop-blur-sm sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#E10600]">
                {t("nextRace")}
              </span>
            </div>
            <RaceCountdown race={NEXT_RACE} />
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Live Odds — 2 cols */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-[#1f1f1f] bg-[#111]/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    {t("liveOdds")}
                  </span>
                </div>
                <Link
                  href="/markets"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a] transition-colors hover:text-white"
                >
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>
              <OddsSummary />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Championship Standings */}
            <div className="rounded-lg border border-[#1f1f1f] bg-[#111]/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    {t("championshipStandings")}
                  </span>
                </div>
                <Link
                  href="/drivers"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a] transition-colors hover:text-white"
                >
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                {STANDINGS.map((d) => (
                  <div
                    key={d.pos}
                    className="flex items-center gap-2.5 rounded bg-[#0a0a0a] p-2"
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                      d.pos === 1 ? "bg-[#E10600] text-white" : "text-[#4a4a4a]"
                    }`}>
                      {d.pos}
                    </span>
                    <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">{d.name}</span>
                        <span className="timing-number ml-2 text-xs font-bold text-white">{d.pts}</span>
                      </div>
                      <div className="mt-1 h-[2px] w-full rounded-full bg-[#1a1a1a]">
                        <div
                          className="h-[2px] rounded-full"
                          style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="rounded-lg border border-[#1f1f1f] bg-[#111]/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
                <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  {t("recentResults")}
                </span>
              </div>

              <div className="space-y-1.5">
                {RECENT_RESULTS.map((r) => (
                  <div
                    key={r.round}
                    className="flex items-center gap-3 rounded bg-[#0a0a0a] p-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a1a1a] text-[10px] font-bold text-[#4a4a4a]">
                      R{r.round}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#737373]">{r.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-0.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-xs font-bold" style={{ color: r.color }}>
                        {r.code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
