// ── F1 Race Replay Data ─────────────────────────────────────────────────────
// Simulates the 2026 Australian GP (R1, Melbourne) for race replay visualization.

export interface ReplayDriver {
  code: string;
  name: string;
  team: string;
  color: string;
  number: number;
  gridPos: number;
  lapTimes: number[];   // seconds per lap (58 laps)
  pitLaps: number[];    // laps where pit stop occurs
  compound: string[];   // tire compound per stint: "S" | "M" | "H"
  dnfLap: number | null; // lap where DNF occurs, or null
}

export interface ReplayEvent {
  lap: number;
  time: number;         // cumulative seconds
  type: "overtake" | "pit" | "safety_car" | "dnf" | "fastest_lap" | "start";
  driverCode: string;
  description: string;
}

export interface DriverFrame {
  code: string;
  name: string;
  color: string;
  team: string;
  number: number;
  position: number;     // race position 1-20
  lap: number;
  trackProgress: number; // 0-1 around the track
  compound: string;
  inPit: boolean;
  isOut: boolean;
  gap: string;          // gap to leader
  lastLap: string;      // last lap time
}

// ── Melbourne GP Track Outline ──────────────────────────────────────────────
// Simplified Albert Park circuit, normalized to 0-1000 viewBox.
// ~50 key points tracing the clockwise layout.
export const MELBOURNE_TRACK: [number, number][] = [
  // Start/finish straight (bottom)
  [420, 820], [480, 820], [540, 815], [600, 800], [650, 780],
  // Turn 1-2 complex (right side)
  [690, 750], [720, 710], [740, 660], [745, 610], [735, 560],
  // Back straight rising
  [720, 510], [700, 460], [680, 420], [660, 380],
  // Turn 3-4 (top right)
  [640, 340], [610, 310], [570, 290], [530, 280],
  // Turn 5-6 chicane
  [490, 275], [450, 270], [410, 260], [370, 240],
  // Long curve through lakeside (top)
  [330, 220], [290, 210], [250, 215], [220, 230],
  // Turn 9-10 (top left)
  [195, 260], [180, 290], [175, 330], [180, 370],
  // Down the left side
  [190, 420], [205, 470], [220, 520], [235, 560],
  // Turn 11-12 (left side)
  [245, 600], [250, 640], [248, 680], [240, 710],
  // Turn 13 hairpin
  [230, 740], [235, 760], [250, 775], [275, 780],
  // Run to final corners
  [310, 785], [340, 790], [370, 800], [390, 810],
  // Back to start
  [410, 818], [420, 820],
];

// ── Pit lane path (shortcut through infield) ────────────────────────────────
export const MELBOURNE_PIT: [number, number][] = [
  [420, 820], [430, 800], [440, 780], [445, 760], [440, 740],
  [430, 720], [420, 700], [400, 750], [390, 790], [400, 810], [420, 820],
];

// ── Generate race data ──────────────────────────────────────────────────────

