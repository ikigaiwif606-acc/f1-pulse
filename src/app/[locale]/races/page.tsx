import { useTranslations } from "next-intl";

const RACES_2026 = [
  { round: 1, name: "Australian Grand Prix", circuit: "Melbourne", date: "MAR 06", winner: "Russell", code: "RUS", color: "#27F4D2", completed: true },
  { round: 2, name: "Chinese Grand Prix", circuit: "Shanghai", date: "MAR 13", winner: "Antonelli", code: "ANT", color: "#27F4D2", completed: true },
  { round: 3, name: "Japanese Grand Prix", circuit: "Suzuka", date: "MAR 29", next: true, completed: false },
  { round: 4, name: "Emilia Romagna Grand Prix", circuit: "Imola", date: "APR 12", completed: false },
  { round: 5, name: "Miami Grand Prix", circuit: "Miami", date: "MAY 03", sprint: true, completed: false },
  { round: 6, name: "Spanish Grand Prix", circuit: "Barcelona", date: "MAY 17", completed: false },
  { round: 7, name: "Monaco Grand Prix", circuit: "Monte Carlo", date: "MAY 24", completed: false },
  { round: 8, name: "Canadian Grand Prix", circuit: "Montreal", date: "JUN 07", completed: false },
  { round: 9, name: "Austrian Grand Prix", circuit: "Spielberg", date: "JUN 21", sprint: true, completed: false },
  { round: 10, name: "British Grand Prix", circuit: "Silverstone", date: "JUL 05", completed: false },
  { round: 11, name: "Belgian Grand Prix", circuit: "Spa", date: "JUL 19", completed: false },
  { round: 12, name: "Hungarian Grand Prix", circuit: "Budapest", date: "AUG 02", completed: false },
];

const FLAGS: Record<string, string> = {
  Australian: "🇦🇺", Chinese: "🇨🇳", Japanese: "🇯🇵", "Emilia Romagna": "🇮🇹",
  Miami: "🇺🇸", Spanish: "🇪🇸", Monaco: "🇲🇨", Canadian: "🇨🇦",
  Austrian: "🇦🇹", British: "🇬🇧", Belgian: "🇧🇪", Hungarian: "🇭🇺",
};
function flag(n: string) { for (const [k, f] of Object.entries(FLAGS)) if (n.includes(k)) return f; return "🏁"; }

export default function RacesPage() {
  const tNav = useTranslations("nav");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="f1-label !text-[#E10600]">Calendar</span>
            <h1 className="f1-display-lg text-white mt-0.5">{tNav("races")} 2026</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="f1-label">22 Rounds</span>
            <span style={{ color: "#1c1c1c" }}>&middot;</span>
            <span className="f1-label">2 Completed</span>
          </div>
        </div>

        <div className="space-y-1">
          {RACES_2026.map((race) => (
            <div
              key={race.round}
              className={`f1-transition group flex items-center gap-3 rounded border p-3 sm:gap-4 sm:p-4 ${
                race.next
                  ? "border-[#E10600]/20 bg-[#E10600]/[0.03]"
                  : race.completed
                    ? "border-transparent bg-[#0f0f0f]/50 opacity-40 hover:opacity-70"
                    : "border-transparent bg-[#0f0f0f]/50 hover:border-[#1c1c1c] hover:bg-[#0f0f0f]"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded ${
                race.next ? "bg-[#E10600]" : "bg-[#131313]"
              }`}>
                <span className={`f1-data text-sm ${race.next ? "text-white" : "text-[#444]"}`}>
                  {String(race.round).padStart(2, "0")}
                </span>
              </div>

              <span className="hidden text-xl sm:block">{flag(race.name)}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`f1-display-md truncate ${race.next ? "text-white" : "text-[#999]"}`}>
                    {race.name}
                  </span>
                  {race.sprint && (
                    <span className="f1-label shrink-0 rounded border border-[#E10600]/20 bg-[#E10600]/10 px-1.5 py-0.5 !text-[#E10600]">
                      Sprint
                    </span>
                  )}
                  {race.next && (
                    <span className="f1-label shrink-0 flex items-center gap-1 rounded bg-[#E10600] px-1.5 py-0.5 !text-white">
                      <span className="h-1 w-1 rounded-full bg-white animate-live" />
                      Next
                    </span>
                  )}
                </div>
                <p className="f1-body-sm mt-0.5" style={{ color: "#444" }}>{race.circuit}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="f1-data text-xs text-[#666]">{race.date}</p>
                {race.completed && race.code && (
                  <div className="mt-0.5 flex items-center justify-end gap-1">
                    <div className="f1-team-bar h-2.5" style={{ backgroundColor: race.color }} />
                    <span className="f1-data text-[0.625rem] font-bold" style={{ color: race.color }}>{race.code}</span>
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
