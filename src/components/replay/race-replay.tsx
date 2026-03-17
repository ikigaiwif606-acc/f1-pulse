"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  MELBOURNE_TRACK,
  getReplayDrivers,
  computeFrames,
  getTotalRaceTime,
  formatRaceTime,
  TOTAL_LAPS,
  type DriverFrame,
  type ReplayDriver,
} from "@/lib/data/replay";

// ── Track geometry helpers ──────────────────────────────────────────────────

function getTrackPath(points: [number, number][]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
}

function getPointOnTrack(progress: number, points: [number, number][]): [number, number] {
  const total = points.length - 1;
  const idx = progress * total;
  const floor = Math.floor(idx);
  const ceil = Math.min(floor + 1, total);
  const t = idx - floor;

  const x = points[floor][0] + (points[ceil][0] - points[floor][0]) * t;
  const y = points[floor][1] + (points[ceil][1] - points[floor][1]) * t;
  return [x, y];
}

// ── Compound colors ─────────────────────────────────────────────────────────
const COMPOUND_COLORS: Record<string, string> = {
  S: "#E10600",
  M: "#f59e0b",
  H: "#ededed",
};

// ── Speed options ───────────────────────────────────────────────────────────
const SPEEDS = [1, 2, 5, 10, 20, 50];

