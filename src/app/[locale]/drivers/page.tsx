import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder driver data — will be fetched from API
const DRIVERS = [
  { id: "russell", name: "George Russell", team: "Mercedes", number: 63, pts: 51, color: "#27F4D2" },
  { id: "antonelli", name: "Kimi Antonelli", team: "Mercedes", number: 12, pts: 37, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", team: "Ferrari", number: 16, pts: 31, color: "#E80020" },
  { id: "norris", name: "Lando Norris", team: "McLaren", number: 4, pts: 28, color: "#FF8000" },
  { id: "verstappen", name: "Max Verstappen", team: "Red Bull Racing", number: 1, pts: 25, color: "#3671C6" },
  { id: "hamilton", name: "Lewis Hamilton", team: "Ferrari", number: 44, pts: 22, color: "#E80020" },
  { id: "piastri", name: "Oscar Piastri", team: "McLaren", number: 81, pts: 20, color: "#FF8000" },
  { id: "hulkenberg", name: "Nico Hülkenberg", team: "Audi", number: 27, pts: 12, color: "#00594F" },
];

export default function DriversPage() {
  const t = useTranslations("driver");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("profile")}s</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DRIVERS.map((driver) => (
          <Card key={driver.id} className="transition-colors hover:border-foreground/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-3xl font-bold"
                  style={{ color: driver.color }}
                >
                  {driver.number}
                </span>
                <span className="text-sm font-bold">{driver.pts} {t("points")}</span>
              </div>
              <CardTitle className="text-lg">{driver.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{driver.team}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
