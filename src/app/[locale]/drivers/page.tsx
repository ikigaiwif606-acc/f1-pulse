import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder driver data — will be fetched from API
const DRIVERS = [
  { id: "russell", name: "George Russell", code: "RUS", team: "Mercedes", number: 63, pts: 51, wins: 2, podiums: 2, poles: 2, pos: 1, color: "#27F4D2" },
  { id: "antonelli", name: "Kimi Antonelli", code: "ANT", team: "Mercedes", number: 12, pts: 37, wins: 1, podiums: 2, poles: 0, pos: 2, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", team: "Ferrari", number: 16, pts: 31, wins: 0, podiums: 2, poles: 0, pos: 3, color: "#E80020" },
  { id: "norris", name: "Lando Norris", code: "NOR", team: "McLaren", number: 4, pts: 28, wins: 0, podiums: 1, poles: 0, pos: 4, color: "#FF8000" },
  { id: "verstappen", name: "Max Verstappen", code: "VER", team: "Red Bull Racing", number: 1, pts: 25, wins: 0, podiums: 1, poles: 0, pos: 5, color: "#3671C6" },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", team: "Ferrari", number: 44, pts: 22, wins: 0, podiums: 1, poles: 0, pos: 6, color: "#E80020" },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", team: "McLaren", number: 81, pts: 20, wins: 0, podiums: 0, poles: 0, pos: 7, color: "#FF8000" },
  { id: "hulkenberg", name: "Nico Hülkenberg", code: "HUL", team: "Audi", number: 27, pts: 12, wins: 0, podiums: 0, poles: 0, pos: 8, color: "#00594F" },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", team: "Aston Martin", number: 14, pts: 10, wins: 0, podiums: 0, poles: 0, pos: 9, color: "#229971" },
  { id: "tsunoda", name: "Yuki Tsunoda", code: "TSU", team: "Red Bull Racing", number: 22, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 10, color: "#3671C6" },
];

export default function DriversPage() {
  const t = useTranslations("driver");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("profile")}s</h1>
        <p className="text-xs text-muted-foreground">2026 Season &middot; After Round 2</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {DRIVERS.map((driver) => (
          <Card
            key={driver.id}
            className="group relative overflow-hidden transition-all hover:border-foreground/20 hover:shadow-lg"
          >
            {/* Team color top bar */}
            <div
              className="h-1 w-full"
              style={{ backgroundColor: driver.color }}
            />
            <CardContent className="p-4">
              {/* Header row */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{driver.team}</p>
                  <p className="text-lg font-bold leading-tight">{driver.name}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className="text-2xl font-black leading-none"
                    style={{ color: driver.color }}
                  >
                    {driver.number}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    P{driver.pos}
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-1 rounded-md bg-accent/50 p-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("points")}</p>
                  <p className="text-sm font-bold tabular-nums">{driver.pts}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("wins")}</p>
                  <p className="text-sm font-bold tabular-nums">{driver.wins}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("podiums")}</p>
                  <p className="text-sm font-bold tabular-nums">{driver.podiums}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("poles")}</p>
                  <p className="text-sm font-bold tabular-nums">{driver.poles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
