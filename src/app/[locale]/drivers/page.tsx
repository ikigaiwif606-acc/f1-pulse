import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { getDriversList } from "@/lib/data/drivers";
import type { DriverListItem } from "@/types";

export default async function DriversPage() {
  const drivers = await getDriversList();
  return <DriversPageContent drivers={drivers} />;
}

function DriversPageContent({ drivers }: { drivers: DriverListItem[] }) {
  const t = useTranslations("driver");
  const maxPts = drivers[0]?.pts || 1;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <span className="f1-label !text-[#E10600]">Championship</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("profile")}s</h1>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {drivers.map((d) => (
            <Link key={d.id} href={`/drivers/${d.id}` as "/"} className="f1-hover group relative overflow-hidden rounded border border-[#1c1c1c] bg-[#0f0f0f]">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
