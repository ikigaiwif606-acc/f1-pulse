import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("qualifyingPace")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average gap to pole position across 2026 races.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { name: "Russell", gap: "+0.000s", team: "Mercedes" },
                { name: "Antonelli", gap: "+0.187s", team: "Mercedes" },
                { name: "Leclerc", gap: "+0.342s", team: "Ferrari" },
                { name: "Norris", gap: "+0.455s", team: "McLaren" },
                { name: "Verstappen", gap: "+0.521s", team: "Red Bull" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span>{d.name}</span>
                  <span className="font-mono">{d.gap}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("safetyCarProbability")}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {t("preRegulationData")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Historical safety car deployment rate by circuit.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { circuit: "Suzuka", rate: "35%" },
                { circuit: "Monaco", rate: "55%" },
                { circuit: "Silverstone", rate: "25%" },
                { circuit: "Monza", rate: "30%" },
                { circuit: "Spa", rate: "45%" },
              ].map((c) => (
                <div key={c.circuit} className="flex items-center justify-between text-sm">
                  <span>{c.circuit}</span>
                  <span className="font-mono font-bold">{c.rate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">{t("circuitComparison")}</CardTitle>
          </CardHeader>
          <CardContent className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Interactive circuit comparison charts will be available in Phase 1c.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
