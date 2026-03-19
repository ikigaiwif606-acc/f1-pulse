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

/** Position-based color coding */
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
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <span className="f1-label !text-[#E10600]">2026 Grid</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
          <p className="f1-label mt-1">11 teams &middot; 22 drivers</p>
        </div>

        {/* Team blocks */}
        <div className="space-y-8">
          {teamGroups.map((group) => {
            const teamPts = group.drivers.reduce((s, d) => s + d.pts, 0);
            const chassisShort = group.chassis.split(" ").slice(-1)[0];

            return (
              <div key={group.team}>
                {/* ── Task 2: Team Header ─────────────────────────── */}
                <div
                  className="flex items-center justify-between rounded-t-2xl px-5 py-4 border border-b-0"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    borderLeftColor: group.color,
                    borderLeftWidth: "3px",
                    background: `linear-gradient(135deg, rgba(15,15,15,0.8), rgba(15,15,15,0.4))`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{group.team}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[0.625rem] tabular-nums uppercase tracking-widest rounded bg-[rgba(255,255,255,0.05)] px-2 py-0.5" style={{ color: "var(--text-dim)" }}>
                          {chassisShort}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block w-28">
                      <div className="h-1.5 w-full rounded-full bg-[#161616] overflow-hidden">
                        <div className="h-full rounded-full f1-transition" style={{ width: `${(teamPts / maxTeamPts) * 100}%`, backgroundColor: group.color }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-lg tabular-nums font-bold text-white">{teamPts}</span>
                      <span className="f1-label-xs ml-1">PTS</span>
                    </div>
                  </div>
                </div>

                {/* ── Task 1 & 3: Driver Trading Cards Grid ───────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-b-2xl overflow-hidden border border-t-0" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
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
                        className="group relative block overflow-hidden p-5 sm:p-6 f1-transition hover:bg-[rgba(20,20,20,0.6)]"
                        style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(8px)" }}
                      >
                        {/* ── Watermark Race Number ───────────────── */}
                        <div className="absolute -right-4 -top-4 select-none pointer-events-none" aria-hidden="true">
                          <span
                            className="font-black italic leading-none"
                            style={{
                              fontFamily: "var(--font-oswald), system-ui",
                              fontSize: "9rem",
                              color: d.color,
                              opacity: 0.04,
                            }}
                          >
                            {d.number}
                          </span>
                        </div>

                        {/* ── Team color glow (left edge) ─────────── */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[2px]"
                          style={{ backgroundColor: d.color, boxShadow: `0 0 12px ${d.color}40` }}
                        />

                        <div className="relative">
                          {/* ── Header: Name + Position Badge ─────── */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-[var(--text-dim)] mb-0.5">
                                {flag} {firstName}
                              </p>
                              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                                {lastName}
                              </h3>
                              <span className="font-mono text-xs tabular-nums font-bold mt-1 inline-block" style={{ color: d.color }}>
                                #{d.number}
                              </span>
                            </div>

                            {/* Position badge pill */}
                            <span className={`font-mono text-sm tabular-nums font-bold rounded-full px-3 py-1 border ${posStyle.text} ${posStyle.border} ${posStyle.bg}`}>
                              P{d.pos}
                            </span>
                          </div>

                          {/* ── Financial / Bio Row ───────────────── */}
                          {p && (
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                              {/* Salary pill */}
                              <span className="value-pill">
                                {formatSalary(p.salaryMillionsUSD)}
                              </span>
                              {/* Bio details */}
                              <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                                Age {age}
                              </span>
                              <span className="text-[rgba(255,255,255,0.1)]">&middot;</span>
                              <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                                {p.heightCm}cm
                              </span>
                              <span className="text-[rgba(255,255,255,0.1)]">&middot;</span>
                              <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                                {p.weightKg}kg
                              </span>
                            </div>
                          )}

                          {/* ── Task 4: Performance Micro-Dashboard ── */}
                          <div className="rounded-xl border p-3 mt-4 grid grid-cols-4 gap-2" style={{ background: "rgba(5,5,5,0.8)", borderColor: "rgba(255,255,255,0.04)" }}>
                            {[
                              { label: "PTS", value: d.pts, color: "#E10600" },
                              { label: "WIN", value: d.wins, color: null },
                              { label: "POD", value: d.podiums, color: null },
                              { label: "POL", value: d.poles, color: null },
                            ].map((s) => (
                              <div key={s.label} className="text-center">
                                <p className="text-[0.625rem] uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--text-ghost)" }}>
                                  {s.label}
                                </p>
                                <p className={`font-mono text-xl tabular-nums font-bold ${s.color ? "" : "text-white"}`} style={s.color ? { color: s.color } : undefined}>
                                  {s.value}
                                </p>
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
