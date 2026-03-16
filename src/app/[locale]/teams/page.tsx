import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const TEAMS = [
  { id: "mercedes", name: "Mercedes-AMG Petronas", drivers: ["George Russell", "Kimi Antonelli"], pts: 88, wins: 2, podiums: 4, pos: 1, color: "#27F4D2" },
  { id: "ferrari", name: "Scuderia Ferrari", drivers: ["Charles Leclerc", "Lewis Hamilton"], pts: 53, wins: 0, podiums: 3, pos: 2, color: "#E80020" },
  { id: "mclaren", name: "McLaren F1 Team", drivers: ["Lando Norris", "Oscar Piastri"], pts: 48, wins: 0, podiums: 1, pos: 3, color: "#FF8000" },
  { id: "redbull", name: "Oracle Red Bull Racing", drivers: ["Max Verstappen", "Yuki Tsunoda"], pts: 33, wins: 0, podiums: 1, pos: 4, color: "#3671C6" },
  { id: "aston_martin", name: "Aston Martin Aramco", drivers: ["Fernando Alonso", "Lance Stroll"], pts: 14, wins: 0, podiums: 0, pos: 5, color: "#229971" },
  { id: "audi", name: "Audi F1 Team", drivers: ["Nico Hülkenberg", "Gabriel Bortoleto"], pts: 14, wins: 0, podiums: 0, pos: 6, color: "#00594F" },
  { id: "alpine", name: "Alpine F1 Team", drivers: ["Pierre Gasly", "Jack Doohan"], pts: 8, wins: 0, podiums: 0, pos: 7, color: "#0093CC" },
  { id: "haas", name: "MoneyGram Haas F1", drivers: ["Esteban Ocon", "Oliver Bearman"], pts: 5, wins: 0, podiums: 0, pos: 8, color: "#B6BABD" },
  { id: "williams", name: "Williams Racing", drivers: ["Carlos Sainz", "Alex Albon"], pts: 4, wins: 0, podiums: 0, pos: 9, color: "#1868DB" },
  { id: "cadillac", name: "Cadillac F1 Team", drivers: ["TBD", "TBD"], pts: 0, wins: 0, podiums: 0, pos: 10, color: "#C0C0C0" },
];

const maxPts = Math.max(...TEAMS.map((t) => t.pts));

export default function TeamsPage() {
  const t = useTranslations("team");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("constructorChampionship")}</h1>
        <p className="text-xs text-muted-foreground">2026 Season &middot; After Round 2</p>
      </div>

      <div className="space-y-2">
        {TEAMS.map((team) => (
          <Card key={team.id} className="transition-all hover:border-foreground/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Position + team color */}
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                    {team.pos}
                  </span>
                  <div
                    className="h-10 w-1.5 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                </div>

                {/* Team info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold sm:text-base">{team.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {team.drivers.join(" / ")}
                  </p>
                  {/* Points bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-accent/50">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: maxPts > 0 ? `${(team.pts / maxPts) * 100}%` : "0%",
                        backgroundColor: team.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden gap-4 sm:flex">
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-muted-foreground">{t("wins")}</p>
                    <p className="text-sm font-bold tabular-nums">{team.wins}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase text-muted-foreground">{t("podiums")}</p>
                    <p className="text-sm font-bold tabular-nums">{team.podiums}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="text-xl font-black tabular-nums" style={{ color: team.color }}>
                    {team.pts}
                  </span>
                  <p className="text-[10px] uppercase text-muted-foreground">{t("points")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
