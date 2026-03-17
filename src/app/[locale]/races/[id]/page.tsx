import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getRaceDetailData, type RaceData } from "@/lib/data/race-detail";

// ── Code → driver slug mapping ───────────────────────────────────────────────
const DRIVER_SLUG: Record<string, string> = {
  RUS: "russell", ANT: "antonelli", LEC: "leclerc", HAM: "hamilton",
  BEA: "bearman", NOR: "norris", GAS: "gasly", VER: "verstappen",
  LAW: "lawson", LIN: "lindblad", HAD: "hadjar", PIA: "piastri",
  SAI: "sainz", BOR: "bortoleto", COL: "colapinto", OCO: "ocon",
  HUL: "hulkenberg", ALB: "albon", BOT: "bottas", PER: "perez",
  ALO: "alonso", STR: "stroll",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function WeatherIcon({ type }: { type: string }) {
  if (type === "sunny") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#f59e0b]">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  if (type === "partly-cloudy") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#94a3b8]">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748b]">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function RainBar({ pct }: { pct: number }) {
  const color = pct >= 60 ? "#3b82f6" : pct >= 30 ? "#60a5fa" : "#1e3a5f";
  return (
    <div className="mt-1 h-[3px] w-full rounded-full bg-[#161616]">
      <div className="h-[3px] rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const race = await getRaceDetailData(id);

  if (!race) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="f1-heading text-white mb-2">Race not found</p>
          <Link href="/races" className="f1-label !text-[#E10600]">Back to Calendar</Link>
        </div>
      </div>
    );
  }

  return <RaceDetailContent race={race} />;
}

function RaceDetailContent({ race }: { race: RaceData }) {
  return <RaceDetailInner race={race} />;
}

