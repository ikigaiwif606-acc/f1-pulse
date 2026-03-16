import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function HomePage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero / Next Race */}
      <section className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          {tCommon("appName")}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {tCommon("tagline")}
        </p>

        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {t("nextRace")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RaceCountdown race={NEXT_RACE} />
          </CardContent>
        </Card>
      </section>

      {/* Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Live Polymarket Odds */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">{t("liveOdds")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OddsSummary />
          </CardContent>
        </Card>

        {/* Championship Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("championshipStandings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { pos: 1, name: "George Russell", team: "Mercedes", pts: 51, color: "#27F4D2" },
                { pos: 2, name: "Kimi Antonelli", team: "Mercedes", pts: 37, color: "#27F4D2" },
                { pos: 3, name: "Charles Leclerc", team: "Ferrari", pts: 31, color: "#E80020" },
                { pos: 4, name: "Lando Norris", team: "McLaren", pts: 28, color: "#FF8000" },
                { pos: 5, name: "Max Verstappen", team: "Red Bull", pts: 25, color: "#3671C6" },
              ].map((d) => (
                <div key={d.pos} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                      {d.pos}
                    </span>
                    <div
                      className="h-4 w-1 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.team}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{d.pts}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
