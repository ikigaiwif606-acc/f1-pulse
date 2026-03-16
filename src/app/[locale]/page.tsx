import { useTranslations } from "next-intl";
import { RaceCountdown } from "@/components/races/race-countdown";
import { OddsSummary } from "@/components/markets/odds-summary";
import { Link } from "@/lib/i18n/navigation";

const NEXT_RACE = {
  name: "Japanese Grand Prix",
  nameZh: "日本大奖赛",
  circuit: "Suzuka International Racing Course",
  circuitZh: "铃鹿国际赛车场",
  date: "2026-03-29T06:00:00Z",
  round: 3,
  isSprint: false,
};

const STANDINGS = [
  { pos: 1, name: "George Russell", code: "RUS", pts: 51, color: "#27F4D2" },
  { pos: 2, name: "Kimi Antonelli", code: "ANT", pts: 37, color: "#27F4D2" },
  { pos: 3, name: "Charles Leclerc", code: "LEC", pts: 31, color: "#E80020" },
  { pos: 4, name: "Lando Norris", code: "NOR", pts: 28, color: "#FF8000" },
  { pos: 5, name: "Max Verstappen", code: "VER", pts: 25, color: "#3671C6" },
];

const RECENT = [
  { round: 1, name: "Australian GP", code: "RUS", color: "#27F4D2" },
  { round: 2, name: "Chinese GP", code: "ANT", color: "#27F4D2" },
];

const maxPts = 51;

export default function HomePage() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1c1c1c]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#E10600]/6 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="f1-label !text-[#E10600]">Live Dashboard</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              </div>
              <h1 className="f1-display-xl text-white">{tCommon("appName")}</h1>
              <p className="f1-body-sm mt-1" style={{ color: "#444" }}>
                {tCommon("tagline")}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="f1-label-xs">2026 Season</p>
              <p className="f1-data-lg text-[#666] mt-0.5">
                R2<span style={{ color: "#2a2a2a" }}>/</span>22
              </p>
            </div>
          </div>

          <div className="f1-surface p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] animate-live" />
              <span className="f1-label !text-[#E10600]">{t("nextRace")}</span>
            </div>
            <RaceCountdown race={NEXT_RACE} />
          </div>
        </div>
      </section>

      {/* ── Dashboard Grid ── */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Odds — 2 cols */}
          <div className="f1-surface p-5 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("liveOdds")}</span>
              </div>
              <Link href="/markets" className="f1-transition f1-label hover:!text-white">
                {tCommon("viewAll")} &rarr;
              </Link>
            </div>
            <OddsSummary />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Standings */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="f1-accent-bar" />
                  <span className="f1-heading text-white">{t("championshipStandings")}</span>
                </div>
                <Link href="/drivers" className="f1-transition f1-label hover:!text-white">
                  {tCommon("viewAll")} &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {STANDINGS.map((d) => (
                  <div key={d.pos} className="flex items-center gap-2.5 f1-surface-inner p-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded f1-data text-[0.625rem] ${
                      d.pos === 1 ? "bg-[#E10600] text-white" : "text-[#444]"
                    }`}>
                      {d.pos}
                    </span>
                    <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="f1-body-sm font-semibold text-white truncate">{d.name}</span>
                        <span className="f1-data text-xs text-white ml-2">{d.pts}</span>
                      </div>
                      <div className="mt-1 h-[2px] w-full rounded-full bg-[#161616]">
                        <div className="h-[2px] rounded-full" style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="f1-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("recentResults")}</span>
              </div>

              <div className="space-y-1.5">
                {RECENT.map((r) => (
                  <div key={r.round} className="flex items-center gap-3 f1-surface-inner p-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#131313] f1-data text-[0.625rem]" style={{ color: "#444" }}>
                      R{r.round}
                    </span>
                    <span className="f1-body-sm flex-1" style={{ color: "#666" }}>{r.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="f1-team-bar h-3" style={{ backgroundColor: r.color }} />
                      <span className="f1-data text-xs font-bold" style={{ color: r.color }}>{r.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
