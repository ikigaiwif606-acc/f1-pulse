import { useTranslations } from "next-intl";

const QUALIFYING_DATA = [
  { name: "Russell", code: "RUS", gap: "+0.000s", color: "#27F4D2", pct: 100 },
  { name: "Antonelli", code: "ANT", gap: "+0.187s", color: "#27F4D2", pct: 82 },
  { name: "Leclerc", code: "LEC", gap: "+0.342s", color: "#E80020", pct: 65 },
  { name: "Norris", code: "NOR", gap: "+0.455s", color: "#FF8000", pct: 53 },
  { name: "Verstappen", code: "VER", gap: "+0.521s", color: "#3671C6", pct: 45 },
  { name: "Hamilton", code: "HAM", gap: "+0.589s", color: "#E80020", pct: 38 },
];

const SAFETY_CAR = [
  { circuit: "Monaco", rate: 55, icon: "🇲🇨" },
  { circuit: "Spa-Francorchamps", rate: 45, icon: "🇧🇪" },
  { circuit: "Suzuka", rate: 35, icon: "🇯🇵" },
  { circuit: "Monza", rate: 30, icon: "🇮🇹" },
  { circuit: "Silverstone", rate: 25, icon: "🇬🇧" },
  { circuit: "Barcelona", rate: 20, icon: "🇪🇸" },
];

const DNF_RATE = [
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
            Intelligence
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
            Data from 2 rounds &middot; 2026 Season
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Qualifying Pace */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
              <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                {t("qualifyingPace")}
              </span>
            </div>
            <p className="mb-4 text-[10px] text-[#4a4a4a]">
              Average gap to pole position across 2026 races
            </p>

            <div className="space-y-2">
              {QUALIFYING_DATA.map((d, i) => (
                <div key={d.code} className="flex items-center gap-3">
                  <span className="w-4 text-center text-[10px] font-bold text-[#4a4a4a]">
                    {i + 1}
                  </span>
                  <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="timing-number w-8 text-[10px] font-bold text-[#4a4a4a]">
                    {d.code}
                  </span>
                  <div className="flex-1">
                    <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
                      <div
                        className="h-[4px] rounded-full"
                        style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                  <span className={`timing-number text-xs font-bold ${
                    i === 0 ? "text-[#E10600]" : "text-[#737373]"
                  }`}>
                    {d.gap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Car Probability */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4 sm:p-5">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
                <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  {t("safetyCarProbability")}
                </span>
              </div>
              <span className="rounded border border-[#1f1f1f] bg-[#0a0a0a] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                {t("preRegulationData")}
              </span>
            </div>
            <p className="mb-4 text-[10px] text-[#4a4a4a]">
              Historical SC deployment rate by circuit
            </p>

            <div className="space-y-2">
              {SAFETY_CAR.map((c) => (
                <div key={c.circuit} className="flex items-center gap-3">
                  <span className="hidden text-sm sm:block">{c.icon}</span>
                  <span className="w-28 text-xs font-medium text-[#b0b0b0] truncate">{c.circuit}</span>
                  <div className="flex-1">
                    <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
                      <div
                        className="h-[4px] rounded-full bg-[#f59e0b]"
                        style={{ width: `${c.rate}%` }}
                      />
                    </div>
                  </div>
                  <span className="timing-number w-8 text-right text-xs font-bold text-[#f59e0b]">
                    {c.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DNF Rate */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#111] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-0.5 rounded-full bg-[#E10600]" />
              <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                DNF Rate by Team
              </span>
            </div>

            <div className="space-y-2">
              {DNF_RATE.map((d) => (
                <div key={d.team} className="flex items-center gap-3">
                  <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="w-20 text-xs font-medium text-[#b0b0b0]">{d.team}</span>
                  <div className="flex-1">
                    <div className="h-[4px] w-full rounded-full bg-[#1a1a1a]">
                      <div
                        className="h-[4px] rounded-full"
                        style={{ width: `${d.rate}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                  <span className="timing-number w-8 text-right text-xs font-bold text-[#737373]">
                    {d.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="rounded-lg border border-dashed border-[#1f1f1f] bg-[#0a0a0a] p-4 sm:p-5">
            <div className="flex h-full flex-col items-center justify-center py-8">
              <span className="font-display text-sm font-bold uppercase tracking-wider text-[#2a2a2a]">
                {t("circuitComparison")}
              </span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#1f1f1f]">
                Coming in Phase 1c
              </p>
              <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#E10600]/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
