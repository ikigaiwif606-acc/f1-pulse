import { useTranslations } from "next-intl";

const QUALIFYING = [
  { name: "Russell", code: "RUS", gap: "+0.000s", color: "#27F4D2", pct: 100 },
  { name: "Antonelli", code: "ANT", gap: "+0.187s", color: "#27F4D2", pct: 82 },
  { name: "Leclerc", code: "LEC", gap: "+0.342s", color: "#E80020", pct: 65 },
  { name: "Norris", code: "NOR", gap: "+0.455s", color: "#FF8000", pct: 53 },
  { name: "Verstappen", code: "VER", gap: "+0.521s", color: "#3671C6", pct: 45 },
  { name: "Hamilton", code: "HAM", gap: "+0.589s", color: "#E80020", pct: 38 },
];

const SAFETY_CAR = [
  { circuit: "Monaco", rate: 55, icon: "🇲🇨" },
  { circuit: "Spa", rate: 45, icon: "🇧🇪" },
  { circuit: "Suzuka", rate: 35, icon: "🇯🇵" },
  { circuit: "Monza", rate: 30, icon: "🇮🇹" },
  { circuit: "Silverstone", rate: 25, icon: "🇬🇧" },
  { circuit: "Barcelona", rate: 20, icon: "🇪🇸" },
];

const DNF = [
  { team: "Williams", rate: 25, color: "#1868DB" },
  { team: "Haas", rate: 20, color: "#B6BABD" },
  { team: "Audi", rate: 15, color: "#00594F" },
  { team: "Alpine", rate: 12, color: "#0093CC" },
  { team: "Red Bull", rate: 10, color: "#3671C6" },
  { team: "Mercedes", rate: 0, color: "#27F4D2" },
];

export default function AnalyticsPage() {
  const t = useTranslations("analytics");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Intelligence</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">Data from 2 rounds &middot; 2026 Season</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Qualifying Pace */}
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">{t("qualifyingPace")}</span>
            </div>
            <p className="f1-label mb-4">Average gap to pole — 2026</p>

            <div className="space-y-2">
              {QUALIFYING.map((d, i) => (
                <div key={d.code} className="flex items-center gap-3">
                  <span className="f1-data w-4 text-center text-[0.625rem]" style={{ color: "#444" }}>{i + 1}</span>
                  <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                  <span className="f1-data w-8 text-[0.625rem]" style={{ color: "#444" }}>{d.code}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                  <span className={`f1-data text-xs ${i === 0 ? "text-[#E10600]" : "text-[#666]"}`}>{d.gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Car */}
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="f1-accent-bar" />
                <span className="f1-heading text-white">{t("safetyCarProbability")}</span>
              </div>
              <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5">
                {t("preRegulationData")}
              </span>
            </div>
            <p className="f1-label mb-4">Historical SC rate by circuit</p>

            <div className="space-y-2">
              {SAFETY_CAR.map((c) => (
                <div key={c.circuit} className="flex items-center gap-3">
                  <span className="hidden text-sm sm:block">{c.icon}</span>
                  <span className="f1-body-sm w-24 truncate" style={{ color: "#999" }}>{c.circuit}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full bg-[#f59e0b]" style={{ width: `${c.rate}%` }} />
                    </div>
                  </div>
                  <span className="f1-data w-8 text-right text-xs text-[#f59e0b]">{c.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* DNF Rate */}
          <div className="f1-surface p-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="f1-accent-bar" />
              <span className="f1-heading text-white">DNF Rate by Team</span>
            </div>
            <p className="f1-label mb-4">Retirement percentage — 2026</p>

            <div className="space-y-2">
              {DNF.map((d) => (
                <div key={d.team} className="flex items-center gap-3">
                  <div className="f1-team-bar h-5" style={{ backgroundColor: d.color }} />
                  <span className="f1-body-sm w-20" style={{ color: "#999" }}>{d.team}</span>
                  <div className="flex-1">
                    <div className="h-[3px] w-full rounded-full bg-[#161616]">
                      <div className="h-[3px] rounded-full" style={{ width: `${d.rate}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                  <span className="f1-data w-8 text-right text-xs text-[#666]">{d.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="rounded border border-dashed border-[#1c1c1c] bg-[#0a0a0a] p-5">
            <div className="flex h-full flex-col items-center justify-center py-10">
              <span className="f1-heading" style={{ color: "#2a2a2a" }}>{t("circuitComparison")}</span>
              <p className="f1-label-xs mt-2" style={{ color: "#1c1c1c" }}>Coming in Phase 1c</p>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#E10600]/15 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
