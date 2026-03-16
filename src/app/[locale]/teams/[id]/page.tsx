import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getTeamDetailData } from "@/lib/data/team-detail";
import type { TeamData, Driver } from "@/lib/data/team-detail";

// ── Helpers ─────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function PosBadge({ pos }: { pos: number }) {
  return (
    <span className="f1-label rounded px-2 py-1 text-white" style={{ background: "#E10600", fontSize: "0.625rem" }}>
      P{pos}
    </span>
  );
}

function FinishCell({ pos }: { pos: number }) {
  if (pos === 0) return <span className="f1-data text-sm" style={{ color: "#444" }}>DNF</span>;
  const isPodium = pos <= 3;
  const isWin = pos === 1;
  return <span className="f1-data text-sm" style={{ color: isWin ? "#E10600" : isPodium ? "#27F4D2" : "#666" }}>P{pos}</span>;
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamDetailData(id);

  if (!team) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="f1-display-md text-white mb-3">Team not found</p>
          <Link href="/teams" className="f1-transition f1-label !text-[#E10600] hover:opacity-70">
            &larr; Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  return <TeamDetailContent team={team} />;
}

function TeamDetailContent({ team }: { team: TeamData }) {
  const t = useTranslations("team");
  const [d1, d2] = team.drivers;
  const maxPts = Math.max(d1.pts, d2.pts) || 1;
  const racesCompleted = team.raceResults.length;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── Back link ── */}
        <div className="mb-6">
          <Link href="/teams" className="f1-transition f1-label hover:!text-white inline-flex items-center gap-1.5">
            <span>&larr;</span>
            <span>Constructors&apos; Championship</span>
          </Link>
        </div>

        {/* ── Hero ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 hidden shrink-0 sm:block" style={{ width: "4px", height: "64px", borderRadius: "2px", background: team.color }} />
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <PosBadge pos={team.championship.pos} />
                <span className="f1-label" style={{ color: team.color }}>
                  {team.championship.pos === 1
                    ? "Constructors\u2019 Championship Leader"
                    : `${ordinal(team.championship.pos)} in Constructors\u2019 Championship`}
                </span>
              </div>
              <h1 className="f1-display-xl text-white">{team.name}</h1>
              <p className="f1-body-sm mt-1" style={{ color: "#555" }}>{team.fullName}</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="f1-label-xs">2026 Season</p>
            <p className="f1-data-lg mt-0.5" style={{ color: "#444" }}>
              R{racesCompleted}<span style={{ color: "#2a2a2a" }}>/</span>24
            </p>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="mb-6 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {[
            { label: "Points", value: team.championship.pts, accent: true },
            { label: "Wins", value: team.championship.wins, accent: false },
            { label: "Podiums", value: team.championship.podiums, accent: false },
            { label: "Poles", value: team.championship.poles, accent: false },
            { label: "DNFs", value: team.championship.dnfs, accent: false },
            { label: "Position", value: `P${team.championship.pos}`, accent: false },
          ].map((s) => (
            <div key={s.label} className="f1-surface p-3 text-center">
              <p className="f1-label-xs mb-1.5">{s.label}</p>
              <p className="f1-data-lg" style={{ color: s.accent ? team.color : "white" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Left column */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* Constructors odds */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Constructors&apos; Championship Odds</span>
              </div>
              <div className="flex items-center gap-4 f1-surface-inner p-4">
                <div className="flex-1">
                  <p className="f1-body-sm text-white font-semibold mb-1">{team.polymarket.question}</p>
                  <p className="f1-label">Vol {team.polymarket.volume} &middot; Ends Dec 6, 2026</p>
                </div>
                <div className="shrink-0 text-center">
                  <div className="rounded border px-4 py-2" style={{ borderColor: team.color + "40", background: team.color + "0d" }}>
                    <p className="f1-data-lg" style={{ color: team.color }}>
                      {(team.polymarket.probability * 100).toFixed(0)}
                      <span className="f1-label-xs ml-0.5" style={{ color: team.color, opacity: 0.7 }}>%</span>
                    </p>
                    <p className="f1-label-xs mt-0.5" style={{ color: team.color, opacity: 0.6 }}>Win Prob</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-[3px] w-full rounded-full bg-[#161616]">
                  <div className="h-[3px] rounded-full f1-transition" style={{ width: `${team.polymarket.probability * 100}%`, background: team.color }} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#131313] pt-3">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>Last updated: 2 min ago</span>
                <a href={team.polymarket.url} target="_blank" rel="noopener noreferrer" className="f1-transition f1-label !text-[#E10600] hover:opacity-70">
                  Bet on Polymarket &rarr;
                </a>
              </div>
            </div>

            {/* Driver comparison */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Driver Comparison</span>
              </div>
              <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color }} />
                  <div>
                    <p className="f1-display-md text-white">{d1.code}</p>
                    <p className="f1-label-xs">{d1.name}</p>
                  </div>
                </div>
                <div className="f1-label text-center" style={{ color: "#2a2a2a" }}>VS</div>
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="f1-display-md text-white">{d2.code}</p>
                    <p className="f1-label-xs">{d2.name}</p>
                  </div>
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color, opacity: 0.45 }} />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Points", v1: d1.pts, v2: d2.pts },
                  { label: "Wins", v1: d1.wins, v2: d2.wins },
                  { label: "Qualifying H2H", v1: d1.qualifyingH2H, v2: d2.qualifyingH2H },
                  { label: "Race H2H", v1: d1.raceH2H, v2: d2.raceH2H },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="f1-data text-sm text-white">{row.v1}</span>
                      <span className="f1-label">{row.label}</span>
                      <span className="f1-data text-sm" style={{ color: "#666" }}>{row.v2}</span>
                    </div>
                    {(row.v1 + row.v2) > 0 && (
                      <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                        <div className="h-full f1-transition" style={{ width: `${(row.v1 / (row.v1 + row.v2)) * 100}%`, background: team.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[d1, d2].map((d: Driver, i: number) => (
                  <div key={d.id} className="f1-surface-inner p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="f1-team-bar h-4" style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }} />
                      <span className="f1-label !text-white">{d.code}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "POD", value: d.podiums },
                        { label: "POL", value: d.poles },
                        { label: "DNF", value: d.dnfs },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="f1-label-xs">{s.label}</p>
                          <p className="f1-data text-sm text-white mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Race-by-race results */}
            {team.raceResults.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">Race-by-Race Results</span>
                </div>
                <div className="mb-1 grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] gap-2 px-2">
                  <span className="f1-label-xs">RND</span>
                  <span className="f1-label-xs">Race</span>
                  <span className="f1-label-xs text-center">{d1.code}</span>
                  <span className="f1-label-xs text-center">{d2.code}</span>
                  <span className="f1-label-xs text-right">Team PTS</span>
                </div>
                <div className="space-y-1">
                  {team.raceResults.map((r) => (
                    <div key={r.round} className="f1-transition grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] items-center gap-2 f1-surface-inner px-2 py-2.5 hover:bg-[#0d0d0d]">
                      <span className="f1-data text-[0.625rem] text-center" style={{ color: "#444" }}>{String(r.round).padStart(2, "0")}</span>
                      <span className="f1-body-sm text-white truncate">{r.race}</span>
                      <div className="text-center"><FinishCell pos={r.d1} /></div>
                      <div className="text-center"><FinishCell pos={r.d2} /></div>
                      <div className="text-right">
                        <span className="f1-data text-sm" style={{ color: team.color }}>+{r.teamPts}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-[#131313] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="f1-label">{racesCompleted} of 24 races completed</span>
                    <span className="f1-data text-sm" style={{ color: team.color }}>{team.championship.pts} pts</span>
                  </div>
                  <div className="mt-1.5 h-[3px] w-full rounded-full bg-[#161616]">
                    <div className="h-[3px] rounded-full f1-transition" style={{ width: `${(racesCompleted / 24) * 100}%`, background: team.color }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Driver cards */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Drivers</span>
              </div>
              <div className="space-y-2">
                {team.drivers.map((d: Driver, i: number) => {
                  const ptsShare = team.championship.pts > 0 ? Math.round((d.pts / team.championship.pts) * 100) : 0;
                  return (
                    <div key={d.id} className="f1-hover f1-surface-inner p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="f1-team-bar h-8" style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }} />
                          <div>
                            <p className="f1-display-md text-white">{d.name}</p>
                            <p className="f1-label-xs">{d.nationality}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="f1-display" style={{ fontSize: "2rem", color: team.color, opacity: i === 0 ? 0.2 : 0.1, lineHeight: 1 }}>{d.number}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: "PTS", value: d.pts },
                          { label: "WIN", value: d.wins },
                          { label: "POD", value: d.podiums },
                          { label: "POL", value: d.poles },
                        ].map((s) => (
                          <div key={s.label} className="rounded bg-[#0a0a0a] p-1.5 text-center">
                            <p className="f1-label-xs">{s.label}</p>
                            <p className="f1-data text-sm text-white mt-0.5">{s.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="f1-label-xs">Points share</span>
                          <span className="f1-label-xs" style={{ color: team.color }}>{ptsShare}%</span>
                        </div>
                        <div className="h-[2px] w-full rounded-full bg-[#161616]">
                          <div className="h-[2px] rounded-full f1-transition" style={{ width: maxPts > 0 ? `${(d.pts / maxPts) * 100}%` : "0%", background: team.color, opacity: i === 0 ? 1 : 0.5 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical info */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Technical</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Power Unit", value: team.technical.powerUnit },
                  { label: "Chassis", value: team.technical.chassis },
                  { label: "Tyres", value: team.technical.tyreSupplier },
                  { label: "Base", value: team.technical.base },
                  { label: "Tech Director", value: team.technical.technicalDirector },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 f1-surface-inner px-3 py-2">
                    <span className="f1-label-xs">{row.label}</span>
                    <span className="f1-body-sm text-white">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <div className="f1-accent-bar" style={{ background: "#E10600", height: "10px" }} />
                  <span className="f1-label !text-[#E10600]">2026 Reg Changes</span>
                </div>
                <ul className="space-y-1.5">
                  {team.technical.reg2026.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 f1-surface-inner px-3 py-2">
                      <span className="f1-data text-[0.5625rem] mt-0.5 shrink-0" style={{ color: "#2a2a2a" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="f1-body-sm" style={{ color: "#777" }}>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick links */}
            <div className="f1-surface p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Explore</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { href: "/teams", label: "All Constructors" },
                  { href: "/drivers", label: "Driver Standings" },
                  { href: "/markets", label: "Polymarket Odds" },
                  { href: "/races", label: "Race Calendar" },
                ].map((link) => (
                  <Link key={link.href} href={link.href as "/"} className="f1-transition f1-hover flex items-center justify-between f1-surface-inner px-3 py-2.5">
                    <span className="f1-body-sm text-white">{link.label}</span>
                    <span className="f1-label" style={{ color: "#333" }}>&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
