import { LiquidityBadge } from "./liquidity-badge";
import type { ParsedOutcome, LiquidityInfo } from "@/lib/api/polymarket";

interface MarketCardProps {
  question: string;
  outcomes: ParsedOutcome[];
  volume: number;
  volume24hr: number;
  openInterest: number;
  liquidity?: LiquidityInfo;
  spread: number;
  marketUrl: string;
  compact?: boolean;
}

function formatVol(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

export function MarketCard({
  question,
  outcomes,
  volume,
  volume24hr,
  openInterest,
  liquidity,
  spread,
  marketUrl,
  compact = false,
}: MarketCardProps) {
  const isBinary = outcomes.length === 2 && outcomes.some(o => o.outcome === "Yes");

  return (
    <div className="f1-surface p-4 f1-transition hover:border-[#333]">
      {/* Question */}
      <h4 className="f1-body-sm font-semibold text-white mb-3">{question}</h4>

      {/* Outcomes */}
      <div className="space-y-1.5 mb-3">
        {outcomes.slice(0, compact ? 3 : 8).map((o) => (
          <div key={o.outcome} className="flex items-center gap-2">
            <span className="f1-body-sm flex-1 truncate" style={{ color: "var(--text-muted)" }}>
              {o.outcome}
            </span>
            <div className="w-16">
              <div className="h-[3px] w-full rounded-full bg-[#161616]">
                <div
                  className="h-[3px] rounded-full bg-[#E10600]"
                  style={{ width: `${o.price * 100}%` }}
                />
              </div>
            </div>
            <span className="f1-data text-xs text-white w-10 text-right">
              {(o.price * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[#1c1c1c] pt-2">
        <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>
          Vol {formatVol(volume)}
        </span>
        {volume24hr > 0 && (
          <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>
            24h {formatVol(volume24hr)}
          </span>
        )}
        {spread > 0 && (
          <span className="f1-label-xs" style={{ color: "var(--text-dim)" }}>
            Spread {Math.round(spread * 100)}¢
          </span>
        )}
        {liquidity && <LiquidityBadge level={liquidity.level} />}
        <a
          href={marketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="f1-transition f1-label-xs !text-[#E10600] hover:opacity-70 ml-auto"
        >
          Trade &rarr;
        </a>
      </div>
    </div>
  );
}
