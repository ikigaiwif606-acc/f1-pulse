const BASE_URL = "https://api.openweathermap.org/data/2.5";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";

async function fetchWeather<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Weather ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getForecast(lat: number, lon: number) {
  return fetchWeather("/forecast", {
    lat: String(lat),
    lon: String(lon),
  });
}

export async function getCurrentWeather(lat: number, lon: number) {
  return fetchWeather("/weather", {
    lat: String(lat),
    lon: String(lon),
  });
}

// Connectivity test
export async function testConnection(): Promise<boolean> {
  if (!API_KEY) return false;
  try {
    // London coordinates as a simple test
    await getCurrentWeather(51.5, -0.1);
    return true;
  } catch {
    return false;
  }
}
