// ── Polymarket API Client ───────────────────────────────────────────────────
// Three public APIs, no auth required for read operations.

const GAMMA_BASE = "https://gamma-api.polymarket.com";
const CLOB_BASE = "https://clob.polymarket.com";

// ── Types ───────────────────────────────────────────────────────────────────

export interface GammaMarket {
  id: string;
  question: string;
  slug: string;
  outcomePrices: string;    // JSON string: "[0.57, 0.43]"
  volume: number;
  volume24hr: number;
  liquidity: number;
  startDate: string;
  endDate: string;
  closed: boolean;
  active: boolean;
  clobTokenIds: string;     // JSON string: '["token1","token2"]'
  outcomes: string;         // JSON string: '["Yes","No"]'
  bestBid: number;
  bestAsk: number;
  spread: number;
  lastTradePrice: number;
  openInterest: number;
  image: string;
  icon: string;
  groupItemTitle: string;
  tags: Array<{ slug: string }>;
}

export interface PricePoint {
  t: number;   // unix timestamp (seconds)
  p: number;   // price 0.00 to 1.00
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: string;
}

export interface ParsedOutcome {
  outcome: string;
  price: number;
  tokenId: string;
}

export interface LiquidityInfo {
  totalBid: number;
  totalAsk: number;
  total: number;
  spread: number;
  level: "high" | "medium" | "low";
}

// ── Fetch helpers ───────────────────────────────────────────────────────────

async function fetchGamma<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${GAMMA_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Gamma ${path}: ${res.status}`);
  return res.json();
}

async function fetchClob<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${CLOB_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`CLOB ${path}: ${res.status}`);
  return res.json();
}

// ── Gamma API (Market Discovery) ────────────────────────────────────────────

export async function getF1Markets(params?: {
  closed?: boolean;
  limit?: number;
  order?: string;
  ascending?: boolean;
}): Promise<GammaMarket[]> {
  return fetchGamma<GammaMarket[]>("/markets", {
    tag: "formula1",
    closed: String(params?.closed ?? false),
    limit: String(params?.limit ?? 100),
    ...(params?.order && { order: params.order }),
    ...(params?.ascending !== undefined && { ascending: String(params.ascending) }),
  });
}

export async function getMarketById(id: string): Promise<GammaMarket> {
  return fetchGamma<GammaMarket>(`/markets/${id}`);
}

export async function getEventById(id: string) {
  return fetchGamma(`/events/${id}`);
}

export async function searchMarkets(query: string, limit = 20): Promise<GammaMarket[]> {
  return fetchGamma<GammaMarket[]>("/markets", {
    tag: "formula1",
    limit: String(limit),
  });
}

// ── CLOB API (Prices, Order Book, History) ──────────────────────────────────

export async function getPrice(tokenId: string, side: "buy" | "sell" = "buy"): Promise<{ price: string }> {
  return fetchClob("/price", { token_id: tokenId, side });
}

export async function getMidpoint(tokenId: string): Promise<{ mid: string }> {
  return fetchClob("/midpoint", { token_id: tokenId });
}

export async function getOrderBook(tokenId: string): Promise<OrderBook> {
  return fetchClob<OrderBook>("/book", { token_id: tokenId });
}

export async function getPriceHistory(
  tokenId: string,
  interval: "1h" | "6h" | "1d" | "1w" | "1m" | "all" = "1w",
  fidelity: number = 60,
): Promise<{ history: PricePoint[] }> {
  return fetchClob("/prices-history", {
    market: tokenId,
    interval,
    fidelity: String(fidelity),
  });
}

export async function getPriceHistoryRange(
  tokenId: string,
  startTs: number,
  endTs: number,
  fidelity: number = 60,
): Promise<{ history: PricePoint[] }> {
  return fetchClob("/prices-history", {
    market: tokenId,
    startTs: String(startTs),
    endTs: String(endTs),
    fidelity: String(fidelity),
  });
}

export async function getSpread(tokenId: string): Promise<{ spread: string }> {
  return fetchClob("/spread", { token_id: tokenId });
}

// ── Derived Helpers ─────────────────────────────────────────────────────────

export function parseMarketOutcomes(market: GammaMarket): ParsedOutcome[] {
  try {
    const outcomes: string[] = JSON.parse(market.outcomes || "[]");
    const prices: string[] = JSON.parse(market.outcomePrices || "[]");
    const tokenIds: string[] = JSON.parse(market.clobTokenIds || "[]");
    return outcomes.map((outcome, i) => ({
      outcome,
      price: parseFloat(prices[i] || "0"),
      tokenId: tokenIds[i] || "",
    }));
  } catch {
    return [];
  }
}

export async function getLiquidityDepth(tokenId: string): Promise<LiquidityInfo> {
  try {
    const book = await getOrderBook(tokenId);
    const totalBid = book.bids.slice(0, 5).reduce((s, b) => s + parseFloat(b.size), 0);
    const totalAsk = book.asks.slice(0, 5).reduce((s, a) => s + parseFloat(a.size), 0);
    const spread = book.asks[0] && book.bids[0]
      ? parseFloat(book.asks[0].price) - parseFloat(book.bids[0].price)
      : 0;
    const total = totalBid + totalAsk;
    const level = total > 50000 ? "high" : total > 10000 ? "medium" : "low";
    return { totalBid, totalAsk, total, spread, level };
  } catch {
    return { totalBid: 0, totalAsk: 0, total: 0, spread: 0, level: "low" };
  }
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

export function formatSpread(spread: number): string {
  return `${Math.round(spread * 100)}¢`;
}

// ── Filter helpers ──────────────────────────────────────────────────────────

export function filterMarketsForRace(markets: GammaMarket[], raceName: string): GammaMarket[] {
  const keywords = raceName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  return markets.filter(m => {
    const q = m.question.toLowerCase();
    return keywords.some(k => q.includes(k));
  });
}

export function findChampionshipMarkets(markets: GammaMarket[]): {
  wdc: GammaMarket | null;
  wcc: GammaMarket | null;
} {
  const wdc = markets.find(m =>
    m.question.toLowerCase().includes("drivers") &&
    m.question.toLowerCase().includes("champion")
  ) ?? null;
  const wcc = markets.find(m =>
    m.question.toLowerCase().includes("constructors") &&
    m.question.toLowerCase().includes("champion")
  ) ?? null;
  return { wdc, wcc };
}

// ── Connectivity test ───────────────────────────────────────────────────────

export async function testConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${GAMMA_BASE}/markets?limit=1`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
