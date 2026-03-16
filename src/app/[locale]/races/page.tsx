import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getRacesList } from "@/lib/data/races";
import type { RaceListItem } from "@/types";

const FLAGS: Record<string, string> = {
  Australian: "\u{1F1E6}\u{1F1FA}", Chinese: "\u{1F1E8}\u{1F1F3}", Japanese: "\u{1F1EF}\u{1F1F5}", "Emilia Romagna": "\u{1F1EE}\u{1F1F9}",
  Miami: "\u{1F1FA}\u{1F1F8}", Spanish: "\u{1F1EA}\u{1F1F8}", Monaco: "\u{1F1F2}\u{1F1E8}", Canadian: "\u{1F1E8}\u{1F1E6}",
  Austrian: "\u{1F1E6}\u{1F1F9}", British: "\u{1F1EC}\u{1F1E7}", Belgian: "\u{1F1E7}\u{1F1EA}", Hungarian: "\u{1F1ED}\u{1F1FA}",
  Bahrain: "\u{1F1E7}\u{1F1ED}", Saudi: "\u{1F1F8}\u{1F1E6}", Azerbaijan: "\u{1F1E6}\u{1F1FF}", Singapore: "\u{1F1F8}\u{1F1EC}",
  Dutch: "\u{1F1F3}\u{1F1F1}", Italian: "\u{1F1EE}\u{1F1F9}", Mexico: "\u{1F1F2}\u{1F1FD}", Brazilian: "\u{1F1E7}\u{1F1F7}",
  Qatar: "\u{1F1F6}\u{1F1E6}", "Abu Dhabi": "\u{1F1E6}\u{1F1EA}", "Las Vegas": "\u{1F1FA}\u{1F1F8}",
};
function flag(n: string) { for (const [k, f] of Object.entries(FLAGS)) if (n.includes(k)) return f; return "\u{1F3C1}"; }

export default async function RacesPage() {
  const races = await getRacesList();
  return <RacesPageContent races={races} />;
}

function RacesPageContent({ races }: { races: RaceListItem[] }) {
  const tNav = useTranslations("nav");
  const completedCount = races.filter((r) => r.completed).length;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="f1-label !text-[#E10600]">Calendar</span>
            <h1 className="f1-display-lg text-white mt-0.5">{tNav("races")} 2026</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="f1-label">{races.length} Rounds</span>
            <span style={{ color: "#1c1c1c" }}>&middot;</span>
            <span className="f1-label">{completedCount} Completed</span>
          </div>
        </div>

        <div className="space-y-1">
          {races.map((race) => (
            <Link
              key={race.round}
              href={`/races/${race.slug}` as "/"}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
