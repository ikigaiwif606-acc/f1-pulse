import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// ── Static data ────────────────────────────────────────────────────────────────

const MERCEDES = {
  id: "mercedes",
  name: "Mercedes",
  fullName: "Mercedes-AMG Petronas F1 Team",
  color: "#27F4D2",
  championship: { pos: 1, pts: 88, wins: 2, podiums: 4, poles: 2, dnfs: 0 },
  polymarket: {
    probability: 0.65,
    volume: "$12.1M",
    question: "Who will win the 2026 Constructors' Championship?",
    url: "https://polymarket.com",
  },
  drivers: [
    {
      id: "russell",
      name: "George Russell",
      code: "RUS",
      number: 63,
      nationality: "British",
      pts: 51,
      wins: 2,
      podiums: 2,
      poles: 2,
      dnfs: 0,
      qualifyingH2H: 5, // Russell ahead in 5 out of 7 sessions
      raceH2H: 4,       // Russell ahead in 4 out of 7 races
      totalSessions: 7,
      totalRaces: 7,
    },
    {
      id: "antonelli",
      name: "Kimi Antonelli",
      code: "ANT",
      number: 12,
      nationality: "Italian",
      pts: 37,
      wins: 1,
      podiums: 2,
      poles: 0,
      dnfs: 0,
      qualifyingH2H: 2,
      raceH2H: 3,
      totalSessions: 7,
      totalRaces: 7,
    },
  ],
  raceResults: [
    { round: 1, race: "Australian GP", d1: 1, d2: 3, teamPts: 28 },
    { round: 2, race: "Chinese GP",    d1: 2, d2: 1, teamPts: 28 },
  ],
  technical: {
    powerUnit: "Mercedes-AMG F1 M17 E Performance",
    chassis: "W17",
    tyreSupplier: "Pirelli",
    base: "Brackley, England",
    technicalDirector: "James Allison",
    reg2026: [
      "First season under 2026 ground-effect + active aero regulations",
      "New 1.6L V6 hybrid unit with enhanced MGU-K deployment (350 kW)",
      "Narrower car concept (1,900 mm width) optimised for slower corners",
      "Significantly revised front wing geometry per new aero framework",
    ],
  },
};

// ── Position badge helper ──────────────────────────────────────────────────────

function PosBadge({ pos }: { pos: number }) {
  return (
    <span
      className="f1-label rounded px-2 py-1 text-white"
      style={{ background: "#E10600", fontSize: "0.625rem" }}
    >
      P{pos}
    </span>
  );
}

// ── Finish cell helper ─────────────────────────────────────────────────────────

