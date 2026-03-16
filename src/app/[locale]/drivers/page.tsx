import { useTranslations } from "next-intl";

const DRIVERS = [
  { id: "russell", name: "George Russell", code: "RUS", team: "Mercedes", number: 63, pts: 51, wins: 2, podiums: 2, poles: 2, pos: 1, color: "#27F4D2" },
  { id: "antonelli", name: "Kimi Antonelli", code: "ANT", team: "Mercedes", number: 12, pts: 37, wins: 1, podiums: 2, poles: 0, pos: 2, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", team: "Ferrari", number: 16, pts: 31, wins: 0, podiums: 2, poles: 0, pos: 3, color: "#E80020" },
  { id: "norris", name: "Lando Norris", code: "NOR", team: "McLaren", number: 4, pts: 28, wins: 0, podiums: 1, poles: 0, pos: 4, color: "#FF8000" },
  { id: "verstappen", name: "Max Verstappen", code: "VER", team: "Red Bull", number: 1, pts: 25, wins: 0, podiums: 1, poles: 0, pos: 5, color: "#3671C6" },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", team: "Ferrari", number: 44, pts: 22, wins: 0, podiums: 1, poles: 0, pos: 6, color: "#E80020" },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", team: "McLaren", number: 81, pts: 20, wins: 0, podiums: 0, poles: 0, pos: 7, color: "#FF8000" },
  { id: "hulkenberg", name: "Nico Hülkenberg", code: "HUL", team: "Audi", number: 27, pts: 12, wins: 0, podiums: 0, poles: 0, pos: 8, color: "#00594F" },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", team: "Aston Martin", number: 14, pts: 10, wins: 0, podiums: 0, poles: 0, pos: 9, color: "#229971" },
  { id: "tsunoda", name: "Yuki Tsunoda", code: "TSU", team: "Red Bull", number: 22, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 10, color: "#3671C6" },
];

const maxPts = 51;

export default function DriversPage() {
  const t = useTranslations("driver");

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Championship</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {DRIVERS.map((d) => (
            <div key={d.id} className="f1-hover group relative overflow-hidden rounded border border-[#1c1c1c] bg-[#0f0f0f]">
              <div className="h-px w-full" style={{ backgroundColor: d.color }} />

              {/* Watermark number */}
              <div className="absolute -right-1 -top-3 select-none pointer-events-none">
                <span className="f1-display" style={{ fontSize: "5rem", color: d.color, opacity: 0.05, lineHeight: 1 }}>
                  {d.number}
                </span>
              </div>

              <div className="relative p-4">
                <div className="mb-3 flex items-start justify-between">
                  <span className={`f1-label rounded px-1.5 py-0.5 ${
                    d.pos <= 3 ? "bg-[#E10600] !text-white" : "bg-[#131313] !text-[#444]"
                  }`}>
                    P{d.pos}
                  </span>
                  <span className="f1-display" style={{ fontSize: "1.75rem", color: d.color, lineHeight: 1 }}>
                    {d.number}
                  </span>
                </div>

                <p className="f1-label-xs" style={{ color: "#444" }}>{d.team}</p>
                <p className="f1-display-md text-white mt-0.5">{d.name}</p>

                <div className="mt-3 h-[2px] w-full rounded-full bg-[#161616]">
                  <div className="h-[2px] rounded-full" style={{ width: `${(d.pts / maxPts) * 100}%`, backgroundColor: d.color }} />
                </div>

                <div className="mt-3 grid grid-cols-4 gap-1">
                  {[
                    { label: "PTS", value: d.pts },
                    { label: "WIN", value: d.wins },
                    { label: "POD", value: d.podiums },
                    { label: "POL", value: d.poles },
                  ].map((s) => (
                    <div key={s.label} className="f1-surface-inner p-1.5 text-center">
                      <p className="f1-label-xs">{s.label}</p>
                      <p className="f1-data text-sm text-white">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
