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
  British: "\u{1F1EC}\u{1F1E7}", Italian: "\u{1F1EE}\u{1F1F9}", "Mon\u00E9gasque": "\u{1F1F2}\u{1F1E8}", Dutch: "\u{1F1F3}\u{1F1F1}",
  Spanish: "\u{1F1EA}\u{1F1F8}", Finnish: "\u{1F1EB}\u{1F1EE}", German: "\u{1F1E9}\u{1F1EA}", French: "\u{1F1EB}\u{1F1F7}",
  Australian: "\u{1F1E6}\u{1F1FA}", Mexican: "\u{1F1F2}\u{1F1FD}", Canadian: "\u{1F1E8}\u{1F1E6}", Thai: "\u{1F1F9}\u{1F1ED}",
  "New Zealander": "\u{1F1F3}\u{1F1FF}", Brazilian: "\u{1F1E7}\u{1F1F7}", Argentine: "\u{1F1E6}\u{1F1F7}",
  Argentinian: "\u{1F1E6}\u{1F1F7}", Swedish: "\u{1F1F8}\u{1F1EA}",
};

function formatSalary(m: number): string {
  if (m >= 1) return `$${m}M`;
  return `$${(m * 1000).toFixed(0)}K`;
}

/** Position-based color coding for the P-badge */
function getPosStyle(pos: number): { text: string; border: string; bg: string } {
  if (pos === 1) return { text: "text-yellow-400", border: "border-yellow-400/50", bg: "bg-yellow-400/10" };
  if (pos === 2) return { text: "text-zinc-300", border: "border-zinc-300/50", bg: "bg-zinc-300/10" };
  if (pos === 3) return { text: "text-amber-600", border: "border-amber-600/50", bg: "bg-amber-600/10" };
  if (pos <= 10) return { text: "text-emerald-400", border: "border-emerald-400/50", bg: "bg-emerald-400/10" };
  return { text: "text-zinc-500", border: "border-zinc-700", bg: "bg-zinc-800/50" };
}

export default async function DriversPage() {
  const drivers = await getDriversList();
  return <DriversPageContent drivers={drivers} />;
}

