"use client";

import useSWR from "swr";
import type { MarketsData, ChampionshipOddsItem } from "@/types";
import type { MarketsMeta } from "@/lib/data/markets";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface MarketsPayload {
  data: MarketsData;
  stale?: boolean;
  timestamp?: string;
}

// No fabricated client-side fallbacks (Pit Wall rule R-01): first paint uses
// server-fetched data passed down as `initial`; components without it render
// their honest empty/loading state until SWR resolves.
const EMPTY_MARKETS: MarketsData = { championship: [], raceWinner: [], props: [] };

function toPayload(initial?: MarketsMeta): MarketsPayload | undefined {
  return initial
    ? { data: initial.data, stale: initial.stale, timestamp: initial.timestamp }
    : undefined;
}

export function useMarkets(initial?: MarketsMeta) {
  const { data, error, isLoading } = useSWR<MarketsPayload>(
    "/api/markets",
    fetcher,
    {
      refreshInterval: 60_000,
      fallbackData: toPayload(initial),
      revalidateOnFocus: false,
    }
  );

  return {
    markets: data?.data || EMPTY_MARKETS,
    stale: data?.stale ?? true,
    timestamp: data?.timestamp,
    isLoading,
    isError: !!error,
  };
}

export function useChampionshipOdds(initial?: MarketsMeta) {
  const { data, error, isLoading } = useSWR<MarketsPayload>(
    "/api/markets?category=championship",
    fetcher,
    {
      refreshInterval: 60_000,
      fallbackData: toPayload(initial),
      revalidateOnFocus: false,
    }
  );

  // Extract championship odds from the market data
  const championshipMarket = data?.data?.championship?.find((m) =>
    m.question.toLowerCase().includes("driver")
  );

  const odds: ChampionshipOddsItem[] = championshipMarket
    ? championshipMarket.outcomes.map((o) => ({
        name: o.name,
        code: o.code,
        odds: o.price,
        volume: championshipMarket.volume,
        change: o.change24h ?? 0,
        color: o.color,
      }))
    : [];

  return {
    odds,
    stale: data?.stale ?? true,
    timestamp: data?.timestamp,
    isLoading,
    isError: !!error,
  };
}
