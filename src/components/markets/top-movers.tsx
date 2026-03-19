"use client";

import { useEffect, useRef, useState } from "react";

interface Mover {
  name: string;
  code: string;
  market: string;
  oldPct: number;
  newPct: number;
  color: string;
}

function useCountUp(target: number, duration: number = 1200, delay: number = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

function MoverCard({ mover, index }: { mover: Mover; index: number }) {
  const change = mover.newPct - mover.oldPct;
  const isUp = change > 0;
  const absChange = Math.abs(change);
  const animatedChange = useCountUp(absChange, 1000, index * 120);
  const animatedNewPct = useCountUp(mover.newPct, 1400, index * 120);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  const glowColor = isUp ? "rgba(52, 211, 153, 0.12)" : "rgba(244, 63, 94, 0.12)";
  const borderGlow = isUp ? "rgba(52, 211, 153, 0.25)" : "rgba(244, 63, 94, 0.25)";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-700 ease-out cursor-pointer group
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      style={{
        background: "rgba(15, 15, 15, 0.6)",
        backdropFilter: "blur(12px)",
        borderColor: mounted ? borderGlow : "rgba(255,255,255,0.06)",
        borderLeftWidth: "2px",
        borderLeftColor: mover.color,
        boxShadow: mounted ? `0 0 24px ${glowColor}` : "none",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Hover lift */}
      <div className="transition-transform duration-300 ease-out group-hover:scale-[1.02] group-hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: "var(--text-ghost)" }}>
                {mover.code}
              </span>
              <span className="f1-body-sm font-semibold text-white truncate">{mover.name}</span>
            </div>
            <span className="f1-label-xs" style={{ color: "var(--text-ghost)" }}>{mover.market}</span>
          </div>
        </div>

        {/* Change value + range */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {/* Animated arrow */}
            <span
              className={`inline-block transition-transform duration-500 ${isUp ? "text-emerald-400" : "text-rose-500"}`}
              style={{
                transform: mounted ? "translateY(0)" : `translateY(${isUp ? "8px" : "-8px"})`,
                transitionDelay: `${index * 120 + 400}ms`,
              }}
            >
              {isUp ? "▲" : "▼"}
            </span>
            <span className={`font-mono text-xl tabular-nums font-bold ${isUp ? "text-emerald-400" : "text-rose-500"}`}>
              {isUp ? "+" : "-"}{animatedChange}%
            </span>
          </div>
          <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: "var(--text-ghost)" }}>
            {mover.oldPct}&rarr;{animatedNewPct}%
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="h-1 w-full rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[1400ms] ease-out"
            style={{
              width: mounted ? `${mover.newPct}%` : "0%",
              backgroundColor: isUp ? "#34d399" : "#f43f5e",
              transitionDelay: `${index * 120 + 200}ms`,
              boxShadow: `0 0 8px ${isUp ? "rgba(52,211,153,0.4)" : "rgba(244,63,94,0.4)"}`,
            }}
          />
        </div>
      </div>

      {/* Background pulse glow (on hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 30% 80%, ${glowColor}, transparent 70%)`,
        }}
      />
    </div>
  );
}

export function TopMovers({ movers }: { movers: Mover[] }) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {movers.map((m, i) => (
        <MoverCard key={m.name + m.market} mover={m} index={i} />
      ))}
    </div>
  );
}
