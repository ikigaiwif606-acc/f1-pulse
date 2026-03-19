"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { DRIVER_PROFILE_MAP, getDriverAge } from "@/lib/data/driver-profiles";
import type { DriverListItem } from "@/types";

// ── Types ────────────────────────────────────────────────────────
type SortKey = "position" | "points" | "name" | "salary";
type ViewMode = "teams" | "standings";

type DriverProfile = (typeof DRIVER_PROFILE_MAP)[string];

type EnrichedDriver = DriverListItem & {
  profile: DriverProfile | null;
  age: number;
  salary: number;
  championshipPct: number;
};

// ── Constants ────────────────────────────────────────────────────
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

// Static championship odds for the overview
const CHAMPIONSHIP_ODDS: Record<string, number> = {
  russell: 57, antonelli: 15, leclerc: 10, hamilton: 5, norris: 4,
  verstappen: 3, bearman: 2, piastri: 2, gasly: 1, lawson: 1,
  hadjar: 1, lindblad: 0.5, sainz: 0.5, bortoleto: 0.3, albon: 0.3,
  hulkenberg: 0.2, colapinto: 0.2, ocon: 0.2, alonso: 0.1, stroll: 0.1,
  bottas: 0.1, perez: 0.1,
};

function formatSalary(m: number): string {
  if (m >= 1) return `$${m}M`;
  return `$${(m * 1000).toFixed(0)}K`;
}

function getPosStyle(pos: number): { text: string; border: string; bg: string } {
  if (pos === 1) return { text: "text-yellow-400", border: "border-yellow-400/50", bg: "bg-yellow-400/10" };
  if (pos === 2) return { text: "text-zinc-300", border: "border-zinc-300/50", bg: "bg-zinc-300/10" };
  if (pos === 3) return { text: "text-amber-600", border: "border-amber-600/50", bg: "bg-amber-600/10" };
  if (pos <= 10) return { text: "text-emerald-400", border: "border-emerald-400/50", bg: "bg-emerald-400/10" };
  return { text: "text-zinc-500", border: "border-zinc-700", bg: "bg-zinc-800/50" };
}

