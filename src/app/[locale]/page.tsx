import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";

// Next race data — will be fetched from API in Phase 1a
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
  { pos: 1, name: "George Russell", code: "RUS", team: "Mercedes", pts: 51, maxPts: 51, color: "#27F4D2" },
  { pos: 2, name: "Kimi Antonelli", code: "ANT", team: "Mercedes", pts: 37, maxPts: 51, color: "#27F4D2" },
  { pos: 3, name: "Charles Leclerc", code: "LEC", team: "Ferrari", pts: 31, maxPts: 51, color: "#E80020" },
  { pos: 4, name: "Lando Norris", code: "NOR", team: "McLaren", pts: 28, maxPts: 51, color: "#FF8000" },
  { pos: 5, name: "Max Verstappen", code: "VER", team: "Red Bull", pts: 25, maxPts: 51, color: "#3671C6" },
];

const RECENT_RESULTS = [
  { round: 1, name: "Australia", winner: "George Russell", team: "Mercedes", color: "#27F4D2" },
  { round: 2, name: "China", winner: "Kimi Antonelli", team: "Mercedes", color: "#27F4D2" },
];

export default function HomePage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {/* Hero */}
      <section className="mb-8 sm:mb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {tCommon("appName")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {tCommon("tagline")}
            </p>
          </div>
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <p>2026 Season &middot; Round 2 of 22</p>
          </div>
        </div>

        {/* Next Race Countdown */}
        <Card className="overflow-hidden border-red-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/8 via-transparent to-transparent" />
          <CardHeader className="relative pb-0">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {t("nextRace")}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative pt-3">
            <RaceCountdown race={NEXT_RACE} />
          </CardContent>
        </Card>
      </section>

      {/* Dashboard Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Live Polymarket Odds — 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              {t("liveOdds")}
            </CardTitle>
            <Link
              href="/markets"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {tCommon("viewAll")} &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            <OddsSummary />
          </CardContent>
        </Card>

        {/* Right column — stacked */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Championship Standings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">
                {t("championshipStandings")}
              </CardTitle>
              <Link
                href="/drivers"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {tCommon("viewAll")} &rarr;
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {STANDINGS.map((d) => (
                  <div key={d.pos} className="flex items-center gap-3">
                    <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                      {d.pos}
                    </span>
                    <div
                      className="h-8 w-1 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium truncate">
                          {d.name}
                        </p>
                        <span className="ml-2 text-sm font-bold tabular-nums">
                          {d.pts}
                        </span>
                      </div>
                      {/* Points progress bar */}
                      <div className="mt-1 h-1 w-full rounded-full bg-accent">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${(d.pts / d.maxPts) * 100}%`,
                            backgroundColor: d.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("recentResults")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_RESULTS.map((r) => (
                  <div key={r.round} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold">
                      R{r.round}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span
                          className="font-medium"
                          style={{ color: r.color }}
                        >
                          {r.winner}
                        </span>
                        {" "}&middot; {r.team}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
