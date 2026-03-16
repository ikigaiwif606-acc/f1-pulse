import { useTranslations } from "next-intl";

const RACES_2026 = [
  { round: 1, name: "Australian Grand Prix", circuit: "Melbourne", date: "MAR 06", winner: "Russell", winnerCode: "RUS", winnerColor: "#27F4D2", completed: true },
  { round: 2, name: "Chinese Grand Prix", circuit: "Shanghai", date: "MAR 13", winner: "Antonelli", winnerCode: "ANT", winnerColor: "#27F4D2", completed: true },
  { round: 3, name: "Japanese Grand Prix", circuit: "Suzuka", date: "MAR 29", next: true, completed: false },
  { round: 4, name: "Emilia Romagna Grand Prix", circuit: "Imola", date: "APR 12", completed: false },
  { round: 5, name: "Miami Grand Prix", circuit: "Miami", date: "MAY 03", sprint: true, completed: false },
  { round: 6, name: "Spanish Grand Prix", circuit: "Barcelona", date: "MAY 17", completed: false },
  { round: 7, name: "Monaco Grand Prix", circuit: "Monte Carlo", date: "MAY 24", completed: false },
  { round: 8, name: "Canadian Grand Prix", circuit: "Montreal", date: "JUN 07", completed: false },
  { round: 9, name: "Austrian Grand Prix", circuit: "Spielberg", date: "JUN 21", sprint: true, completed: false },
  { round: 10, name: "British Grand Prix", circuit: "Silverstone", date: "JUL 05", completed: false },
  { round: 11, name: "Belgian Grand Prix", circuit: "Spa-Francorchamps", date: "JUL 19", completed: false },
  { round: 12, name: "Hungarian Grand Prix", circuit: "Budapest", date: "AUG 02", completed: false },
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
  const tNav = useTranslations("nav");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
              Calendar
            </span>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
              {tNav("races")} 2026
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
            <span>22 Rounds</span>
            <span className="text-[#2a2a2a]">&middot;</span>
            <span>2 Completed</span>
          </div>
        </div>

        {/* Race list */}
        <div className="space-y-1">
          {RACES_2026.map((race) => (
            <div
              key={race.round}
              className={`group flex items-center gap-3 rounded-md border p-3 transition-all sm:gap-4 sm:p-4 ${
                race.next
                  ? "border-[#E10600]/30 bg-[#E10600]/5"
                  : race.completed
                    ? "border-transparent bg-[#111]/50 opacity-50 hover:opacity-80"
                    : "border-transparent bg-[#111]/50 hover:border-[#1f1f1f] hover:bg-[#111]"
              }`}
            >
              {/* Round number */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded ${
                race.next
                  ? "bg-[#E10600]"
                  : "bg-[#1a1a1a]"
              }`}>
                <span className={`timing-number text-sm font-bold ${
                  race.next ? "text-white" : "text-[#4a4a4a]"
                }`}>
                  {String(race.round).padStart(2, "0")}
                </span>
              </div>

              {/* Flag */}
              <span className="hidden text-xl sm:block">{getFlag(race.name)}</span>

              {/* Race info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-sm font-bold uppercase tracking-wide truncate sm:text-base ${
                    race.next ? "text-white" : "text-[#b0b0b0]"
                  }`}>
                    {race.name}
                  </span>
                  {race.sprint && (
                    <span className="shrink-0 rounded border border-[#E10600]/20 bg-[#E10600]/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#E10600]">
                      Sprint
                    </span>
                  )}
                  {race.next && (
                    <span className="shrink-0 flex items-center gap-1 rounded bg-[#E10600] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white">
                      <span className="h-1 w-1 rounded-full bg-white animate-live" />
                      Next
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#4a4a4a]">{race.circuit}</p>
              </div>

              {/* Date */}
              <div className="shrink-0 text-right">
                <p className="timing-number text-xs font-bold text-[#737373]">{race.date}</p>
                {race.completed && race.winner && (
                  <div className="mt-0.5 flex items-center justify-end gap-1">
                    <div className="h-2 w-0.5 rounded-full" style={{ backgroundColor: race.winnerColor }} />
                    <span className="timing-number text-[10px] font-bold" style={{ color: race.winnerColor }}>
                      {race.winnerCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
