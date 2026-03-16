import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

// ── Data ──────────────────────────────────────────────────────────────────────

const DRIVER_DATA = {
  russell: {
    id: "russell",
    name: "George Russell",
    firstName: "George",
    lastName: "Russell",
    code: "RUS",
    number: 63,
    team: "Mercedes",
    teamColor: "#27F4D2",
    nationality: "British",
    flag: "🇬🇧",
    age: 28,
    championshipPos: 1,
    stats: {
      points: 51,
      wins: 2,
      podiums: 2,
      poles: 2,
      dnfs: 0,
      bestFinish: 1,
      pointsTarget: 60,
    },
    polymarket: {
      championshipPct: 57,
      championshipChange: +8.3,
      nextRaceWinPct: 28,
      nextRaceWinChange: +2.1,
      volume: "$18.2M",
      url: "https://polymarket.com",
    },
    races: [
      { round: 1, name: "Australian GP", circuit: "Melbourne", grid: 1, finish: 1, points: 25, gap: "WINNER", fl: true },
      { round: 2, name: "Chinese GP", circuit: "Shanghai", grid: 2, finish: 2, points: 18, gap: "+12.341s", fl: false },
    ],
    qualifying: {
      avgGapToPole: "+0.000s",
      sessions: [
        { round: 1, name: "AUS", pos: 1, gap: "+0.000" },
        { round: 2, name: "CHN", pos: 1, gap: "+0.000" },
      ],
    },
    h2h: {
      teammate: "Kimi Antonelli",
      teammateCode: "ANT",
      teammateColor: "#27F4D2",
      qualiWins: 2,
      qualiLosses: 0,
      raceWins: 2,
      raceLosses: 0,
      points: 51,
      teammatePoints: 37,
    },
    circuits: [
      {
        name: "Suzuka",
        flag: "🇯🇵",
        note: "Next Race — R3",
        isNext: true,
        bestFinish: 3,
        avgFinish: 4.8,
        entries: 4,
        wins: 0,
        podiums: 1,
        poles: 0,
        safetyCarRate: 35,
      },
      {
        name: "Melbourne",
        flag: "🇦🇺",
        note: "R1 — 2026 Winner",
        isNext: false,
        bestFinish: 1,
        avgFinish: 3.2,
        entries: 5,
        wins: 1,
        podiums: 3,
        poles: 2,
        safetyCarRate: 40,
      },
      {
        name: "Shanghai",
        flag: "🇨🇳",
        note: "R2 — P2",
        isNext: false,
        bestFinish: 2,
        avgFinish: 5.0,
        entries: 3,
        wins: 0,
        podiums: 1,
        poles: 1,
        safetyCarRate: 25,
      },
    ],
  },
};

type DriverId = keyof typeof DRIVER_DATA;

// ── Helpers ───────────────────────────────────────────────────────────────────

function finishBadgeClass(pos: number): string {
  if (pos === 1) return "bg-[#E10600] text-white";
  if (pos <= 3) return "bg-[#27F4D2]/15 text-[#27F4D2]";
  if (pos <= 10) return "bg-[#161616] text-[#666]";
  return "bg-[#0d0d0d] text-[#333]";
}

function gridBadgeClass(pos: number): string {
  if (pos === 1) return "text-[#E10600]";
  if (pos <= 3) return "text-[#27F4D2]";
  return "text-[#555]";
}

function changeColor(n: number): string {
  return n > 0 ? "text-[#22c55e]" : n < 0 ? "text-[#E10600]" : "text-[#555]";
}

function changeSign(n: number): string {
  return n > 0 ? "+" : "";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = DRIVER_DATA[id as DriverId] ?? DRIVER_DATA["russell"];

  const totalRacePoints = driver.races.reduce((s, r) => s + r.points, 0);
  const h2hQualiTotal = driver.h2h.qualiWins + driver.h2h.qualiLosses;
  const h2hRaceTotal = driver.h2h.raceWins + driver.h2h.raceLosses;
  const h2hMaxPts = Math.max(driver.h2h.points, driver.h2h.teammatePoints);

  return (
    <DriverDetailContent
      driver={driver}
      totalRacePoints={totalRacePoints}
      h2hQualiTotal={h2hQualiTotal}
      h2hRaceTotal={h2hRaceTotal}
      h2hMaxPts={h2hMaxPts}
    />
  );
}