function FinishCell({ pos }: { pos: number }) {
  const isPodium = pos <= 3;
  const isWin = pos === 1;
  return (
    <span
      className="f1-data text-sm"
      style={{
        color: isWin ? "#E10600" : isPodium ? "#27F4D2" : "#666",
      }}
    >
      P{pos}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // For now only Mercedes is implemented; show placeholder for other IDs
  const team = id === "mercedes" ? MERCEDES : null;

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

  const [d1, d2] = team.drivers;
  const maxPts = d1.pts; // d1 always leads

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <Link
            href="/teams"
            className="f1-transition f1-label hover:!text-white inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Constructors&apos; Championship</span>
          </Link>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Team color accent bar */}
            <div
              className="mt-1 hidden shrink-0 sm:block"
              style={{
                width: "4px",
                height: "64px",
                borderRadius: "2px",
                background: team.color,
              }}
            />
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <PosBadge pos={team.championship.pos} />
                <span className="f1-label" style={{ color: team.color }}>
                  Constructors&apos; Championship Leader
                </span>
              </div>
              <h1 className="f1-display-xl text-white">{team.name}</h1>
              <p className="f1-body-sm mt-1" style={{ color: "#555" }}>
                {team.fullName}
              </p>
            </div>
          </div>

          {/* Season marker */}
          <div className="hidden text-right sm:block">
            <p className="f1-label-xs">2026 Season</p>
            <p className="f1-data-lg mt-0.5" style={{ color: "#444" }}>
              R2<span style={{ color: "#2a2a2a" }}>/</span>22
            </p>
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {[
            { label: "Points",   value: team.championship.pts,    accent: true },
            { label: "Wins",     value: team.championship.wins,   accent: false },
            { label: "Podiums",  value: team.championship.podiums,accent: false },
            { label: "Poles",    value: team.championship.poles,  accent: false },
            { label: "DNFs",     value: team.championship.dnfs,   accent: false },
            { label: "Position", value: `P${team.championship.pos}`, accent: false },
          ].map((s) => (
            <div key={s.label} className="f1-surface p-3 text-center">
              <p className="f1-label-xs mb-1.5">{s.label}</p>
              <p
                className="f1-data-lg"
                style={{ color: s.accent ? team.color : "white" }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Left column — Polymarket + Driver comparison */}
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
                  <div
                    className="rounded border px-4 py-2"
                    style={{ borderColor: team.color + "40", background: team.color + "0d" }}
                  >
                    <p
                      className="f1-data-lg"
                      style={{ color: team.color }}
                    >
                      {(team.polymarket.probability * 100).toFixed(0)}
                      <span className="f1-label-xs ml-0.5" style={{ color: team.color, opacity: 0.7 }}>%</span>
                    </p>
                    <p className="f1-label-xs mt-0.5" style={{ color: team.color, opacity: 0.6 }}>Win Prob</p>
                  </div>
                </div>
              </div>

              {/* Probability bar */}
              <div className="mt-3">
                <div className="h-[3px] w-full rounded-full bg-[#161616]">
                  <div
                    className="h-[3px] rounded-full f1-transition"
                    style={{
                      width: `${team.polymarket.probability * 100}%`,
                      background: team.color,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#131313] pt-3">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  Last updated: 2 min ago
                </span>
                <a
                  href={team.polymarket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                >
                  Bet on Polymarket &rarr;
                </a>
              </div>
            </div>

            {/* Driver comparison panel */}
            <div className="f1-surface p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Driver Comparison</span>
              </div>

              {/* Driver name headers */}
              <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                {/* D1 */}
                <div className="flex items-center gap-2">
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color }} />
                  <div>
                    <p className="f1-display-md text-white">{d1.code}</p>
                    <p className="f1-label-xs">{d1.name}</p>
                  </div>
                </div>
                {/* VS */}
                <div className="f1-label text-center" style={{ color: "#2a2a2a" }}>VS</div>
                {/* D2 */}
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="f1-display-md text-white">{d2.code}</p>
                    <p className="f1-label-xs">{d2.name}</p>
                  </div>
                  <div className="f1-team-bar h-8" style={{ backgroundColor: team.color, opacity: 0.45 }} />
                </div>
              </div>

              {/* Stat rows */}
              <div className="space-y-3">
                {/* Points */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.pts}</span>
                    <span className="f1-label">Points</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.pts}</span>
                  </div>
                  <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                    <div
                      className="h-full f1-transition"
                      style={{
                        width: `${(d1.pts / (d1.pts + d2.pts)) * 100}%`,
                        background: team.color,
                      }}
                    />
                  </div>
                </div>

                {/* Wins */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.wins}</span>
                    <span className="f1-label">Wins</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.wins}</span>
                  </div>
                  {(d1.wins + d2.wins) > 0 && (
                    <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                      <div
                        className="h-full f1-transition"
                        style={{
                          width: `${(d1.wins / (d1.wins + d2.wins)) * 100}%`,
                          background: team.color,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Qualifying H2H */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.qualifyingH2H}</span>
                    <span className="f1-label">Qualifying H2H</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.qualifyingH2H}</span>
                  </div>
                  <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                    <div
                      className="h-full f1-transition"
                      style={{
                        width: `${(d1.qualifyingH2H / d1.totalSessions) * 100}%`,
                        background: team.color,
                      }}
                    />
                  </div>
                </div>

                {/* Race H2H */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="f1-data text-sm text-white">{d1.raceH2H}</span>
                    <span className="f1-label">Race H2H</span>
                    <span className="f1-data text-sm" style={{ color: "#666" }}>{d2.raceH2H}</span>
                  </div>
                  <div className="flex h-[4px] w-full overflow-hidden rounded-full bg-[#161616]">
                    <div
                      className="h-full f1-transition"
                      style={{
                        width: `${(d1.raceH2H / d1.totalRaces) * 100}%`,
                        background: team.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Individual stat pills */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[d1, d2].map((d, i) => (
                  <div key={d.id} className="f1-surface-inner p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <div
                        className="f1-team-bar h-4"
                        style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }}
                      />
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
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Race-by-Race Results</span>
              </div>

              {/* Table header */}
              <div className="mb-1 grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] gap-2 px-2">
                <span className="f1-label-xs">RND</span>
                <span className="f1-label-xs">Race</span>
                <span className="f1-label-xs text-center">{d1.code}</span>
                <span className="f1-label-xs text-center">{d2.code}</span>
                <span className="f1-label-xs text-right">Team PTS</span>
              </div>

              <div className="space-y-1">
                {team.raceResults.map((r) => (
                  <div
                    key={r.round}
                    className="f1-transition grid grid-cols-[2rem_1fr_3rem_3rem_3.5rem] items-center gap-2 f1-surface-inner px-2 py-2.5 hover:bg-[#0d0d0d]"
                  >
                    <span className="f1-data text-[0.625rem] text-center" style={{ color: "#444" }}>
                      {String(r.round).padStart(2, "0")}
                    </span>
                    <span className="f1-body-sm text-white truncate">{r.race}</span>
                    <div className="text-center">
                      <FinishCell pos={r.d1} />
                    </div>
                    <div className="text-center">
                      <FinishCell pos={r.d2} />
                    </div>
                    <div className="text-right">
                      <span className="f1-data text-sm" style={{ color: team.color }}>
                        +{r.teamPts}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Points bar for each completed race */}
              <div className="mt-3 border-t border-[#131313] pt-3">
                <div className="flex items-center justify-between">
                  <span className="f1-label">2 of 22 races completed</span>
                  <span className="f1-data text-sm" style={{ color: team.color }}>
                    {team.championship.pts} pts
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] w-full rounded-full bg-[#161616]">
                  <div
                    className="h-[3px] rounded-full f1-transition"
                    style={{ width: `${(2 / 22) * 100}%`, background: team.color }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Driver cards + Technical */}
          <div className="flex flex-col gap-4">

            {/* Driver cards */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Drivers</span>
              </div>

              <div className="space-y-2">
                {team.drivers.map((d, i) => {
                  const ptsShare = Math.round((d.pts / team.championship.pts) * 100);
                  return (
                    <div key={d.id} className="f1-hover f1-surface-inner p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="f1-team-bar h-8"
                            style={{ backgroundColor: team.color, opacity: i === 0 ? 1 : 0.45 }}
                          />
                          <div>
                            <p className="f1-display-md text-white">{d.name}</p>
                            <p className="f1-label-xs">{d.nationality}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="f1-display"
                            style={{ fontSize: "2rem", color: team.color, opacity: i === 0 ? 0.2 : 0.1, lineHeight: 1 }}
                          >
                            {d.number}
                          </span>
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
                          <div
                            className="h-[2px] rounded-full f1-transition"
                            style={{ width: `${(d.pts / maxPts) * 100}%`, background: team.color, opacity: i === 0 ? 1 : 0.5 }}
                          />
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
                  { label: "Power Unit",   value: team.technical.powerUnit },
                  { label: "Chassis",      value: team.technical.chassis },
                  { label: "Tyres",        value: team.technical.tyreSupplier },
                  { label: "Base",         value: team.technical.base },
                  { label: "Tech Director",value: team.technical.technicalDirector },
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
                      <span className="f1-data text-[0.5625rem] mt-0.5 shrink-0" style={{ color: "#2a2a2a" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
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
                  { href: "/teams",   label: "All Constructors" },
                  { href: "/drivers", label: "Driver Standings" },
                  { href: "/markets", label: "Polymarket Odds" },
                  { href: "/races",   label: "Race Calendar" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href as "/"}
                    className="f1-transition f1-hover flex items-center justify-between f1-surface-inner px-3 py-2.5"
                  >
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
