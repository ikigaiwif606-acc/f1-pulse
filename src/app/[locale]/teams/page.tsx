import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEAMS = [
  { id: "mercedes", name: "Mercedes-AMG Petronas", drivers: ["George Russell", "Kimi Antonelli"], pts: 88, color: "#27F4D2" },
  { id: "ferrari", name: "Scuderia Ferrari", drivers: ["Charles Leclerc", "Lewis Hamilton"], pts: 53, color: "#E80020" },
  { id: "mclaren", name: "McLaren F1 Team", drivers: ["Lando Norris", "Oscar Piastri"], pts: 48, color: "#FF8000" },
  { id: "redbull", name: "Red Bull Racing", drivers: ["Max Verstappen", "Yuki Tsunoda"], pts: 35, color: "#3671C6" },
  { id: "aston_martin", name: "Aston Martin", drivers: ["Fernando Alonso", "Lance Stroll"], pts: 18, color: "#229971" },
  { id: "audi", name: "Audi F1 Team", drivers: ["Nico Hülkenberg", "Gabriel Bortoleto"], pts: 14, color: "#00594F" },
];

export default function TeamsPage() {
  const t = useTranslations("team");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("constructorChampionship")}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEAMS.map((team) => (
          <Card key={team.id} className="transition-colors hover:border-foreground/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-1.5 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex justify-between">
                <span className="text-sm text-muted-foreground">{t("points")}</span>
                <span className="text-lg font-bold">{team.pts}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{t("drivers")}</span>
                <div className="mt-1 space-y-1">
                  {team.drivers.map((d) => (
                    <p key={d} className="text-sm">{d}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
