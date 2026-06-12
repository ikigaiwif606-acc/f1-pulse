import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getDriversList } from "@/lib/data/drivers";
import { getTeamsList } from "@/lib/data/teams";
import { getPointsProgression, type PointsProgression } from "@/lib/data/standings";
import { getSeasonContext } from "@/lib/data/season";
import { PointsProgressionChart } from "@/components/standings/points-progression";
import type { DriverListItem, TeamListItem } from "@/types";

export const revalidate = 900;

export default async function StandingsPage() {
  const [drivers, teams, progression, ctx] = await Promise.all([
    getDriversList(),
    getTeamsList(),
    getPointsProgression(6),
    getSeasonContext().catch(() => null),
  ]);

  return (
    <StandingsContent
      drivers={drivers}
      teams={teams}
      progression={progression}
      completed={ctx?.completedCount ?? 0}
      total={ctx?.totalRounds ?? 0}
    />
  );
}

function StandingsContent({
  drivers,
  teams,
  progression,
  completed,
  total,
}: {
  drivers: DriverListItem[];
  teams: TeamListItem[];
  progression: PointsProgression | null;
  completed: number;
  total: number;
}) {
  const t = useTranslations("standings");
  const maxDriverPts = drivers[0]?.pts || 1;
  const maxTeamPts = teams[0]?.pts || 1;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary, #07070c)" }}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="f1-label" style={{ color: "#E10600" }}>2026</span>
            <h1 className="f1-display-lg mt-0.5" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("title")}</h1>
          </div>
          <span className="f1-label">{t("afterRound", { round: completed })} · {completed}/{total}</span>
        </div>

        {/* Points progression chart */}
        {progression && progression.points.length > 1 && (
          <div className="f1-surface animate-fade-up" style={{ padding: "22px", marginBottom: "28px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div className="flex items-center gap-2">
                <span className="f1-accent-bar" />
                <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("pointsProgression")}</span>
              </div>
              <span className="f1-label-xs" style={{ color: "var(--text-dim, #888)" }}>{t("racePointsNote")}</span>
            </div>
            <PointsProgressionChart data={progression} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          {/* ── Drivers ── */}
          <div className="f1-surface animate-fade-up stagger-1" style={{ padding: "22px" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
              <span className="f1-accent-bar" />
              <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("drivers")}</span>
            </div>

            <div className="hidden sm:grid f1-label-xs" style={{ gridTemplateColumns: "32px 1fr 64px 48px 56px", gap: "8px", padding: "0 4px 8px", color: "var(--text-dim, #888)", borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))" }}>
              <span>#</span>
              <span>{t("driver")}</span>
              <span style={{ textAlign: "right" }}>{t("points")}</span>
              <span style={{ textAlign: "right" }}>{t("wins")}</span>
              <span style={{ textAlign: "right" }}>{t("gap")}</span>
            </div>

            {drivers.map((d) => (
              <Link
                key={d.id}
                href={`/drivers/${d.id}` as "/"}
                className="grid items-center f1-transition"
                style={{
                  gridTemplateColumns: "32px 1fr 64px 48px 56px",
                  gap: "8px",
                  padding: "10px 4px",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                <span className="f1-data" style={{ fontSize: "13px", color: d.pos <= 3 ? "var(--text-primary, #eeeef0)" : "var(--text-dim, #888)" }}>{d.pos}</span>
                <div className="flex items-center" style={{ gap: "10px", minWidth: 0 }}>
                  <div style={{ width: "3px", height: "22px", borderRadius: "1px", background: d.color, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #eeeef0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                    <div className="f1-label-xs" style={{ marginTop: "2px", color: "var(--text-dim, #888)" }}>{d.team}</div>
                  </div>
                </div>
                <span className="f1-data" style={{ fontSize: "14px", color: "var(--text-primary, #eeeef0)", textAlign: "right" }}>{d.pts}</span>
                <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-secondary, #8b8b9e)", textAlign: "right" }}>{d.wins || "—"}</span>
                <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-dim, #888)", textAlign: "right" }}>
                  {d.pos === 1 ? "—" : `-${maxDriverPts - d.pts}`}
                </span>
                {/* points share bar under row */}
                <div style={{ position: "absolute", left: "44px", right: "4px", bottom: 0, height: "2px" }}>
                  <div className="gap-bar" style={{ width: `${(d.pts / maxDriverPts) * 100}%`, height: "2px", background: `${d.color}33` }} />
                </div>
              </Link>
            ))}
          </div>

          {/* ── Constructors ── */}
          <div className="f1-surface animate-fade-up stagger-2" style={{ padding: "22px", alignSelf: "start" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
              <span className="f1-accent-bar" />
              <span className="f1-heading" style={{ color: "var(--text-primary, #eeeef0)" }}>{t("constructors")}</span>
            </div>

            <div className="hidden sm:grid f1-label-xs" style={{ gridTemplateColumns: "32px 1fr 64px 56px", gap: "8px", padding: "0 4px 8px", color: "var(--text-dim, #888)", borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))" }}>
              <span>#</span>
              <span>{t("team")}</span>
              <span style={{ textAlign: "right" }}>{t("points")}</span>
              <span style={{ textAlign: "right" }}>{t("gap")}</span>
            </div>

            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}` as "/"}
                className="grid items-center f1-transition"
                style={{
                  gridTemplateColumns: "32px 1fr 64px 56px",
                  gap: "8px",
                  padding: "11px 4px",
                  borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.05))",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                <span className="f1-data" style={{ fontSize: "13px", color: team.pos <= 3 ? "var(--text-primary, #eeeef0)" : "var(--text-dim, #888)" }}>{team.pos}</span>
                <div className="flex items-center" style={{ gap: "10px" }}>
                  <div style={{ width: "3px", height: "22px", borderRadius: "1px", background: team.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #eeeef0)" }}>{team.name}</span>
                </div>
                <span className="f1-data" style={{ fontSize: "14px", color: "var(--text-primary, #eeeef0)", textAlign: "right" }}>{team.pts}</span>
                <span className="f1-data" style={{ fontSize: "13px", color: "var(--text-dim, #888)", textAlign: "right" }}>
                  {team.pos === 1 ? "—" : `-${maxTeamPts - team.pts}`}
                </span>
                <div style={{ position: "absolute", left: "44px", right: "4px", bottom: 0, height: "2px" }}>
                  <div className="gap-bar" style={{ width: `${(team.pts / maxTeamPts) * 100}%`, height: "2px", background: `${team.color}33` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
