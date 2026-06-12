// Jolpica — community successor to the deprecated Ergast API (same schema)
const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchErgast<T>(path: string, opts?: { revalidate?: number; limit?: number }): Promise<T> {
  const query = opts?.limit ? `?limit=${opts.limit}` : "";
  const res = await fetch(`${BASE_URL}${path}.json${query}`, {
    next: { revalidate: opts?.revalidate ?? 3600 },
    signal: AbortSignal.timeout(8000), // 8s timeout to prevent hanging
  });
  if (!res.ok) throw new Error(`Ergast ${path}: ${res.status}`);
  return res.json();
}

export async function getSeasonResults(season: number) {
  return fetchErgast(`/${season}/results`);
}

export async function getQualifyingResults(season: number) {
  return fetchErgast(`/${season}/qualifying`);
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

/** All race results for a season — used for points-progression charts. */
export async function getSeasonResultsFull(season: number) {
  return fetchErgast(`/${season}/results`, { revalidate: 1800, limit: 1000 });
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