const DRIVERS_DATA: Omit<ReplayDriver, "lapTimes">[] = [
  { code: "RUS", name: "Russell", team: "Mercedes", color: "#27F4D2", number: 63, gridPos: 1, pitLaps: [18, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "ANT", name: "Antonelli", team: "Mercedes", color: "#27F4D2", number: 12, gridPos: 2, pitLaps: [18, 36], compound: ["M", "H", "H"], dnfLap: null },
  { code: "LEC", name: "Leclerc", team: "Ferrari", color: "#E80020", number: 16, gridPos: 3, pitLaps: [14, 36], compound: ["S", "H", "M"], dnfLap: null },
  { code: "HAM", name: "Hamilton", team: "Ferrari", color: "#E80020", number: 44, gridPos: 4, pitLaps: [20, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "NOR", name: "Norris", team: "McLaren", color: "#FF8000", number: 4, gridPos: 5, pitLaps: [12, 34], compound: ["S", "M", "H"], dnfLap: null },
  { code: "VER", name: "Verstappen", team: "Red Bull", color: "#3671C6", number: 1, gridPos: 6, pitLaps: [16, 36], compound: ["M", "H", "M"], dnfLap: null },
  { code: "PIA", name: "Piastri", team: "McLaren", color: "#FF8000", number: 81, gridPos: 7, pitLaps: [14, 36], compound: ["S", "H", "M"], dnfLap: null },
  { code: "BEA", name: "Bearman", team: "Haas", color: "#B6BABD", number: 87, gridPos: 8, pitLaps: [18, 40], compound: ["M", "H", "H"], dnfLap: null },
  { code: "GAS", name: "Gasly", team: "Alpine", color: "#0093CC", number: 10, gridPos: 9, pitLaps: [16, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "LAW", name: "Lawson", team: "Racing Bulls", color: "#6692FF", number: 30, gridPos: 10, pitLaps: [18, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "HAD", name: "Hadjar", team: "Red Bull", color: "#3671C6", number: 20, gridPos: 11, pitLaps: [14, 36], compound: ["S", "H", "M"], dnfLap: null },
  { code: "SAI", name: "Sainz", team: "Williams", color: "#1868DB", number: 55, gridPos: 12, pitLaps: [18, 40], compound: ["M", "H", "H"], dnfLap: null },
  { code: "ALB", name: "Albon", team: "Williams", color: "#1868DB", number: 23, gridPos: 13, pitLaps: [16, 38], compound: ["M", "H", "H"], dnfLap: 42 },
  { code: "BOR", name: "Bortoleto", team: "Audi", color: "#00594F", number: 5, gridPos: 14, pitLaps: [18, 40], compound: ["M", "H", "H"], dnfLap: null },
  { code: "HUL", name: "Hulkenberg", team: "Audi", color: "#00594F", number: 27, gridPos: 15, pitLaps: [16, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "LIN", name: "Lindblad", team: "Racing Bulls", color: "#6692FF", number: 40, gridPos: 16, pitLaps: [14, 36], compound: ["S", "H", "M"], dnfLap: null },
  { code: "COL", name: "Colapinto", team: "Alpine", color: "#0093CC", number: 43, gridPos: 17, pitLaps: [18, 38], compound: ["M", "H", "H"], dnfLap: null },
  { code: "OCO", name: "Ocon", team: "Haas", color: "#B6BABD", number: 31, gridPos: 18, pitLaps: [16, 38], compound: ["M", "H", "H"], dnfLap: 28 },
  { code: "ALO", name: "Alonso", team: "Aston Martin", color: "#229971", number: 14, gridPos: 19, pitLaps: [18, 40], compound: ["M", "H", "H"], dnfLap: null },
  { code: "STR", name: "Stroll", team: "Aston Martin", color: "#229971", number: 18, gridPos: 20, pitLaps: [16, 38], compound: ["M", "H", "H"], dnfLap: null },
];

const TOTAL_LAPS = 58;
const BASE_LAP_TIME = 80.2; // seconds (Albert Park ~1:20)

function generateLapTimes(driver: typeof DRIVERS_DATA[number]): number[] {
  const laps: number[] = [];
  // Faster drivers have lower base times
  const skillOffset = (driver.gridPos - 1) * 0.15;
  const base = BASE_LAP_TIME + skillOffset;

  for (let i = 0; i < TOTAL_LAPS; i++) {
    const lap = i + 1;
    let time = base;

    // Lap 1 is slower (traffic, cold tires)
    if (lap === 1) time += 4.0 + Math.random() * 2;

    // Pit stop laps add ~22s
    if (driver.pitLaps.includes(lap)) time += 22.0;

    // Tire degradation within stint
    const lastPit = driver.pitLaps.filter(p => p < lap).sort((a, b) => b - a)[0] || 0;
    const stintLength = lap - lastPit;
    const currentCompoundIdx = driver.pitLaps.filter(p => p < lap).length;
    const compound = driver.compound[currentCompoundIdx] || "H";
    const degradation = compound === "S" ? 0.08 : compound === "M" ? 0.04 : 0.02;
    time += stintLength * degradation;

    // Random variation ±0.3s
    time += (Math.random() - 0.5) * 0.6;

    // DNF: driver stops
    if (driver.dnfLap !== null && lap > driver.dnfLap) time = 0;

    laps.push(Math.round(time * 1000) / 1000);
  }

  return laps;
}

// Pre-compute seeded random (deterministic from code)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function getReplayDrivers(): ReplayDriver[] {
  return DRIVERS_DATA.map(d => {
    const rng = seededRandom(d.number * 17 + d.gridPos * 31);
    const laps: number[] = [];
    const skillOffset = (d.gridPos - 1) * 0.15;
    const base = BASE_LAP_TIME + skillOffset;

    for (let i = 0; i < TOTAL_LAPS; i++) {
      const lap = i + 1;
      let time = base;
      if (lap === 1) time += 4.0 + rng() * 2;
      if (d.pitLaps.includes(lap)) time += 22.0;
      const lastPit = d.pitLaps.filter(p => p < lap).sort((a, b) => b - a)[0] || 0;
      const stintLength = lap - lastPit;
      const ci = d.pitLaps.filter(p => p < lap).length;
      const compound = d.compound[ci] || "H";
      const deg = compound === "S" ? 0.08 : compound === "M" ? 0.04 : 0.02;
      time += stintLength * deg;
      time += (rng() - 0.5) * 0.6;
      if (d.dnfLap !== null && lap > d.dnfLap) time = 0;
      laps.push(Math.round(time * 1000) / 1000);
    }

    return { ...d, lapTimes: laps };
  });
}

// ── Compute driver frames at a given race time ──────────────────────────────

export function computeFrames(drivers: ReplayDriver[], raceTime: number): DriverFrame[] {
  const frames: DriverFrame[] = [];

  for (const driver of drivers) {
    let cumTime = 0;
    let currentLap = 0;
    let lapStartTime = 0;

    // Find current lap
    for (let i = 0; i < driver.lapTimes.length; i++) {
      if (driver.lapTimes[i] === 0) break; // DNF
      if (cumTime + driver.lapTimes[i] > raceTime) {
        currentLap = i + 1;
        lapStartTime = cumTime;
        break;
      }
      cumTime += driver.lapTimes[i];
      if (i === driver.lapTimes.length - 1) {
        currentLap = TOTAL_LAPS; // finished
        lapStartTime = cumTime;
      }
    }

    const isOut = driver.dnfLap !== null && currentLap > driver.dnfLap;
    const finished = currentLap >= TOTAL_LAPS && cumTime <= raceTime;

    // Track progress (0-1)
    let trackProgress = 0;
    if (!isOut && !finished && currentLap > 0) {
      const lapTime = driver.lapTimes[currentLap - 1];
      if (lapTime > 0) {
        const elapsed = raceTime - lapStartTime;
        trackProgress = Math.min(elapsed / lapTime, 1);
        // If in pit (track progress 0.9-1.0 on pit lap), route through pit lane
      }
    } else if (finished) {
      trackProgress = 1;
    }

    const inPit = driver.pitLaps.includes(currentLap) && trackProgress > 0.88 && trackProgress < 0.98;

    // Current compound
    const completedPits = driver.pitLaps.filter(p => p < currentLap).length;
    const compound = driver.compound[completedPits] || driver.compound[driver.compound.length - 1];

    // Last lap time
    const lastLapIdx = currentLap - 2;
    const lastLap = lastLapIdx >= 0 && driver.lapTimes[lastLapIdx] > 0 && driver.lapTimes[lastLapIdx] < 120
      ? formatLapTime(driver.lapTimes[lastLapIdx])
      : "";

    frames.push({
      code: driver.code,
      name: driver.name,
      color: driver.color,
      team: driver.team,
      number: driver.number,
      position: 0, // computed after sorting
      lap: currentLap,
      trackProgress,
      compound,
      inPit,
      isOut,
      gap: "",
      lastLap,
    });
  }

  // Sort by progress: more laps + more progress = higher position
  frames.sort((a, b) => {
    if (a.isOut && !b.isOut) return 1;
    if (!a.isOut && b.isOut) return -1;
    if (a.lap !== b.lap) return b.lap - a.lap;
    return b.trackProgress - a.trackProgress;
  });

  // Assign positions and compute gaps
  const leader = frames[0];
  frames.forEach((f, i) => {
    f.position = i + 1;
    if (i === 0) {
      f.gap = "LEADER";
    } else if (f.isOut) {
      f.gap = "OUT";
    } else if (f.lap < leader.lap) {
      const lapDiff = leader.lap - f.lap;
      f.gap = `+${lapDiff} LAP${lapDiff > 1 ? "S" : ""}`;
    } else {
      // Approximate gap in seconds
      const gapSec = (leader.trackProgress - f.trackProgress) * BASE_LAP_TIME;
      f.gap = `+${Math.abs(gapSec).toFixed(1)}s`;
    }
  });

  return frames;
}

export function getTotalRaceTime(drivers: ReplayDriver[]): number {
  // Winner's total time
  const winner = drivers.reduce((best, d) => {
    const total = d.lapTimes.reduce((s, t) => s + (t > 0 ? t : 0), 0);
    return total > 0 && (best === 0 || total < best) ? total : best;
  }, 0);
  return winner;
}

export function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
  return `${secs.toFixed(3)}`;
}

export function formatRaceTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export { TOTAL_LAPS };
