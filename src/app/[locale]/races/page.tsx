import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 2026 F1 Calendar — will be fetched from API
const RACES_2026 = [
  { round: 1, name: "Australian Grand Prix", nameZh: "澳大利亚大奖赛", circuit: "Melbourne Grand Prix Circuit", date: "2026-03-06", winner: "George Russell", winnerColor: "#27F4D2", completed: true },
  { round: 2, name: "Chinese Grand Prix", nameZh: "中国大奖赛", circuit: "Shanghai International Circuit", date: "2026-03-13", winner: "Kimi Antonelli", winnerColor: "#27F4D2", completed: true },
  { round: 3, name: "Japanese Grand Prix", nameZh: "日本大奖赛", circuit: "Suzuka International Racing Course", date: "2026-03-29", next: true, completed: false },
  { round: 4, name: "Emilia Romagna Grand Prix", nameZh: "艾米利亚-罗马涅大奖赛", circuit: "Autodromo Enzo e Dino Ferrari", date: "2026-04-12", completed: false },
  { round: 5, name: "Miami Grand Prix", nameZh: "迈阿密大奖赛", circuit: "Miami International Autodrome", date: "2026-05-03", sprint: true, completed: false },
  { round: 6, name: "Spanish Grand Prix", nameZh: "西班牙大奖赛", circuit: "Circuit de Barcelona-Catalunya", date: "2026-05-17", completed: false },
  { round: 7, name: "Monaco Grand Prix", nameZh: "摩纳哥大奖赛", circuit: "Circuit de Monaco", date: "2026-05-24", completed: false },
  { round: 8, name: "Canadian Grand Prix", nameZh: "加拿大大奖赛", circuit: "Circuit Gilles Villeneuve", date: "2026-06-07", completed: false },
  { round: 9, name: "Austrian Grand Prix", nameZh: "奥地利大奖赛", circuit: "Red Bull Ring", date: "2026-06-21", sprint: true, completed: false },
  { round: 10, name: "British Grand Prix", nameZh: "英国大奖赛", circuit: "Silverstone Circuit", date: "2026-07-05", completed: false },
  { round: 11, name: "Belgian Grand Prix", nameZh: "比利时大奖赛", circuit: "Circuit de Spa-Francorchamps", date: "2026-07-19", completed: false },
  { round: 12, name: "Hungarian Grand Prix", nameZh: "匈牙利大奖赛", circuit: "Hungaroring", date: "2026-08-02", completed: false },
];

const FLAG_MAP: Record<string, string> = {
  "Australian": "🇦🇺", "Chinese": "🇨🇳", "Japanese": "🇯🇵",
  "Emilia Romagna": "🇮🇹", "Miami": "🇺🇸", "Spanish": "🇪🇸",
  "Monaco": "🇲🇨", "Canadian": "🇨🇦", "Austrian": "🇦🇹",
  "British": "🇬🇧", "Belgian": "🇧🇪", "Hungarian": "🇭🇺",
};

function getFlag(name: string) {
  for (const [key, flag] of Object.entries(FLAG_MAP)) {
    if (name.includes(key)) return flag;
  }
  return "🏁";
}

export default function RacesPage() {
  const t = useTranslations("race");
  const tNav = useTranslations("nav");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{tNav("races")} 2026</h1>
        <p className="text-xs text-muted-foreground">22 Rounds</p>
      </div>

      <div className="space-y-2">
        {RACES_2026.map((race) => (
          <Card
            key={race.round}
            className={`transition-all ${
              race.next
                ? "border-red-500/30 ring-1 ring-red-500/20"
                : race.completed
                  ? "opacity-50"
                  : ""
            }`}
          >
            <CardContent className="flex items-center gap-4 p-3 sm:p-4">
              {/* Round badge */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                race.next
                  ? "bg-red-600 text-white"
                  : race.completed
                    ? "bg-accent text-muted-foreground"
                    : "bg-accent text-foreground"
              }`}>
                R{race.round}
              </div>

              {/* Flag */}
              <span className="hidden text-2xl sm:block">{getFlag(race.name)}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate sm:text-base">{race.name}</p>
                  {race.sprint && (
                    <Badge variant="outline" className="shrink-0 border-red-500/30 text-[10px] text-red-500">
                      Sprint
                    </Badge>
                  )}
                  {race.next && (
                    <Badge className="shrink-0 bg-red-600 text-[10px] text-white hover:bg-red-600">
                      NEXT
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{race.circuit}</p>
              </div>

              {/* Right side — date + winner */}
              <div className="shrink-0 text-right">
                <p className="text-sm tabular-nums">{race.date}</p>
                {race.completed && race.winner && (
                  <p className="text-xs">
                    Winner:{" "}
                    <span className="font-medium" style={{ color: race.winnerColor }}>
                      {race.winner}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
