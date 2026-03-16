import { useTranslations } from "next-intl";

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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
            Constructors
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {t("constructorChampionship")}
          </h1>
        </div>

        {/* Team list */}
        <div className="space-y-1.5">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              className="group flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#111] p-3 transition-all hover:border-[#2a2a2a] sm:gap-4 sm:p-4"
            >
              {/* Position */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                team.pos <= 3 ? "bg-[#E10600]" : "bg-[#1a1a1a]"
              }`}>
                <span className={`timing-number text-sm font-bold ${
                  team.pos <= 3 ? "text-white" : "text-[#4a4a4a]"
                }`}>
                  {team.pos}
                </span>
              </div>

              {/* Team color bar */}
              <div className="h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />

              {/* Team info */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white truncate sm:text-base">
                  {team.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[10px] text-[#4a4a4a]">{team.drivers.join(" / ")}</span>
                </div>
                {/* Points bar */}
                <div className="mt-2 h-[3px] w-full rounded-full bg-[#1a1a1a]">
                  <div
                    className="h-[3px] rounded-full transition-all duration-700"
                    style={{
                      width: maxPts > 0 ? `${(team.pts / maxPts) * 100}%` : "0%",
                      backgroundColor: team.color,
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="hidden gap-3 sm:flex">
                {[
                  { label: "WIN", value: team.wins },
                  { label: "POD", value: team.podiums },
                ].map((stat) => (
                  <div key={stat.label} className="w-10 rounded bg-[#0a0a0a] p-1.5 text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#3a3a3a]">{stat.label}</p>
                    <p className="timing-number text-sm font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Points */}
              <div className="shrink-0 text-right">
                <span className="timing-number text-2xl font-bold" style={{ color: team.color }}>
                  {team.pts}
                </span>
                <p className="text-[8px] font-bold uppercase tracking-widest text-[#3a3a3a]">PTS</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
