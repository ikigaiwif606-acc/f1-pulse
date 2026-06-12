// Jolpica — community successor to the deprecated Ergast API (same schema)
const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchErgast<T>(
  path: string,
  opts?: { revalidate?: number; limit?: number; offset?: number }
): Promise<T> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.offset) params.set("offset", String(opts.offset));
  const query = params.size > 0 ? `?${params}` : "";
  const res = await fetch(`${BASE_URL}${path}.json${query}`, {
    next: { revalidate: opts?.revalidate ?? 3600 },
    signal: AbortSignal.timeout(8000), // 8s timeout to prevent hanging
  });
  if (!res.ok) throw new Error(`Ergast ${path}: ${res.status}`);
  return res.json();
}

// Jolpica hard-caps `limit` at 100 — season-wide result sets must be paginated
// and merged (a round's rows can straddle a page boundary).
const PAGE = 100;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchErgastAllRaces(
  path: string,
  listKey: "Results" | "QualifyingResults" | "SprintResults",
  revalidate: number
): Promise<any> {
  const first: any = await fetchErgast(path, { revalidate, limit: PAGE });
  const total = parseInt(first?.MRData?.total || "0", 10);
  const byRound = new Map<string, any>(
    (first?.MRData?.RaceTable?.Races || []).map((r: any) => [r.round, r])
  );
  for (let offset = PAGE; offset < total; offset += PAGE) {
    const page: any = await fetchErgast(path, { revalidate, limit: PAGE, offset });
    for (const r of page?.MRData?.RaceTable?.Races || []) {
      const existing = byRound.get(r.round);
      if (existing) {
        existing[listKey] = [...(existing[listKey] || []), ...(r[listKey] || [])];
      } else {
        byRound.set(r.round, r);
      }
    }
  }
  first.MRData.RaceTable.Races = [...byRound.values()].sort(
    (a, b) => parseInt(a.round, 10) - parseInt(b.round, 10)
  );
  return first;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getSeasonResults(season: number) {
  return fetchErgast(`/${season}/results`);
}

export async function getQualifyingResults(season: number) {
  return fetchErgastAllRaces(`/${season}/qualifying`, "QualifyingResults", 1800);
}

export async function getDriverStandings(season: number) {
  return fetchErgast(`/${season}/driverStandings`);
}

export async function getConstructorStandings(season: number) {
  return fetchErgast(`/${season}/constructorStandings`);
}

export async function getCircuitInfo(circuitId: string) {
  return fetchErgast(`/circuits/${circuitId}`);
}

export async function getRaceResultsByCircuit(circuitId: string) {
  return fetchErgast(`/circuits/${circuitId}/results`);
}

export async function getDriverInfo(driverId: string) {
  return fetchErgast(`/drivers/${driverId}`);
}

export async function getSeasonSchedule(season: number) {
  return fetchErgast(`/${season}`, { limit: 50 });
}

/** Winner of every completed round in a season (one result per race). */
export async function getSeasonWinners(season: number) {
  return fetchErgast(`/${season}/results/1`, { revalidate: 900, limit: 50 });
}

/** All race results for a season (paginated) — points progression, H2H, DNF stats. */
export async function getSeasonResultsFull(season: number) {
  return fetchErgastAllRaces(`/${season}/results`, "Results", 1800);
}

export async function getRoundResults(season: number, round: number) {
  return fetchErgast(`/${season}/${round}/results`);
}

export async function getRoundQualifying(season: number, round: number) {
  return fetchErgast(`/${season}/${round}/qualifying`);
}

export async function getDriverSeasonResults(season: number, driverId: string) {
  return fetchErgast(`/${season}/drivers/${driverId}/results`);
}

export async function getDriverQualifying(season: number, driverId: string) {
  return fetchErgast(`/${season}/drivers/${driverId}/qualifying`);
}

export async function getConstructorSeasonResults(season: number, constructorId: string) {
  return fetchErgast(`/${season}/constructors/${constructorId}/results`);
}

export async function getCircuitWinners(circuitId: string) {
  return fetchErgast(`/circuits/${circuitId}/results/1`);
}

// Connectivity test
export async function testConnection(): Promise<boolean> {
  try {
    await fetchErgast("/current");
    return true;
  } catch {
    return false;
  }
}
