import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getDriversList } from "@/lib/data/drivers";
import { DRIVER_PROFILE_MAP, getDriverAge } from "@/lib/data/driver-profiles";
import type { DriverListItem } from "@/types";

// ── Team ordering (by constructor standings) ─────────────────────
const TEAM_ORDER = [
  "Mercedes",
  "Ferrari",
  "McLaren",
  "Haas F1 Team",
  "Red Bull",
  "Racing Bulls",
  "Alpine F1 Team",
  "Williams",
  "Audi",
  "Cadillac F1 Team",
  "Aston Martin",
];

const NATIONALITY_FLAGS: Record<string, string> = {
  British: "🇬🇧", Italian: "🇮🇹", Monégasque: "🇲🇨", Dutch: "🇳🇱",
  Spanish: "🇪🇸", Finnish: "🇫🇮", German: "🇩🇪", French: "🇫🇷",
  Australian: "🇦🇺", Mexican: "🇲🇽", Canadian: "🇨🇦", Thai: "🇹🇭",
  "New Zealander": "🇳🇿", Brazilian: "🇧🇷", Argentine: "🇦🇷",
  Argentinian: "🇦🇷", Swedish: "🇸🇪",
};

function formatSalary(m: number): string {
  if (m >= 1) return `$${m}M`;
  return `$${(m * 1000).toFixed(0)}K`;
}

export default async function DriversPage() {
  const drivers = await getDriversList();
  return <DriversPageContent drivers={drivers} />;
}

function DriversPageContent({ drivers }: { drivers: DriverListItem[] }) {
  const t = useTranslations("driver");

  // Group drivers by team in TEAM_ORDER
  const teamGroups: { team: string; color: string; chassis: string; drivers: (DriverListItem & { profile: NonNullable<ReturnType<typeof getProfile>> })[] }[] = [];

  for (const teamName of TEAM_ORDER) {
    const teamDrivers = drivers.filter((d) => d.team === teamName);
    if (teamDrivers.length === 0) continue;

    const enriched = teamDrivers.map((d) => ({
      ...d,
      profile: getProfile(d.id),
    }));

    teamGroups.push({
      team: teamName,
      color: teamDrivers[0].color,
      chassis: enriched[0].profile?.chassis ?? "",
      drivers: enriched,
    });
  }

  const totalTeamPts = teamGroups.map((g) => g.drivers.reduce((s, d) => s + d.pts, 0));
  const maxTeamPts = Math.max(...totalTeamPts, 1);

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">2026 Grid</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
          <p className="f1-label mt-1">11 teams &middot; 22 drivers</p>
        </div>

        <div className="space-y-3">
          {teamGroups.map((group, gi) => {
            const teamPts = group.drivers.reduce((s, d) => s + d.pts, 0);

            return (
              <div key={group.team} className="rounded border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
                {/* Team header */}
                <div className="relative">
                  <div className="h-px w-full" style={{ backgroundColor: group.color }} />
                  <div className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="f1-team-bar h-6" style={{ backgroundColor: group.color }} />
                      <div>
                        <h2 className="f1-display-md text-white">{group.team}</h2>
                        <span className="f1-label-xs" style={{ color: "#444" }}>{group.chassis}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block w-24">
                        <div className="h-[3px] w-full rounded-full bg-[#161616]">
                          <div className="h-[3px] rounded-full" style={{ width: `${(teamPts / maxTeamPts) * 100}%`, backgroundColor: group.color }} />
                        </div>
                      </div>
                      <span className="f1-data text-sm text-white">{teamPts} <span className="f1-label-xs">pts</span></span>
                    </div>
                  </div>
                </div>

                {/* Drivers */}
                <div className="grid gap-px bg-[#1c1c1c] sm:grid-cols-2">
                  {group.drivers.map((d) => {
                    const p = d.profile;
                    const age = p ? getDriverAge(p.dateOfBirth) : 0;
                    const flag = p ? (NATIONALITY_FLAGS[p.nationality] ?? "🏳️") : "";

                    return (
                      <Link
                        key={d.id}
                        href={`/drivers/${d.id}` as "/"}
                        className="f1-hover group relative bg-[#0a0a0a] p-4 sm:p-5"
                      >
                        {/* Watermark number */}
                        <div className="absolute right-3 top-1 select-none pointer-events-none">
                          <span className="f1-display" style={{ fontSize: "4.5rem", color: d.color, opacity: 0.04, lineHeight: 1 }}>
                            {d.number}
                          </span>
                        </div>

                        <div className="relative">
                          {/* Name + position */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`f1-label rounded px-1.5 py-0.5 ${d.pos <= 3 ? "bg-[#E10600] !text-white" : "bg-[#131313] !text-[#444]"}`}>
                                  P{d.pos}
                                </span>
                                <span className="f1-data text-sm font-bold" style={{ color: d.color }}>#{d.number}</span>
                              </div>
                              <p className="f1-display-md text-white">{d.name}</p>
                            </div>
                          </div>

                          {/* Bio details grid */}
                          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 mb-3">
                            {p && (
                              <>
                                <div>
                                  <span className="f1-label-xs block">Nation</span>
                                  <span className="f1-data text-xs text-white">{flag} {p.nationality}</span>
                                </div>
                                <div>
                                  <span className="f1-label-xs block">Age</span>
                                  <span className="f1-data text-xs text-white">{age}</span>
                                </div>
                                <div>
                                  <span className="f1-label-xs block">Salary</span>
                                  <span className="f1-data text-xs text-[#22c55e]">{formatSalary(p.salaryMillionsUSD)}</span>
                                </div>
                                <div>
                                  <span className="f1-label-xs block">Height</span>
                                  <span className="f1-data text-xs text-white">{p.heightCm} cm</span>
                                </div>
                                <div>
                                  <span className="f1-label-xs block">Weight</span>
                                  <span className="f1-data text-xs text-white">{p.weightKg} kg</span>
                                </div>
                                <div>
                                  <span className="f1-label-xs block">Car</span>
                                  <span className="f1-data text-xs text-white">{p.chassis.split(" ").slice(-1)[0]}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Stats row */}
                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { label: "PTS", value: d.pts, highlight: true },
                              { label: "WIN", value: d.wins },
                              { label: "POD", value: d.podiums },
                              { label: "POL", value: d.poles },
                            ].map((s) => (
                              <div key={s.label} className="f1-surface-inner p-1.5 text-center">
                                <p className="f1-label-xs">{s.label}</p>
                                <p className={`f1-data text-sm ${s.highlight ? "text-[#E10600]" : "text-white"}`}>{s.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getProfile(id: string) {
  return DRIVER_PROFILE_MAP[id] ?? null;
}