function RaceDetailInner({ race }: { race: RaceData }) {
  const t = useTranslations("race");
  const tMarkets = useTranslations("markets");

  const raceSession = race.sessions.find((s) => s.label === "Race");
  const qualSession = race.sessions.find((s) => s.label === "Qualifying");

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Back Navigation ─────────────────────────────────────────────── */}
      <div className="border-b border-[#1c1c1c]">
        <div className="mx-auto max-w-7xl px-5 py-3">
          <Link
            href="/races"
            className="f1-transition f1-label inline-flex items-center gap-2 hover:!text-white"
          >
            <span style={{ color: "#444" }}>&#8592;</span>
            <span>Back to Calendar</span>
          </Link>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-24 left-1/3 h-48 w-[400px] -translate-x-1/2 rounded-full bg-[#E10600]/5 blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="f1-label rounded bg-[#E10600] px-2 py-0.5 !text-white">
                  Round {race.round}
                </span>
                <span className="f1-label rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2 py-0.5">
                  {race.season} Season
                </span>
                {race.completed ? (
                  <span className="f1-label flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2 py-0.5 !text-[#555]">
                    Completed
                  </span>
                ) : (
                  <span className="f1-label flex items-center gap-1.5 rounded border border-[#E10600]/20 bg-[#E10600]/[0.04] px-2 py-0.5 !text-[#E10600]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
                    Upcoming
                  </span>
                )}
                {race.sprint && (
                  <span className="f1-label rounded border border-[#E10600]/20 bg-[#E10600]/10 px-2 py-0.5 !text-[#E10600]">
                    Sprint
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-4xl leading-none">{race.flag}</span>
                <div>
                  <h1 className="f1-display-xl text-white">{race.name}</h1>
                  <p className="f1-body-sm mt-1" style={{ color: "#555" }}>
                    {race.circuit}
                  </p>
                  <p className="f1-label mt-0.5" style={{ color: "#444" }}>
                    {race.hero.locality} &middot; {race.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-2">
              <div className="flex items-center justify-end gap-2">
                <span className="f1-label-xs">Race Date</span>
                <span className="f1-data text-sm text-white">{race.date}</span>
              </div>
              {raceSession && (
                <div className="flex items-center justify-end gap-2">
                  <span className="f1-label-xs">Race Start</span>
                  <span className="f1-data text-sm" style={{ color: "#E10600" }}>
                    {raceSession.time} {raceSession.utc}
                  </span>
                </div>
              )}
              {qualSession && (
                <div className="flex items-center justify-end gap-2">
                  <span className="f1-label-xs">Qualifying</span>
                  <span className="f1-data text-sm text-[#666]">
                    {qualSession.time} {qualSession.utc} SAT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-3">

          {/* ── LEFT / MAIN COLUMN (2/3) ────────────────────────────────── */}
          <div className="space-y-5 lg:col-span-2">

            {/* Race Results (completed races only) */}
            {race.completed && race.results && race.results.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">Race Result</span>
                </div>
                <div className="space-y-1">
                  {race.results.map((r) => (
                    <div
                      key={r.pos}
                      className="flex items-center gap-3 f1-surface-inner p-2.5"
                    >
                      <span className="f1-data w-5 shrink-0 text-center text-xs" style={{ color: r.pos === 1 ? "#f59e0b" : "#333" }}>
                        {r.pos}
                      </span>
                      <div className="f1-team-bar h-5" style={{ backgroundColor: r.color }} />
                      <span className="f1-body-sm flex-1 font-semibold text-white">{r.driver}</span>
                      <span className="f1-data text-xs" style={{ color: "#444" }}>{r.team}</span>
                      <span className="f1-data w-8 text-right text-xs font-bold" style={{ color: r.color }}>{r.code}</span>
                      {r.time && (
                        <span className="f1-data hidden w-24 text-right text-xs text-[#555] sm:block">{r.time}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Schedule */}
            {race.sessions.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("sessions")}</span>
                </div>

                <div className="grid gap-2 sm:grid-cols-5">
                  {race.sessions.map((session) => {
                    const isRace = session.label === "Race";
                    const isQual = session.label === "Qualifying";
                    return (
                      <div
                        key={session.label}
                        className={`f1-transition rounded border p-3 ${
                          isRace
                            ? "border-[#E10600]/25 bg-[#E10600]/[0.04]"
                            : isQual
                            ? "border-[#2a2a2a] bg-[#0f0f0f]"
                            : "border-[#1c1c1c] bg-[#0a0a0a]"
                        }`}
                      >
                        <p className={`f1-label-xs ${isRace ? "!text-[#E10600]" : isQual ? "!text-[#999]" : ""}`}>
                          {session.label}
                        </p>
                        <p className="f1-data mt-1.5 text-xs text-[#666]">{session.day}</p>
                        <p className="f1-label mt-0.5" style={{ color: "#444" }}>{session.date}</p>
                        <p className={`f1-data mt-1.5 text-sm ${isRace ? "text-white" : "text-[#555]"}`}>
                          {session.time}
                          <span className="f1-label-xs ml-1">{session.utc}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Polymarket Odds */}
            {race.polymarket.outcomes.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="f1-accent-bar" />
                    <span className="f1-heading text-white">{t("polymarketOdds")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                      <span className="f1-label-xs">Vol</span>
                      <span className="f1-data text-xs text-white">{race.polymarket.volume}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-live" />
                      <span className="f1-label-xs !text-emerald-500">Live</span>
                    </div>
                  </div>
                </div>

                <p className="f1-body-sm mb-4" style={{ color: "#555" }}>
                  {race.polymarket.question}
                </p>

                <div className="space-y-1">
                  {race.polymarket.outcomes.map((o, i) => (
                    <div key={o.name} className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]">
                      <span className="f1-data w-4 shrink-0 text-center text-xs" style={{ color: "#333" }}>{i + 1}</span>
                      <div className="f1-team-bar h-6" style={{ backgroundColor: o.color }} />
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="f1-data w-7 shrink-0 text-[0.625rem]" style={{ color: "#444" }}>{o.code}</span>
                        <div className="min-w-0 flex-1">
                          {DRIVER_SLUG[o.code] ? (
                            <Link href={`/drivers/${DRIVER_SLUG[o.code]}`} className="f1-body-sm block truncate font-semibold text-white hover:text-[#E10600] f1-transition">{o.name}</Link>
                          ) : (
                            <span className="f1-body-sm block truncate font-semibold text-white">{o.name}</span>
                          )}
                          <span className="f1-label-xs block" style={{ color: "#333" }}>{o.team}</span>
                        </div>
                      </div>
                      <div className="hidden w-28 sm:block">
                        <div className="h-[3px] w-full rounded-full bg-[#161616]">
                          <div className="h-[3px] rounded-full f1-transition" style={{ width: `${o.price * 100}%`, backgroundColor: o.color }} />
                        </div>
                      </div>
                      <span className={`f1-data hidden w-10 text-right text-xs sm:block ${o.change > 0 ? "text-emerald-400" : o.change < 0 ? "text-[#E10600]" : "text-[#444]"}`}>
                        {o.change > 0 ? "+" : ""}{(o.change * 100).toFixed(0)}%
                      </span>
                      <div className="w-14 shrink-0 rounded border border-[#1c1c1c] bg-[#0f0f0f] py-1 text-center">
                        <span className="f1-data text-sm text-white">{(o.price * 100).toFixed(0)}</span>
                        <span className="f1-label-xs ml-px">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-[#131313] pt-3">
                  <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                    {tMarkets("lastUpdated")}: {race.polymarket.updated}
                  </span>
                </div>
              </div>
            )}

            {/* Historical Data */}
            {race.history.last_winners.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("history")}</span>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="f1-surface-inner p-4 text-center">
                    <p className="f1-label-xs mb-2">Safety Car Rate</p>
                    <div>
                      <span className="f1-data-lg text-[#f59e0b]">{race.history.safety_car_rate}</span>
                      <span className="f1-label ml-1">%</span>
                    </div>
                  </div>
                  <div className="f1-surface-inner p-4 text-center">
                    <p className="f1-label-xs mb-2">Avg. Overtakes</p>
                    <div><span className="f1-data-lg text-white">{race.history.avg_overtakes}</span></div>
                  </div>
                  {race.circuit_info.lap_record !== "N/A" && (
                    <div className="col-span-2 f1-surface-inner p-4 sm:col-span-1">
                      <p className="f1-label-xs mb-2">Lap Record</p>
                      <p className="f1-data text-sm text-white">{race.circuit_info.lap_record}</p>
                      <p className="f1-body-sm mt-0.5" style={{ color: "#555" }}>{race.circuit_info.lap_record_holder}</p>
                      <p className="f1-label mt-0.5" style={{ color: "#333" }}>{race.circuit_info.lap_record_year}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="f1-label mb-3" style={{ color: "#555" }}>
                    Last {race.history.last_winners.length} Winners
                  </p>
                  <div className="space-y-1.5">
                    {race.history.last_winners.map((w) => (
                      <div key={w.year} className="flex items-center gap-3 f1-surface-inner p-2.5">
                        <span className="f1-data w-9 shrink-0 text-center text-xs" style={{ color: "#333" }}>{w.year}</span>
                        <div className="f1-team-bar h-4" style={{ backgroundColor: w.color }} />
                        <span className="f1-body-sm flex-1 font-semibold text-white">{w.driver}</span>
                        <span className="f1-data text-xs" style={{ color: "#444" }}>{w.team}</span>
                        <span className="f1-data w-8 text-right text-xs font-bold" style={{ color: w.color }}>{w.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (1/3) ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Circuit Information */}
            {race.circuit_info.length !== "N/A" && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("circuit")}</span>
                </div>

                <div className="space-y-px">
                  {[
                    { label: "Track Length", value: race.circuit_info.length },
                    { label: "Number of Turns", value: String(race.circuit_info.turns) },
                    { label: "Layout", value: race.circuit_info.layout },
                    { label: "Direction", value: race.circuit_info.direction },
                    { label: "Lap Record", value: race.circuit_info.lap_record },
                    { label: "Record Holder", value: race.circuit_info.lap_record_holder },
                    { label: "Record Year", value: String(race.circuit_info.lap_record_year) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between f1-surface-inner px-3 py-2.5">
                      <span className="f1-label" style={{ color: "#555" }}>{row.label}</span>
                      <span className="f1-data text-sm text-white">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded border border-[#1c1c1c] bg-[#0a0a0a] p-3">
                  <p className="f1-label mb-3" style={{ color: "#555" }}>2026 Overtake Mode Zones</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="f1-data-lg text-[#E10600]">{race.circuit_info.overtake_mode_zones}</p>
                      <p className="f1-label-xs mt-0.5">Zones</p>
                    </div>
                    <div className="flex-1 border-l border-[#1c1c1c] pl-4">
                      <p className="f1-body-sm" style={{ color: "#555" }}>
                        Active overtake windows replacing legacy DRS system under 2026 regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Forecast */}
            {race.weather.length > 0 && (
              <div className="f1-surface p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("weather")}</span>
                </div>

                <div className="space-y-2">
                  {race.weather.map((day) => {
                    const isRaceDay = day.day === "Sunday";
                    return (
                      <div key={day.day} className={`rounded border p-3 ${isRaceDay ? "border-[#E10600]/20 bg-[#E10600]/[0.03]" : "border-[#1c1c1c] bg-[#0a0a0a]"}`}>
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className={`f1-label-xs ${isRaceDay ? "!text-[#E10600]" : ""}`}>{day.day}</p>
                            <p className="f1-label mt-0.5" style={{ color: "#333" }}>{day.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <WeatherIcon type={day.icon} />
                            <span className="f1-body-sm" style={{ color: "#666" }}>{day.condition}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="f1-surface-inner p-2 text-center">
                            <p className="f1-label-xs">Hi / Lo</p>
                            <p className="f1-data mt-1 text-xs text-white">{day.temp_hi}°<span style={{ color: "#444" }}>/{day.temp_lo}°</span></p>
                          </div>
                          <div className="f1-surface-inner p-2 text-center">
                            <p className="f1-label-xs">Rain</p>
                            <p className={`f1-data mt-1 text-xs ${day.rain >= 60 ? "text-blue-400" : day.rain >= 30 ? "text-blue-500/70" : "text-[#444]"}`}>{day.rain}%</p>
                            <RainBar pct={day.rain} />
                          </div>
                          <div className="f1-surface-inner p-2 text-center">
                            <p className="f1-label-xs">Wind</p>
                            <p className="f1-data mt-1 text-[0.625rem] text-[#555]">{day.wind}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="f1-label-xs mt-3" style={{ color: "#2a2a2a" }}>Forecast updated 6h before each session</p>
              </div>
            )}

            {/* Quick links / betting CTA */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">Betting Intel</span>
              </div>
              <div className="space-y-2">
                <a href={race.polymarket.market_url} target="_blank" rel="noopener noreferrer" className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]">
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Race Winner</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>Vol {race.polymarket.volume}</p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>
                <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]">
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Safety Car?</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>Vol $340K</p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>
                <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="f1-transition f1-hover flex items-center justify-between f1-surface-inner p-3 hover:bg-[#131313]">
                  <div>
                    <p className="f1-body-sm font-semibold text-white">Fastest Lap</p>
                    <p className="f1-label mt-0.5" style={{ color: "#444" }}>Vol $210K</p>
                  </div>
                  <span className="f1-label !text-[#E10600]">Bet &rarr;</span>
                </a>
              </div>
              <div className="mt-4 border-t border-[#131313] pt-3">
                <Link href="/markets" className="f1-transition f1-label block text-center !text-[#E10600] hover:opacity-70">
                  View all F1 markets &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
