"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkets } from "@/lib/hooks/use-markets";
import type { MarketsData } from "@/types";

export function MarketsContent() {
  const t = useTranslations("markets");
  const { markets, isLoading } = useMarkets();

  // Calculate total volume from all markets
  const totalVolume = (() => {
    const all = [...markets.championship, ...markets.raceWinner, ...markets.props];
    const totalM = all.reduce((sum, m) => {
      const num = parseFloat(m.volume.replace(/[$M,K]/g, ""));
      if (m.volume.includes("K")) return sum + num / 1000;
      return sum + num;
    }, 0);
    return `$${totalM.toFixed(1)}M+`;
  })();

  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="f1-label !text-[#E10600]">Polymarket</span>
          <h1 className="f1-display-lg text-white mt-0.5">{t("title")}</h1>
          <p className="f1-label mt-1">
            {t("liveOdds")} &middot; {t("updatedEvery60s")}
            {isLoading && <span className="ml-2 text-[#E10600]">{t("refreshing")}</span>}
          </p>
        </div>
        <div className="hidden items-center gap-1.5 rounded border border-[#1c1c1c] bg-[#0f0f0f] px-2.5 py-1 sm:flex">
          <span className="f1-label-xs">{t("totalVol")}</span>
          <span className="f1-data text-sm text-white">{totalVolume}</span>
        </div>
      </div>

      <Tabs defaultValue="championship">
        <TabsList className="mb-5 h-auto gap-1 rounded border border-[#1c1c1c] bg-[#0f0f0f] p-1">
          {(["championship", "raceWinner", "props"] as const).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="f1-label rounded px-3 py-1.5 data-[state=active]:bg-[#E10600] data-[state=active]:!text-white"
              style={{ fontSize: "0.625rem" }}
            >
              {t(key)}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.entries(markets) as [string, MarketsData["championship"]][]).map(
          ([key, categoryMarkets]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {categoryMarkets.map((market) => (
                <div key={market.question} className="f1-surface p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="f1-display-md text-white">{market.question}</h3>
                    <div className="flex gap-2">
                      <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                        {t("volume")} {market.volume}
                      </span>
                      <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
                        {t("ends")} {market.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {market.outcomes.map((o) => (
                      <div
                        key={o.name}
                        className="f1-transition flex items-center gap-3 f1-surface-inner p-2.5 hover:bg-[#0d0d0d]"
                      >
                        <div className="f1-team-bar h-5" style={{ backgroundColor: o.color }} />
                        <span className="f1-data w-8 text-[0.625rem]" style={{ color: "#444" }}>
                          {o.code}
                        </span>
                        <span className="f1-body-sm flex-1 font-semibold text-white">{o.name}</span>

                        <div className="hidden w-32 sm:block">
                          <div className="h-[3px] w-full rounded-full bg-[#161616]">
                            <div
                              className="h-[3px] rounded-full"
                              style={{ width: `${o.price * 100}%`, backgroundColor: o.color }}
                            />
                          </div>
                        </div>

                        <div className="w-14 rounded border border-[#1c1c1c] bg-[#0f0f0f] py-1 text-center">
                          <span className="f1-data text-sm text-white">
                            {(o.price * 100).toFixed(0)}
                          </span>
                          <span className="f1-label-xs ml-px">%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#131313] pt-3">
                    <span className="f1-label-xs" style={{ color: "#2a2a2a" }}>
                      {t("lastUpdated")}: {isLoading ? t("refreshing") : t("justNow")}
                    </span>
                    <a
                      href="https://polymarket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="f1-transition f1-label !text-[#E10600] hover:opacity-70"
                    >
                      {t("betOn")} &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </TabsContent>
          )
        )}
      </Tabs>
    </>
  );
}