export function RaceReplay() {
  const t = useTranslations("replay");

  // Data
  const drivers = useMemo(() => getReplayDrivers(), []);
  const totalTime = useMemo(() => getTotalRaceTime(drivers), [drivers]);

  // State
  const [raceTime, setRaceTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2); // default 5x
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const speed = SPEEDS[speedIdx];
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Computed frames
  const frames = useMemo(() => computeFrames(drivers, raceTime), [drivers, raceTime]);
  const currentLap = frames.length > 0 ? frames[0].lap : 0;

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000; // real seconds
    lastTimeRef.current = timestamp;

    setRaceTime((prev) => {
      const next = prev + delta * speed;
      if (next >= totalTime) {
        setIsPlaying(false);
        return totalTime;
      }
      return next;
    });

    animRef.current = requestAnimationFrame(animate);
  }, [speed, totalTime]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, animate]);

  // Controls
  const togglePlay = () => setIsPlaying((p) => !p);
  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  const seek = (pct: number) => {
    setRaceTime(pct * totalTime);
    lastTimeRef.current = 0;
  };
  const skipForward = () => setRaceTime((t) => Math.min(t + 30 * speed, totalTime));
  const skipBack = () => setRaceTime((t) => Math.max(t - 30 * speed, 0));

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight") skipForward();
      if (e.key === "ArrowLeft") skipBack();
      if (e.key === "l") setShowLabels((p) => !p);
      if (e.key === "s") cycleSpeed();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const selectedFrame = selectedDriver ? frames.find((f) => f.code === selectedDriver) : null;

  return (
    <div className="space-y-4">
      {/* ── Track Map ── */}
      <div className="f1-surface overflow-hidden relative">
        <svg viewBox="100 180 700 680" className="w-full h-auto" style={{ maxHeight: "500px" }}>
          {/* Background */}
          <rect x="100" y="180" width="700" height="680" fill="#080808" />

          {/* Track outline */}
          <path
            d={getTrackPath(MELBOURNE_TRACK)}
            fill="none"
            stroke="#1c1c1c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={getTrackPath(MELBOURNE_TRACK)}
            fill="none"
            stroke="#161616"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start/finish line */}
          <line x1="420" y1="808" x2="420" y2="832" stroke="#E10600" strokeWidth="2" />

          {/* Driver dots */}
          {frames.map((frame) => {
            if (frame.isOut) return null;
            const [x, y] = getPointOnTrack(frame.trackProgress, MELBOURNE_TRACK);
            const isSelected = frame.code === selectedDriver;
            const r = isSelected ? 8 : 5;

            return (
              <g
                key={frame.code}
                onClick={() => setSelectedDriver(frame.code === selectedDriver ? null : frame.code)}
                className="cursor-pointer"
              >
                {/* Glow for selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r={14} fill={frame.color} opacity={0.15} />
                )}
                {/* Position number background */}
                <circle cx={x} cy={y} r={r} fill={frame.color} stroke="#080808" strokeWidth={1.5} />
                {/* Label */}
                {showLabels && (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fill={frame.color}
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                  >
                    {frame.code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Lap counter overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="rounded border border-[#1c1c1c] bg-[#080808]/90 px-3 py-1.5">
            <span className="f1-label-xs">{t("lap")}</span>
            <span className="f1-data text-sm text-white ml-1.5">{currentLap}<span style={{ color: "var(--text-dim)" }}>/{TOTAL_LAPS}</span></span>
          </div>
          <div className="rounded border border-[#1c1c1c] bg-[#080808]/90 px-3 py-1.5">
            <span className="f1-data text-sm text-white">{formatRaceTime(raceTime)}</span>
          </div>
        </div>

        {/* Speed badge */}
        <div className="absolute top-3 right-3 rounded border border-[#1c1c1c] bg-[#080808]/90 px-3 py-1.5">
          <span className="f1-data text-sm" style={{ color: "#E10600" }}>{speed}x</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="f1-surface p-4">
        <div className="flex items-center gap-3">
          {/* Skip back */}
          <button onClick={skipBack} className="f1-transition rounded p-2 hover:bg-[#161616]" aria-label="Skip back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L4 8L10 4" stroke="#ededed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="4" x2="3" y2="12" stroke="#ededed" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="f1-transition flex h-10 w-10 items-center justify-center rounded-full bg-[#E10600] hover:bg-[#ff1a0e]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1" width="3.5" height="12" rx="1" fill="white"/>
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="white"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="white"/>
              </svg>
            )}
          </button>

          {/* Skip forward */}
          <button onClick={skipForward} className="f1-transition rounded p-2 hover:bg-[#161616]" aria-label="Skip forward">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L12 8L6 12" stroke="#ededed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="13" y1="4" x2="13" y2="12" stroke="#ededed" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Speed */}
          <button onClick={cycleSpeed} className="f1-transition f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2.5 py-1.5 hover:border-[#E10600]/30">
            {speed}x
          </button>

          {/* Progress bar */}
          <div className="flex-1 mx-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={totalTime > 0 ? raceTime / totalTime : 0}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1 appearance-none bg-[#1c1c1c] rounded-full cursor-pointer accent-[#E10600]"
              aria-label="Race progress"
            />
          </div>

          {/* Labels toggle */}
          <button
            onClick={() => setShowLabels((p) => !p)}
            className={`f1-transition f1-label rounded border px-2.5 py-1.5 ${showLabels ? "border-[#E10600]/30 !text-[#E10600]" : "border-[#1c1c1c] bg-[#0a0a0a]"}`}
          >
            {t("labels")}
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-2 flex flex-wrap gap-3">
          {[
            { key: "Space", action: t("playPause") },
            { key: "←→", action: t("seek") },
            { key: "S", action: t("speed") },
            { key: "L", action: t("labels") },
          ].map((h) => (
            <div key={h.key} className="flex items-center gap-1">
              <kbd className="rounded border border-[#1c1c1c] bg-[#0a0a0a] px-1.5 py-0.5 f1-data text-[0.5rem] text-white">{h.key}</kbd>
              <span className="f1-label-xs">{h.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Leaderboard ── */}
      <div className="f1-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="f1-accent-bar" />
            <span className="f1-heading text-white">{t("leaderboard")}</span>
          </div>
          <span className="f1-label rounded border border-[#1c1c1c] bg-[#0a0a0a] px-2 py-0.5">
            {t("lap")} {currentLap}/{TOTAL_LAPS}
          </span>
        </div>

        <div className="space-y-0.5">
          {frames.map((f) => (
            <div
              key={f.code}
              onClick={() => setSelectedDriver(f.code === selectedDriver ? null : f.code)}
              className={`f1-transition flex items-center gap-2 px-2.5 py-2 rounded cursor-pointer ${
                f.code === selectedDriver
                  ? "bg-[#E10600]/5 border border-[#E10600]/20"
                  : "f1-surface-inner hover:bg-[#0d0d0d]"
              } ${f.isOut ? "opacity-40" : ""}`}
            >
              {/* Position */}
              <span className={`f1-data w-5 text-center text-xs ${
                f.position === 1 ? "text-[#E10600]" : f.position <= 3 ? "text-white" : ""
              }`} style={f.position > 3 ? { color: "var(--text-dim)" } : undefined}>
                {f.position}
              </span>

              {/* Team color bar */}
              <div className="f1-team-bar h-5" style={{ backgroundColor: f.color }} />

              {/* Driver code */}
              <span className="f1-data w-8 text-xs font-bold" style={{ color: f.color }}>{f.code}</span>

              {/* Name */}
              <span className={`f1-body-sm flex-1 ${f.isOut ? "line-through" : "text-white"}`}>
                {f.name}
              </span>

              {/* Tire compound */}
              <span
                className="f1-label-xs rounded px-1 py-0.5 font-bold"
                style={{
                  backgroundColor: `${COMPOUND_COLORS[f.compound] || "#666"}20`,
                  color: COMPOUND_COLORS[f.compound] || "#666",
                }}
              >
                {f.compound}
              </span>

              {/* Last lap */}
              <span className="f1-data hidden w-16 text-right text-[0.625rem] sm:block" style={{ color: "var(--text-dim)" }}>
                {f.lastLap}
              </span>

              {/* Gap */}
              <span className={`f1-data w-16 text-right text-xs ${
                f.gap === "LEADER" ? "text-[#E10600]" : f.gap === "OUT" ? "text-[#555]" : ""
              }`} style={f.gap !== "LEADER" && f.gap !== "OUT" ? { color: "var(--text-muted)" } : undefined}>
                {f.gap}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Selected driver detail ── */}
      {selectedFrame && (
        <div className="f1-surface f1-corner-accent p-5 animate-fade-up" style={{ animationDuration: "0.2s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="f1-team-bar h-8" style={{ backgroundColor: selectedFrame.color }} />
            <div>
              <span className="f1-display-md text-white">{selectedFrame.name}</span>
              <span className="f1-data text-xs ml-2" style={{ color: selectedFrame.color }}>#{frames.find(f => f.code === selectedFrame.code)?.number}</span>
            </div>
            <span className="f1-label" style={{ color: selectedFrame.color }}>{selectedFrame.team}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: t("position"), value: `P${selectedFrame.position}` },
              { label: t("lap"), value: `${selectedFrame.lap}/${TOTAL_LAPS}` },
              { label: t("gap"), value: selectedFrame.gap },
              { label: t("tire"), value: selectedFrame.compound },
              { label: t("lastLap"), value: selectedFrame.lastLap || "—" },
            ].map((s) => (
              <div key={s.label} className="f1-surface-inner p-2.5 rounded text-center">
                <p className="f1-label-xs mb-1">{s.label}</p>
                <p className="f1-data text-sm text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
