const BASE_URL = "https://api.openf1.org/v1";

async function fetchOpenF1<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`OpenF1 ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getSessions(params?: Record<string, string>) {
  return fetchOpenF1("/sessions", params);
}

export async function getDrivers(params?: Record<string, string>) {
  return fetchOpenF1("/drivers", params);
}

export async function getPositions(params?: Record<string, string>) {
  return fetchOpenF1("/position", params);
}

export async function getLaps(params?: Record<string, string>) {
  return fetchOpenF1("/laps", params);
}

export async function getPitStops(params?: Record<string, string>) {
  return fetchOpenF1("/pit", params);
}

export async function getWeather(params?: Record<string, string>) {
  return fetchOpenF1("/weather", params);
}

export async function getStints(params?: Record<string, string>) {
  return fetchOpenF1("/stints", params);
}

export async function getChampionshipDrivers(params?: Record<string, string>) {
  return fetchOpenF1("/championship_drivers", params);
}

export async function getChampionshipTeams(params?: Record<string, string>) {
  return fetchOpenF1("/championship_teams", params);
}

// Connectivity test
export async function testConnection(): Promise<boolean> {
  try {
    await fetchOpenF1("/sessions", { session_key: "latest" });
    return true;
  } catch {
    return false;
  }
}