// ── Main Component ───────────────────────────────────────────────
export default function DriversPageClient({ drivers }: { drivers: DriverListItem[] }) {
  const t = useTranslations("driver");

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [viewMode, setViewMode] = useState<ViewMode>("teams");

  // Enrich all drivers with profile data
  const enrichedDrivers: EnrichedDriver[] = useMemo(
    () =>
      drivers.map((d) => {
        const profile = DRIVER_PROFILE_MAP[d.id] ?? null;
        return {
          ...d,
          profile,
          age: profile ? getDriverAge(profile.dateOfBirth) : 0,
          salary: profile?.salaryMillionsUSD ?? 0,
          championshipPct: CHAMPIONSHIP_ODDS[d.id] ?? 0,
        };
      }),
    [drivers]
  );

  // All unique teams
  const teams = useMemo(() => {
    const seen = new Set<string>();
    return drivers.reduce<string[]>((acc, d) => {
      if (!seen.has(d.team)) {
        seen.add(d.team);
        acc.push(d.team);
      }
      return acc;
    }, []);
  }, [drivers]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = enrichedDrivers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.team.toLowerCase().includes(q)
      );
    }

    if (teamFilter !== "all") {
      result = result.filter((d) => d.team === teamFilter);
    }

    if (viewMode === "standings" || teamFilter !== "all") {
      result = [...result].sort((a, b) => {
        switch (sortKey) {
          case "points":
            return b.pts - a.pts;
          case "name":
            return a.name.localeCompare(b.name);
          case "salary":
            return b.salary - a.salary;
          default:
            return a.pos - b.pos;
        }
      });
    }

    return result;
  }, [enrichedDrivers, search, teamFilter, sortKey, viewMode]);

  // Summary stats
  const totalPts = enrichedDrivers.reduce((s, d) => s + d.pts, 0);
  const leader = enrichedDrivers.find((d) => d.pos === 1);
  const rookieCount = enrichedDrivers.filter((d) => d.age > 0 && d.age <= 22).length;
  const avgAge =
    enrichedDrivers.filter((d) => d.age > 0).reduce((s, d) => s + d.age, 0) /
    enrichedDrivers.filter((d) => d.age > 0).length;

  // Group by team for team view
  const teamGroups = useMemo(() => {
    if (viewMode !== "teams" || teamFilter !== "all") return [];
    const groups: {
      team: string;
      color: string;
      chassis: string;
      drivers: EnrichedDriver[];
    }[] = [];

    for (const teamName of TEAM_ORDER) {
      const teamDrivers = filtered.filter((d) => d.team === teamName);
      if (teamDrivers.length === 0) continue;
      groups.push({
        team: teamName,
        color: teamDrivers[0].color,
        chassis: teamDrivers[0].profile?.chassis ?? "",
        drivers: teamDrivers,
      });
    }
    return groups;
  }, [filtered, viewMode, teamFilter]);

  const maxTeamPts = useMemo(
    () => Math.max(...teamGroups.map((g) => g.drivers.reduce((s, d) => s + d.pts, 0)), 1),
    [teamGroups]
  );

  const showTeamView = viewMode === "teams" && teamFilter === "all" && !search;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* ── Page header ── */}
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">2026 Grid</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
        </div>

        {/* ── Summary Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="f1-surface p-3 text-center">
            <p className="f1-label-xs mb-1">{t("totalPoints")}</p>
            <p className="font-mono text-lg tabular-nums font-bold text-[#E10600]">{totalPts}</p>
          </div>
          <div className="f1-surface p-3 text-center">
            <p className="f1-label-xs mb-1">{t("leader")}</p>
            <p className="font-mono text-lg tabular-nums font-bold text-white">
              {leader?.code ?? "—"}
              <span className="text-xs font-normal ml-1" style={{ color: "var(--text-dim)" }}>{leader?.pts} pts</span>
            </p>
          </div>
          <div className="f1-surface p-3 text-center">
            <p className="f1-label-xs mb-1">{t("rookies")}</p>
            <p className="font-mono text-lg tabular-nums font-bold text-[#27F4D2]">{rookieCount}</p>
          </div>
          <div className="f1-surface p-3 text-center">
            <p className="f1-label-xs mb-1">{t("avgAge")}</p>
            <p className="font-mono text-lg tabular-nums font-bold text-white">{avgAge.toFixed(1)}</p>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-ghost)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[var(--text-ghost)] focus:outline-none focus:border-[#E10600]/50 f1-transition"
            />
          </div>

          {/* Team filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E10600]/50 f1-transition min-w-[140px]"
          >
            <option value="all">{t("filterByTeam")}</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E10600]/50 f1-transition min-w-[130px]"
          >
            <option value="position">{t("sortPosition")}</option>
            <option value="points">{t("sortPoints")}</option>
            <option value="name">{t("sortName")}</option>
            <option value="salary">{t("sortSalary")}</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("teams")}
              className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase f1-transition ${
                viewMode === "teams" ? "bg-[#E10600] text-white" : "bg-[#0a0a0a] text-[var(--text-dim)] hover:text-white"
              }`}
            >
              {t("viewTeams")}
            </button>
            <button
              onClick={() => setViewMode("standings")}
              className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase f1-transition ${
                viewMode === "standings" ? "bg-[#E10600] text-white" : "bg-[#0a0a0a] text-[var(--text-dim)] hover:text-white"
              }`}
            >
              {t("viewStandings")}
            </button>
          </div>
        </div>

        {/* ── Grid count ── */}
        <p className="f1-label mb-4">
          {t("gridSummary", { teams: teams.length, drivers: filtered.length })}
        </p>

        {/* ── No results ── */}
        {filtered.length === 0 && (
          <div className="f1-surface p-12 text-center">
            <p className="f1-data-lg text-[var(--text-subtle)] mb-3">{t("noResults")}</p>
            <button
              onClick={() => {
                setSearch("");
                setTeamFilter("all");
              }}
              className="f1-label !text-[#E10600] hover:opacity-70 f1-transition"
            >
              {t("clearFilters")}
            </button>
          </div>
        )}

        {/* ── Team-grouped view ── */}
        {showTeamView && (
          <div className="space-y-8">
            {teamGroups.map((group) => {
              const teamPts = group.drivers.reduce((s, d) => s + d.pts, 0);
              const chassisShort = group.chassis.split(" ").slice(-1)[0];

              return (
                <div key={group.team}>
                  <TeamHeader
                    team={group.team}
                    color={group.color}
                    chassis={chassisShort}
                    teamPts={teamPts}
                    maxTeamPts={maxTeamPts}
                  />
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-b-2xl overflow-hidden border border-t-0"
                    style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}
                  >
                    {group.drivers.map((d) => (
                      <DriverCard key={d.id} driver={d} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Standings / filtered view ── */}
        {!showTeamView && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((d, i) => (
              <StandingsRow key={d.id} driver={d} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────

function TeamHeader({
  team,
  color,
  chassis,
  teamPts,
  maxTeamPts,
}: {
  team: string;
  color: string;
  chassis: string;
  teamPts: number;
  maxTeamPts: number;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-t-2xl px-5 py-4 border border-b-0"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        borderLeftColor: color,
        borderLeftWidth: "3px",
        background: "linear-gradient(135deg, rgba(15,15,15,0.8), rgba(15,15,15,0.4))",
      }}
    >
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{team}</h2>
          <span className="font-mono text-[0.625rem] tabular-nums uppercase tracking-widest rounded bg-[rgba(255,255,255,0.05)] px-2 py-0.5" style={{ color: "var(--text-dim)" }}>
            {chassis}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block w-28">
          <div className="h-1.5 w-full rounded-full bg-[#161616] overflow-hidden">
            <div className="h-full rounded-full f1-transition" style={{ width: `${(teamPts / maxTeamPts) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-lg tabular-nums font-bold text-white">{teamPts}</span>
          <span className="f1-label-xs ml-1">PTS</span>
        </div>
      </div>
    </div>
  );
}

function DriverCard({ driver: d }: { driver: EnrichedDriver }) {
  const t = useTranslations("driver");
  const p = d.profile;
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
      {/* Watermark Race Number */}
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

      {/* Team color glow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ backgroundColor: d.color, boxShadow: `0 0 12px ${d.color}40` }}
      />

      <div className="relative">
        {/* Header: Name + Position Badge */}
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

          <div className="flex flex-col items-end gap-1.5">
            <span className={`font-mono text-sm tabular-nums font-bold rounded-full px-3 py-1 border ${posStyle.text} ${posStyle.border} ${posStyle.bg}`}>
              P{d.pos}
            </span>
            {/* Championship odds badge */}
            {d.championshipPct > 0 && (
              <span className="font-mono text-[0.6rem] tabular-nums rounded-full px-2 py-0.5 border border-[#E10600]/30 bg-[#E10600]/10 text-[#E10600]">
                {t("wdcOdds")} {d.championshipPct}%
              </span>
            )}
          </div>
        </div>

        {/* Financial / Bio Row */}
        {p && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="value-pill">
              {formatSalary(p.salaryMillionsUSD)}
            </span>
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              Age {d.age}
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

        {/* Performance Micro-Dashboard */}
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
}

function StandingsRow({ driver: d, rank }: { driver: EnrichedDriver; rank: number }) {
  const t = useTranslations("driver");
  const p = d.profile;
  const flag = p ? (NATIONALITY_FLAGS[p.nationality] ?? "\u{1F3F3}\u{FE0F}") : "";
  const posStyle = getPosStyle(d.pos);
  const nameParts = d.name.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  // Points bar (relative to leader)
  const maxPts = 60; // rough max for scaling
  const ptsPct = Math.min((d.pts / maxPts) * 100, 100);

  return (
    <Link
      href={`/drivers/${d.id}` as "/"}
      className="group relative flex items-center gap-4 rounded-xl border px-4 py-3 f1-transition hover:bg-[rgba(20,20,20,0.6)]"
      style={{
        background: "rgba(10,10,10,0.7)",
        borderColor: "rgba(255,255,255,0.06)",
        borderLeftColor: d.color,
        borderLeftWidth: "3px",
      }}
    >
      {/* Rank */}
      <div className="w-8 text-center shrink-0">
        <span className={`font-mono text-lg tabular-nums font-bold ${posStyle.text}`}>
          {rank}
        </span>
      </div>

      {/* Driver info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm">{flag}</span>
          <span className="text-sm text-[var(--text-dim)]">{firstName}</span>
          <span className="text-sm font-bold text-white">{lastName}</span>
          <span className="font-mono text-xs tabular-nums font-bold" style={{ color: d.color }}>
            #{d.number}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>{d.team}</span>
          {p && (
            <>
              <span className="text-[rgba(255,255,255,0.1)]">&middot;</span>
              <span className="value-pill !text-[0.6rem] !px-1.5 !py-0">{formatSalary(p.salaryMillionsUSD)}</span>
            </>
          )}
          {d.championshipPct > 0 && (
            <>
              <span className="text-[rgba(255,255,255,0.1)]">&middot;</span>
              <span className="font-mono text-[0.6rem] tabular-nums text-[#E10600]">
                {t("wdcOdds")} {d.championshipPct}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <div className="w-32">
          <div className="h-1.5 w-full rounded-full bg-[#161616] overflow-hidden">
            <div
              className="h-full rounded-full f1-transition"
              style={{ width: `${ptsPct}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: "PTS", value: d.pts, highlight: true },
            { label: "WIN", value: d.wins },
            { label: "POD", value: d.podiums },
          ].map((s) => (
            <div key={s.label} className="text-center w-10">
              <p className="text-[0.5rem] uppercase tracking-widest font-semibold" style={{ color: "var(--text-ghost)" }}>
                {s.label}
              </p>
              <p className={`font-mono text-sm tabular-nums font-bold ${s.highlight ? "text-[#E10600]" : "text-white"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="font-mono text-lg tabular-nums font-bold text-[#E10600]">{d.pts}</p>
          <p className="text-[0.5rem] uppercase tracking-widest font-semibold" style={{ color: "var(--text-ghost)" }}>PTS</p>
        </div>
      </div>
    </Link>
  );
}
