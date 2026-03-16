import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const TEAMS = [
  { id: "mercedes", name: "Mercedes-AMG Petronas", drivers: ["Russell", "Antonelli"], pts: 88, wins: 2, podiums: 4, pos: 1, color: "#27F4D2" },
  { id: "ferrari", name: "Scuderia Ferrari", drivers: ["Leclerc", "Hamilton"], pts: 53, wins: 0, podiums: 3, pos: 2, color: "#E80020" },
  { id: "mclaren", name: "McLaren F1 Team", drivers: ["Norris", "Piastri"], pts: 48, wins: 0, podiums: 1, pos: 3, color: "#FF8000" },
  { id: "redbull", name: "Oracle Red Bull Racing", drivers: ["Verstappen", "Tsunoda"], pts: 33, wins: 0, podiums: 1, pos: 4, color: "#3671C6" },
  { id: "aston_martin", name: "Aston Martin Aramco", drivers: ["Alonso", "Stroll"], pts: 14, wins: 0, podiums: 0, pos: 5, color: "#229971" },
  { id: "audi", name: "Audi F1 Team", drivers: ["Hülkenberg", "Bortoleto"], pts: 14, wins: 0, podiums: 0, pos: 6, color: "#00594F" },
  { id: "alpine", name: "Alpine F1 Team", drivers: ["Gasly", "Doohan"], pts: 8, wins: 0, podiums: 0, pos: 7, color: "#0093CC" },
  { id: "haas", name: "MoneyGram Haas F1", drivers: ["Ocon", "Bearman"], pts: 5, wins: 0, podiums: 0, pos: 8, color: "#B6BABD" },
  { id: "williams", name: "Williams Racing", drivers: ["Sainz", "Albon"], pts: 4, wins: 0, podiums: 0, pos: 9, color: "#1868DB" },
  { id: "cadillac", name: "Cadillac F1 Team", drivers: ["TBD", "TBD"], pts: 0, wins: 0, podiums: 0, pos: 10, color: "#C0C0C0" },
];

const maxPts = 88;

export default function TeamsPage() {
  const t = useTranslations("team");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Constructors</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("constructorChampionship")}</h1>
        </div>

        <div className="space-y-1.5">
          {TEAMS.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}` as "/"} className="f1-hover flex items-center gap-3 rounded border border-[#1c1c1c] bg-[#0f0f0f] p-3.5 sm:gap-4 sm:p-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                team.pos <= 3 ? "bg-[#E10600]" : "bg-[#131313]"
              }`}>
                <span className={`f1-data text-sm ${team.pos <= 3 ? "text-white" : "text-[#444]"}`}>
                  {team.pos}
                </span>
              </div>

              <div className="f1-team-bar h-10" style={{ backgroundColor: team.color }} />

              <div className="flex-1 min-w-0">
                <p className="f1-display-md text-white truncate">{team.name}</p>
                <p className="f1-label-xs mt-0.5" style={{ color: "#444" }}>{team.drivers.join("  /  ")}</p>
                <div className="mt-2 h-[2px] w-full rounded-full bg-[#161616]">
                  <div
                    className="h-[2px] rounded-full f1-transition"
                    style={{ width: maxPts > 0 ? `${(team.pts / maxPts) * 100}%` : "0%", backgroundColor: team.color }}
                  />
                </div>
              </div>

              <div className="hidden gap-2 sm:flex">
                {[
                  { label: "WIN", value: team.wins },
                  { label: "POD", value: team.podiums },
                ].map((s) => (
                  <div key={s.label} className="f1-surface-inner w-11 p-1.5 text-center">
                    <p className="f1-label-xs">{s.label}</p>
                    <p className="f1-data text-sm text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="shrink-0 text-right">
                <span className="f1-data text-2xl font-bold" style={{ color: team.color }}>{team.pts}</span>
                <p className="f1-label-xs mt-0.5">PTS</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
