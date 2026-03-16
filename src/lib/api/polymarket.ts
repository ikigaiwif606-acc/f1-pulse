const BASE_URL = "https://clob.polymarket.com";
const GAMMA_URL = "https://gamma-api.polymarket.com";

async function fetchPolymarket<T>(url: string, path: string, params?: Record<string, string>): Promise<T> {
  const fullUrl = new URL(`${url}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => fullUrl.searchParams.set(k, v));
  }
  const res = await fetch(fullUrl.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Polymarket ${path}: ${res.status}`);
  return res.json();
}

// Gamma API — search and browse markets
export async function searchMarkets(query: string, limit = 20) {
  return fetchPolymarket(GAMMA_URL, "/markets", {
    tag: "f1",
    limit: String(limit),
  });
}

export async function getMarketBySlug(slug: string) {
  return fetchPolymarket(GAMMA_URL, "/markets", { slug });
}

// CLOB API — live pricing
export async function getMarketPrices(conditionId: string) {
  return fetchPolymarket(BASE_URL, "/prices", { market: conditionId });
}

export async function getOrderBook(conditionId: string) {
  return fetchPolymarket(BASE_URL, "/book", { market: conditionId });
}

// Connectivity test
export async function testConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${GAMMA_URL}/markets?limit=1`);
    return res.ok;
  } catch {
    return false;
  }
}
