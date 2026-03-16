import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 2026 F1 Calendar — will be fetched from API
const RACES_2026 = [
  { round: 1, name: "Australian Grand Prix", nameZh: "澳大利亚大奖赛", circuit: "Melbourne", date: "2026-03-06", completed: true },
  { round: 2, name: "Chinese Grand Prix", nameZh: "中国大奖赛", circuit: "Shanghai", date: "2026-03-13", completed: true },
  { round: 3, name: "Japanese Grand Prix", nameZh: "日本大奖赛", circuit: "Suzuka", date: "2026-03-29", completed: false },
  { round: 4, name: "Emilia Romagna Grand Prix", nameZh: "艾米利亚-罗马涅大奖赛", circuit: "Imola", date: "2026-04-12", completed: false },
  { round: 5, name: "Miami Grand Prix", nameZh: "迈阿密大奖赛", circuit: "Miami", date: "2026-05-03", sprint: true, completed: false },
  { round: 6, name: "Spanish Grand Prix", nameZh: "西班牙大奖赛", circuit: "Barcelona", date: "2026-05-17", completed: false },
  { round: 7, name: "Monaco Grand Prix", nameZh: "摩纳哥大奖赛", circuit: "Monte Carlo", date: "2026-05-24", completed: false },
  { round: 8, name: "Canadian Grand Prix", nameZh: "加拿大大奖赛", circuit: "Montreal", date: "2026-06-07", completed: false },
  { round: 9, name: "Austrian Grand Prix", nameZh: "奥地利大奖赛", circuit: "Spielberg", date: "2026-06-21", sprint: true, completed: false },
  { round: 10, name: "British Grand Prix", nameZh: "英国大奖赛", circuit: "Silverstone", date: "2026-07-05", completed: false },
];

export default function RacesPage() {
  const t = useTranslations("nav");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("races")} — 2026</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RACES_2026.map((race) => (
          <Card
            key={race.round}
            className={race.completed ? "opacity-60" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Round {race.round}
                </span>
                <div className="flex gap-1">
                  {race.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Completed
                    </Badge>
                  )}
                  {race.sprint && (
                    <Badge variant="outline" className="text-xs text-red-500 border-red-500/30">
                      Sprint
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{race.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{race.circuit}</p>
              <p className="text-sm text-muted-foreground">{race.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
