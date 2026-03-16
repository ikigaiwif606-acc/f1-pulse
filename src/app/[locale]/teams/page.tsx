import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getTeamsList } from "@/lib/data/teams";
import type { TeamListItem } from "@/types";

export default async function TeamsPage() {
  const teams = await getTeamsList();
  return <TeamsPageContent teams={teams} />;
}

function TeamsPageContent({ teams }: { teams: TeamListItem[] }) {
  const t = useTranslations("team");
  const maxPts = teams[0]?.pts || 1;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Constructors</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("constructorChampionship")}</h1>
        </div>

        <div className="space-y-1.5">
          {teams.map((team) => (
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