function DriversPageContent({ drivers }: { drivers: DriverListItem[] }) {
  const t = useTranslations("driver");

  // Group drivers by team
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

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <span className="f1-label !text-[#E10600]">2026 Grid</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
          <p className="f1-label mt-1">11 teams &middot; 22 drivers</p>
        </div>

        {/* ── Team Blocks ─────────────────────────────────────────── */}
        {teamGroups.map((group) => {
          const teamPts = group.drivers.reduce((s, d) => s + d.pts, 0);
          const chassisShort = group.chassis.split(" ").slice(-1)[0];

          return (
            <div key={group.team} className="mb-12">
              {/* ── Team Header ──────────────────────────────────── */}
              <div
                className="flex items-center justify-between mb-6 pb-3"
                style={{ borderBottom: `2px solid ${group.color}` }}
              >
                <div className="flex items-center gap-3">
                  <h2 className="f1-display-md text-white tracking-tight">{group.team}</h2>
                  <span className="f1-data text-sm bg-zinc-800 text-zinc-300 rounded-md px-2 py-1">
                    {chassisShort}
                  </span>
                </div>
                <span className="f1-data-lg text-emerald-400">{teamPts} <span className="f1-label-xs">PTS</span></span>
              </div>

              {/* ── Driver Cards Grid ────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.drivers.map((d) => {
                  const p = d.profile;
                  const age = p ? getDriverAge(p.dateOfBirth) : 0;
                  const flag = p ? (NATIONALITY_FLAGS[p.nationality] ?? "\u{1F3F3}\u{FE0F}") : "";
                  const posStyle = getPosStyle(d.pos);
                  const nameParts = d.name.split(" ");
                  const firstName = nameParts.slice(0, -1).join(" ");
                  const lastName = nameParts[nameParts.length - 1];

                  return (
                    <Link
                      key={d.id}
                      href={`/drivers/${d.id}` as "/"}
                      className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 transition-all hover:border-zinc-600 group block"
                    >
                      {/* ── Watermark Race Number ─────────────── */}
                      <span
                        className="absolute right-[-5%] bottom-[-10%] text-[12rem] font-black italic text-zinc-800/20 z-0 pointer-events-none select-none"
                        style={{ fontFamily: "var(--font-oswald), system-ui", lineHeight: 1 }}
                        aria-hidden="true"
                      >
                        {d.number}
                      </span>

                      {/* ── Position Badge (top-right) ────────── */}
                      <span className={`f1-data-lg absolute top-6 right-6 bg-zinc-950 border rounded-lg px-3 py-1 z-10 ${posStyle.text} ${posStyle.border}`}>
                        P{d.pos}
                      </span>

                      {/* ── Card Content (above watermark) ────── */}
                      <div className="relative z-10">
                        {/* Header: Name + Flag */}
                        <div className="mb-4 pr-16">
                          <p className="f1-body text-zinc-400">
                            {flag} {firstName}
                          </p>
                          <h3 className="f1-display-lg text-white leading-tight mt-0.5">
                            {lastName}
                          </h3>
                          <span className="f1-data text-xs mt-1 inline-block" style={{ color: d.color }}>
                            #{d.number}
                          </span>
                        </div>

                        {/* Bio + Financial Row */}
                        {p && (
                          <div className="flex items-center gap-3 flex-wrap mb-4">
                            <span className="f1-data text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-full px-3 py-1">
                              {formatSalary(p.salaryMillionsUSD)}
                            </span>
                            <div className="flex items-center gap-3">
                              <div>
                                <span className="f1-label-xs text-zinc-500 block">AGE</span>
                                <span className="f1-data text-zinc-300">{age}</span>
                              </div>
                              <div>
                                <span className="f1-label-xs text-zinc-500 block">HT</span>
                                <span className="f1-data text-zinc-300">{p.heightCm}cm</span>
                              </div>
                              <div>
                                <span className="f1-label-xs text-zinc-500 block">WT</span>
                                <span className="f1-data text-zinc-300">{p.weightKg}kg</span>
                              </div>
                            </div>
                            {p.championships > 0 && (
                              <span className="f1-label-xs rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-2 py-0.5">
                                {p.championships}x WDC
                              </span>
                            )}
                          </div>
                        )}

                        {/* ── Season Performance Grid ─────────── */}
                        {p && (
                          <div className="bg-zinc-950/60 rounded-lg p-3 border border-zinc-800/40 mb-3 grid grid-cols-4 gap-3">
                            <div>
                              <span className="f1-label-xs text-zinc-500 block">AVG GRID</span>
                              <span className="f1-data text-zinc-300">P{p.avgGrid.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="f1-label-xs text-zinc-500 block">AVG FIN</span>
                              <span className="f1-data text-zinc-300">P{p.avgFinish.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="f1-label-xs text-zinc-500 block">BEST</span>
                              <span className="f1-data text-zinc-300">P{p.bestFinish}</span>
                            </div>
                            <div>
                              <span className="f1-label-xs text-zinc-500 block">H2H</span>
                              <span className={`f1-data ${p.h2hRace > p.racesCompleted / 2 ? "text-emerald-400" : p.h2hRace < p.racesCompleted / 2 ? "text-rose-500" : "text-zinc-300"}`}>
                                {p.h2hRace}-{p.racesCompleted - p.h2hRace}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* ── Primary Stats Micro-Grid ────────── */}
                        <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/60 grid grid-cols-4 gap-4 divide-x divide-zinc-800/50">
                          {[
                            { label: "PTS", value: d.pts },
                            { label: "WIN", value: d.wins },
                            { label: "POD", value: d.podiums },
                            { label: "DNF", value: p?.dnfs ?? 0 },
                          ].map((s) => (
                            <div key={s.label} className="text-center">
                              <span className="f1-label-xs text-zinc-500 text-center block">{s.label}</span>
                              <span className={`f1-data-xl text-center block mt-1 ${s.label === "DNF" && s.value > 0 ? "text-rose-500" : "text-white"}`}>{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* ── Career Stats (compact) ──────────── */}
                        {p && (p.careerWins > 0 || p.careerPodiums > 0) && (
                          <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <span className="f1-label-xs text-zinc-600">CAREER:</span>
                            {p.careerWins > 0 && <span className="f1-data text-[0.625rem] text-zinc-500">{p.careerWins} wins</span>}
                            {p.careerPoles > 0 && <span className="f1-data text-[0.625rem] text-zinc-500">{p.careerPoles} poles</span>}
                            {p.careerPodiums > 0 && <span className="f1-data text-[0.625rem] text-zinc-500">{p.careerPodiums} podiums</span>}
                          </div>
                        )}
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
  );
}

function getProfile(id: string) {
  return DRIVER_PROFILE_MAP[id] ?? null;
}