// ── Client-renderable content ─────────────────────────────────────────────────
// Isolated so useTranslations can stay in a single component tree

function DriverDetailContent({
  driver,
  totalRacePoints,
  h2hQualiTotal,
  h2hRaceTotal,
  h2hMaxPts,
}: {
  driver: typeof DRIVER_DATA["russell"];
  totalRacePoints: number;
  h2hQualiTotal: number;
  h2hRaceTotal: number;
  h2hMaxPts: number;
}) {
  const t = useTranslations("driver");
  const tCommon = useTranslations("common");

  const { stats, polymarket, races, qualifying, h2h, circuits } = driver;

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── Back + breadcrumb ── */}
      <div className="border-b border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-2">
          <Link
            href="/drivers"
            className="f1-transition f1-label !text-[#444] hover:!text-white flex items-center gap-1.5"
          >
            <span className="text-xs leading-none">&larr;</span>
            Drivers
          </Link>
          <span className="f1-label-xs" style={{ color: "#222" }}>/</span>
          <span className="f1-label !text-[#666]">{driver.code}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        {/* Faint grid */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Team color glow strip */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: driver.teamColor }}
        />
        <div
          className="absolute -top-40 left-0 h-80 w-80 rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ backgroundColor: driver.teamColor }}
        />

        {/* Watermark number */}
        <div className="absolute right-0 top-0 select-none pointer-events-none overflow-hidden h-full flex items-center">
          <span
            className="f1-display"
            style={{
              fontSize: "clamp(8rem, 20vw, 16rem)",
              color: driver.teamColor,
              opacity: 0.04,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {driver.number}
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* Championship badge + team */}
              <div className="flex items-center gap-2 mb-2">
                <span className="f1-label rounded bg-[#E10600] px-1.5 py-0.5 !text-white">
                  P{driver.championshipPos}
                </span>
                <div
                  className="f1-team-bar h-4"
                  style={{ backgroundColor: driver.teamColor }}
                />
                <span className="f1-label" style={{ color: driver.teamColor }}>
                  {driver.team}
                </span>
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  &middot;
                </span>
                <span className="f1-label">
                  {driver.flag} {driver.nationality}
                </span>
              </div>

              {/* Name */}
              <h1 className="f1-display-xl text-white">{driver.name}</h1>

              {/* Sub-info */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Car</span>
                  <span
                    className="f1-data text-sm font-bold"
                    style={{ color: driver.teamColor }}
                  >
                    #{driver.number}
                  </span>
                </div>
                <span style={{ color: "#1c1c1c" }}>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Age</span>
                  <span className="f1-data text-sm text-white">{driver.age}</span>
                </div>
                <span style={{ color: "#1c1c1c" }}>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <span className="f1-label">Rounds</span>
                  <span className="f1-data text-sm text-white">{races.length}/22</span>
                </div>
              </div>
            </div>

            {/* Championship odds pill */}
            <div className="f1-surface px-4 py-3 sm:text-right shrink-0">
              <p className="f1-label mb-1">Championship Win Prob.</p>
              <div className="flex items-baseline gap-2 sm:justify-end">
                <span className="f1-data-xl text-white">
                  {polymarket.championshipPct}
                  <span className="f1-label text-base ml-0.5">%</span>
                </span>
                <span className={`f1-data text-xs ${changeColor(polymarket.championshipChange)}`}>
                  {changeSign(polymarket.championshipChange)}
                  {polymarket.championshipChange.toFixed(1)}%
                </span>
              </div>
              <p className="f1-label-xs mt-1" style={{ color: "#2a2a2a" }}>
                Vol {polymarket.volume} &middot; Polymarket
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-5 py-8 space-y-6">

        {/* ── Key stats grid ── */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">2026 Season Stats</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              { label: t("points"), value: stats.points, highlight: true },
              { label: t("wins"), value: stats.wins, highlight: false },
              { label: t("podiums"), value: stats.podiums, highlight: false },
              { label: t("poles"), value: stats.poles, highlight: false },
              { label: "DNFs", value: stats.dnfs, highlight: false, danger: stats.dnfs > 0 },
              { label: "Best Finish", value: `P${stats.bestFinish}`, highlight: false },
            ].map((s) => (
              <div key={s.label} className="f1-surface p-3 sm:p-4 text-center">
                <p className="f1-label-xs mb-2">{s.label}</p>
                <p
                  className={`f1-data-lg ${
                    s.highlight
                      ? "text-[#E10600]"
                      : s.danger
                      ? "text-[#E10600]"
                      : "text-white"
                  }`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Points progress bar */}
          <div className="mt-2 f1-surface p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="f1-label">Points accumulation</span>
              <span className="f1-data text-xs text-white">
                {stats.points} pts
                <span style={{ color: "#333" }}> / 2 rounds</span>
              </span>
            </div>
            <div className="h-[3px] w-full rounded-full bg-[#161616]">
              <div
                className="h-[3px] rounded-full"
                style={{
                  width: `${Math.min((stats.points / stats.pointsTarget) * 100, 100)}%`,
                  backgroundColor: driver.teamColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Two-column layout: Race results + Odds ── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Race results table — 2 cols */}
          <div className="f1-surface p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Race Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                  {races.length} races
                </span>
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5 !text-[#E10600]">
                  {totalRacePoints} pts
                </span>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_3rem_3rem_3rem_auto] items-center gap-2 mb-1 px-2">
              {["RD", "RACE", "GRD", "FIN", "PTS", "GAP"].map((h) => (
                <span key={h} className="f1-label-xs text-center last:text-right">{h}</span>
              ))}
            </div>

            <div className="space-y-1">
              {races.map((r) => (
                <div
                  key={r.round}
                  className="f1-transition f1-surface-inner grid grid-cols-[2rem_1fr_3rem_3rem_3rem_auto] items-center gap-2 px-2 py-2.5 rounded hover:bg-[#0d0d0d]"
                >
                  {/* Round */}
                  <span className="f1-data text-center text-[0.625rem]" style={{ color: "#333" }}>
                    R{r.round}
                  </span>

                  {/* Race name */}
                  <div className="min-w-0">
                    <p className="f1-body-sm font-semibold text-white truncate">{r.name}</p>
                    <p className="f1-label-xs" style={{ color: "#333" }}>{r.circuit}</p>
                  </div>

                  {/* Grid */}
                  <span className={`f1-data text-xs text-center ${gridBadgeClass(r.grid)}`}>
                    P{r.grid}
                  </span>

                  {/* Finish */}
                  <div className="flex justify-center">
                    <span
                      className={`f1-data text-[0.625rem] px-1.5 py-0.5 rounded ${finishBadgeClass(r.finish)}`}
                    >
                      P{r.finish}
                    </span>
                  </div>

                  {/* Points */}
                  <span className="f1-data text-xs text-center text-white">{r.points}</span>

                  {/* Gap */}
                  <div className="text-right flex items-center justify-end gap-1.5">
                    {r.fl && (
                      <span className="f1-label-xs rounded bg-[#9333ea]/20 px-1 py-0.5 !text-[#a855f7]">
                        FL
                      </span>
                    )}
                    <span
                      className={`f1-data text-xs ${
                        r.gap === "WINNER" ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      {r.gap}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Odds panel — 1 col */}
          <div className="space-y-4">
            {/* Championship odds */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Polymarket Odds</span>
              </div>

              {[
                {
                  label: "WDC",
                  desc: "Championship Win",
                  pct: polymarket.championshipPct,
                  change: polymarket.championshipChange,
                },
                {
                  label: "R3",
                  desc: "Japanese GP Win",
                  pct: polymarket.nextRaceWinPct,
                  change: polymarket.nextRaceWinChange,
                },
              ].map((m) => (
                <div key={m.label} className="f1-surface-inner p-3 rounded mb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="f1-label rounded bg-[#131313] px-1.5 py-0.5 !text-[#444]">
                        {m.label}
                      </span>
                      <p className="f1-body-sm mt-1 text-white">{m.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="f1-data-lg text-white">
                        {m.pct}
                        <span className="f1-label text-sm ml-0.5">%</span>
                      </p>
                      <p className={`f1-data text-[0.625rem] ${changeColor(m.change)}`}>
                        {changeSign(m.change)}{m.change.toFixed(1)}% 24h
                      </p>
                    </div>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-[#161616]">
                    <div
                      className="h-[3px] rounded-full"
                      style={{
                        width: `${m.pct}%`,
                        backgroundColor: driver.teamColor,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-3 border-t border-[#131313] pt-3 flex items-center justify-between">
                <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                  Vol {polymarket.volume}
                </span>
                <a
                  href={polymarket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                >
                  Bet on Polymarket &rarr;
                </a>
              </div>
            </div>

            {/* Qualifying pace */}
            <div className="f1-surface p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("qualifyingPace")}</span>
              </div>
              <p className="f1-label mb-4">Avg gap to pole — 2026</p>

              <div className="f1-surface-inner rounded p-3 mb-3 flex items-center justify-between">
                <span className="f1-label">Average</span>
                <span className="f1-data text-sm text-[#E10600]">
                  {qualifying.avgGapToPole}
                </span>
              </div>

              <div className="space-y-1.5">
                {qualifying.sessions.map((s) => (
                  <div
                    key={s.round}
                    className="flex items-center gap-2 f1-surface-inner px-2.5 py-2 rounded"
                  >
                    <span className="f1-label w-6 text-center">{s.name}</span>
                    <div className="flex-1">
                      <div className="h-[2px] w-full rounded-full bg-[#161616]">
                        <div
                          className="h-[2px] rounded-full"
                          style={{
                            width: s.pos === 1 ? "100%" : "60%",
                            backgroundColor: driver.teamColor,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className={`f1-data text-xs w-12 text-right ${
                        s.pos === 1 ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      {s.pos === 1 ? "POLE" : s.gap}
                    </span>
                    <span
                      className={`f1-data text-[0.625rem] w-4 text-center ${
                        s.pos === 1 ? "text-[#E10600]" : "text-[#555]"
                      }`}
                    >
                      P{s.pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Head-to-head vs teammate ── */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("h2h")}</span>
            </div>
            <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
              {races.length} rounds
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Qualifying H2H */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Qualifying H2H</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="f1-data-lg text-white">{h2h.qualiWins}</span>
                <span className="f1-label" style={{ color: "#2a2a2a" }}>:</span>
                <span className="f1-data-lg" style={{ color: "#333" }}>{h2h.qualiLosses}</span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-[#161616] overflow-hidden">
                <div
                  className="h-[3px] rounded-full"
                  style={{
                    width: h2hQualiTotal > 0
                      ? `${(h2h.qualiWins / h2hQualiTotal) * 100}%`
                      : "50%",
                    backgroundColor: driver.teamColor,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="f1-label-xs" style={{ color: driver.teamColor }}>{driver.code}</span>
                <span className="f1-label-xs" style={{ color: "#333" }}>{h2h.teammateCode}</span>
              </div>
            </div>

            {/* Race H2H */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Race H2H</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="f1-data-lg text-white">{h2h.raceWins}</span>
                <span className="f1-label" style={{ color: "#2a2a2a" }}>:</span>
                <span className="f1-data-lg" style={{ color: "#333" }}>{h2h.raceLosses}</span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-[#161616] overflow-hidden">
                <div
                  className="h-[3px] rounded-full"
                  style={{
                    width: h2hRaceTotal > 0
                      ? `${(h2h.raceWins / h2hRaceTotal) * 100}%`
                      : "50%",
                    backgroundColor: driver.teamColor,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="f1-label-xs" style={{ color: driver.teamColor }}>{driver.code}</span>
                <span className="f1-label-xs" style={{ color: "#333" }}>{h2h.teammateCode}</span>
              </div>
            </div>

            {/* Points comparison */}
            <div className="f1-surface-inner rounded p-4">
              <p className="f1-label mb-3 text-center">Points Gap</p>
              <div className="space-y-2.5">
                {[
                  {
                    code: driver.code,
                    name: driver.name.split(" ")[1],
                    pts: h2h.points,
                    color: driver.teamColor,
                    isDriver: true,
                  },
                  {
                    code: h2h.teammateCode,
                    name: h2h.teammate.split(" ")[1],
                    pts: h2h.teammatePoints,
                    color: h2h.teammateColor,
                    isDriver: false,
                  },
                ].map((d) => (
                  <div key={d.code}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="f1-team-bar h-3"
                          style={{ backgroundColor: d.color }}
                        />
                        <span
                          className="f1-data text-[0.625rem]"
                          style={{ color: d.isDriver ? "#ededed" : "#444" }}
                        >
                          {d.code}
                        </span>
                      </div>
                      <span
                        className="f1-data text-xs"
                        style={{ color: d.isDriver ? "#ededed" : "#444" }}
                      >
                        {d.pts}
                      </span>
                    </div>
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div
                        className="h-[3px] rounded-full"
                        style={{
                          width: `${(d.pts / h2hMaxPts) * 100}%`,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="f1-label mt-3 text-center">
                +{h2h.points - h2h.teammatePoints} pts ahead
              </p>
            </div>
          </div>
        </div>

        {/* ── Circuit performance ── */}
        <div className="f1-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">Circuit Performance</span>
            </div>
            <span className="f1-label" style={{ color: "#333" }}>Historical &amp; 2026</span>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_3rem_4rem] items-center gap-3 mb-1 px-3">
            {["", "CIRCUIT", "NOTE", "ENTRIES", "WINS", "PODS", "POLES", "AVG FIN"].map((h) => (
              <span key={h} className="f1-label-xs text-center first:text-left">{h}</span>
            ))}
          </div>

          <div className="space-y-1">
            {circuits.map((c) => (
              <div
                key={c.name}
                className={`f1-transition rounded px-3 py-3 ${
                  c.isNext
                    ? "border border-[#E10600]/20 bg-[#E10600]/[0.02]"
                    : "f1-surface-inner"
                }`}
              >
                {/* Mobile layout */}
                <div className="sm:hidden flex items-center gap-3">
                  <span className="text-base">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="f1-display-md text-white">{c.name}</span>
                      {c.isNext && (
                        <span className="f1-label rounded bg-[#E10600] px-1 py-0.5 !text-white shrink-0">
                          Next
                        </span>
                      )}
                    </div>
                    <p className="f1-label-xs mt-0.5" style={{ color: "#333" }}>{c.note}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="f1-data text-xs text-white">
                      P{c.bestFinish} best
                    </p>
                    <p className="f1-data text-[0.625rem]" style={{ color: "#444" }}>
                      {c.avgFinish.toFixed(1)} avg
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_3rem_4rem] items-center gap-3">
                  <span className="text-base">{c.flag}</span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="f1-display-md text-white truncate">{c.name}</span>
                      {c.isNext && (
                        <span className="f1-label rounded bg-[#E10600] px-1 py-0.5 !text-white shrink-0">
                          Next
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="f1-label-xs text-center truncate" style={{ color: "#333" }}>
                    {c.note.split("—")[0].trim()}
                  </span>

                  <span className="f1-data text-xs text-center text-white">{c.entries}</span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.wins > 0 ? "text-[#E10600]" : "text-[#333]"
                    }`}
                  >
                    {c.wins}
                  </span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.podiums > 0 ? "text-[#27F4D2]" : "text-[#333]"
                    }`}
                  >
                    {c.podiums}
                  </span>

                  <span
                    className={`f1-data text-xs text-center ${
                      c.poles > 0 ? "text-white" : "text-[#333]"
                    }`}
                  >
                    {c.poles}
                  </span>

                  <div className="text-center">
                    <span className="f1-data text-xs text-white">
                      P{c.bestFinish}
                    </span>
                    <span className="f1-label-xs ml-1" style={{ color: "#333" }}>
                      / {c.avgFinish.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* SC probability strip */}
                {c.isNext && (
                  <div className="mt-3 border-t border-[#1c1c1c] pt-3">
                    <div className="flex items-center gap-3">
                      <span className="f1-label" style={{ color: "#555" }}>
                        SC probability at {c.name}
                      </span>
                      <div className="flex-1 h-[2px] rounded-full bg-[#161616]">
                        <div
                          className="h-[2px] rounded-full bg-[#f59e0b]"
                          style={{ width: `${c.safetyCarRate}%` }}
                        />
                      </div>
                      <span className="f1-data text-xs text-[#f59e0b]">
                        {c.safetyCarRate}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="border-t border-[#131313] pt-5 flex items-center justify-between">
          <p className="f1-label-xs" style={{ color: "#222" }}>
            {tCommon("appName")} &middot; 2026 Season &middot; Data through R{races.length}
          </p>
          <Link
            href="/drivers"
            className="f1-transition f1-label !text-[#333] hover:!text-white flex items-center gap-1"
          >
            &larr; All Drivers
          </Link>
        </div>
      </div>
    </div>
  );
}
