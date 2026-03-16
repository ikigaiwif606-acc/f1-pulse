// Jolpica — community successor to the deprecated Ergast API (same schema)
const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function fetchErgast<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}.json`, { next: { revalidate: 3600 } });
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

// Connectivity test
export async function testConnection(): Promise<boolean> {
  try {
    await fetchErgast("/current");
    return true;
  } catch {
    return false;
  }
}
