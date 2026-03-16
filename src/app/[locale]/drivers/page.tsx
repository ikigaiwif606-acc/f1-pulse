import { useTranslations } from "next-intl";

const DRIVERS = [
  { id: "russell", name: "George Russell", code: "RUS", team: "Mercedes", number: 63, pts: 51, wins: 2, podiums: 2, poles: 2, pos: 1, color: "#27F4D2" },
  { id: "antonelli", name: "Kimi Antonelli", code: "ANT", team: "Mercedes", number: 12, pts: 37, wins: 1, podiums: 2, poles: 0, pos: 2, color: "#27F4D2" },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", team: "Ferrari", number: 16, pts: 31, wins: 0, podiums: 2, poles: 0, pos: 3, color: "#E80020" },
  { id: "norris", name: "Lando Norris", code: "NOR", team: "McLaren", number: 4, pts: 28, wins: 0, podiums: 1, poles: 0, pos: 4, color: "#FF8000" },
  { id: "verstappen", name: "Max Verstappen", code: "VER", team: "Red Bull Racing", number: 1, pts: 25, wins: 0, podiums: 1, poles: 0, pos: 5, color: "#3671C6" },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", team: "Ferrari", number: 44, pts: 22, wins: 0, podiums: 1, poles: 0, pos: 6, color: "#E80020" },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", team: "McLaren", number: 81, pts: 20, wins: 0, podiums: 0, poles: 0, pos: 7, color: "#FF8000" },
  { id: "hulkenberg", name: "Nico Hülkenberg", code: "HUL", team: "Audi", number: 27, pts: 12, wins: 0, podiums: 0, poles: 0, pos: 8, color: "#00594F" },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", team: "Aston Martin", number: 14, pts: 10, wins: 0, podiums: 0, poles: 0, pos: 9, color: "#229971" },
  { id: "tsunoda", name: "Yuki Tsunoda", code: "TSU", team: "Red Bull Racing", number: 22, pts: 8, wins: 0, podiums: 0, poles: 0, pos: 10, color: "#3671C6" },
];

const maxPts = 51;

export default function DriversPage() {
  const t = useTranslations("driver");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#E10600]">
            Championship
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {t("profile")}s
          </h1>
        </div>

        {/* Driver grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {DRIVERS.map((driver) => (
            <div
              key={driver.id}
              className="group relative overflow-hidden rounded-lg border border-[#1f1f1f] bg-[#111] transition-all hover:border-[#2a2a2a]"
            >
              {/* Team color top stripe */}
              <div className="h-[2px] w-full" style={{ backgroundColor: driver.color }} />

              {/* Large background number */}
              <div className="absolute -right-2 -top-2 select-none">
                <span
                  className="font-display text-[80px] font-bold leading-none"
                  style={{ color: driver.color, opacity: 0.06 }}
                >
                  {driver.number}
                </span>
              </div>

              <div className="relative p-4">
                {/* Position + Number */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <span className={`inline-flex h-5 items-center justify-center rounded px-1.5 text-[10px] font-bold ${
                      driver.pos <= 3
                        ? "bg-[#E10600] text-white"
                        : "bg-[#1a1a1a] text-[#4a4a4a]"
                    }`}>
                      P{driver.pos}
                    </span>
                  </div>
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    style={{ color: driver.color }}
                  >
                    {driver.number}
                  </span>
                </div>

                {/* Name */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                  {driver.team}
                </p>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  {driver.name}
                </p>

                {/* Points bar */}
                <div className="mt-3 mb-3">
                  <div className="h-[3px] w-full rounded-full bg-[#1a1a1a]">
                    <div
                      className="h-[3px] rounded-full"
                      style={{ width: `${(driver.pts / maxPts) * 100}%`, backgroundColor: driver.color }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { label: "PTS", value: driver.pts },
                    { label: "WIN", value: driver.wins },
                    { label: "POD", value: driver.podiums },
                    { label: "POL", value: driver.poles },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded bg-[#0a0a0a] p-1.5 text-center">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-[#3a3a3a]">
                        {stat.label}
                      </p>
                      <p className="timing-number text-sm font-bold text-white">
                        {stat.value}
                      </p>
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
