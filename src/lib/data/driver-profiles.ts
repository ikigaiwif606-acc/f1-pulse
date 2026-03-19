// ── 2026 F1 Driver Profile Data ───────────────────────────────────────────────
// Biographical, physical, and contract data for all 22 drivers on the 2026 grid.
// Sources: formula1.com, formulaonehistory.com, racingnews365.com, Wikipedia,
//          planetf1.com, the-race.com (cross-referenced March 2026)

export interface DriverProfile {
  id: string;
  name: string;
  code: string;
  number: number;
  dateOfBirth: string; // ISO format YYYY-MM-DD
  nationality: string;
  heightCm: number;
  weightKg: number;
  team: string;
  chassis: string;
  salaryMillionsUSD: number; // estimated annual base salary (excl. bonuses)
  // ── 2026 Season Performance (after R2) ───────────────────────
  dnfs: number;            // retirements this season
  bestFinish: number;      // best race finishing position
  avgGrid: number;         // average qualifying position
  avgFinish: number;       // average race finishing position
  h2hQuali: number;        // qualifying H2H wins vs teammate (out of races completed)
  h2hRace: number;         // race H2H wins vs teammate
  racesCompleted: number;  // number of races started this season
  // ── Career Stats ─────────────────────────────────────────────
  careerWins: number;      // all-time race wins
  careerPoles: number;     // all-time pole positions
  careerPodiums: number;   // all-time podium finishes
  championships: number;   // world driver championships
}

export const DRIVER_PROFILES: DriverProfile[] = [
  // ── Mercedes ─────────────────────────────────────────────────────────────────
  {
    id: "russell", name: "George Russell", code: "RUS", number: 63,
    dateOfBirth: "1998-02-15", nationality: "British",
    heightCm: 185, weightKg: 70, team: "Mercedes", chassis: "Mercedes W17",
    salaryMillionsUSD: 34,
    dnfs: 0, bestFinish: 1, avgGrid: 1.5, avgFinish: 1.5,
    h2hQuali: 2, h2hRace: 1, racesCompleted: 2,
    careerWins: 3, careerPoles: 3, careerPodiums: 18, championships: 0,
  },
  {
    id: "antonelli", name: "Andrea Kimi Antonelli", code: "ANT", number: 12,
    dateOfBirth: "2006-08-25", nationality: "Italian",
    heightCm: 172, weightKg: 70, team: "Mercedes", chassis: "Mercedes W17",
    salaryMillionsUSD: 2,
    dnfs: 0, bestFinish: 1, avgGrid: 2.0, avgFinish: 2.0,
    h2hQuali: 0, h2hRace: 1, racesCompleted: 2,
    careerWins: 1, careerPoles: 1, careerPodiums: 2, championships: 0,
  },

  // ── Ferrari ──────────────────────────────────────────────────────────────────
  {
    id: "leclerc", name: "Charles Leclerc", code: "LEC", number: 16,
    dateOfBirth: "1997-10-16", nationality: "Mon\u00E9gasque",
    heightCm: 180, weightKg: 68, team: "Ferrari", chassis: "Ferrari SF-26",
    salaryMillionsUSD: 34,
    dnfs: 0, bestFinish: 3, avgGrid: 4.0, avgFinish: 3.5,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 8, careerPoles: 26, careerPodiums: 40, championships: 0,
  },
  {
    id: "hamilton", name: "Lewis Hamilton", code: "HAM", number: 44,
    dateOfBirth: "1985-01-07", nationality: "British",
    heightCm: 174, weightKg: 73, team: "Ferrari", chassis: "Ferrari SF-26",
    salaryMillionsUSD: 60,
    dnfs: 0, bestFinish: 3, avgGrid: 5.0, avgFinish: 4.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 105, careerPoles: 104, careerPodiums: 202, championships: 7,
  },

  // ── Red Bull Racing ──────────────────────────────────────────────────────────
  {
    id: "verstappen", name: "Max Verstappen", code: "VER", number: 3,
    dateOfBirth: "1997-09-30", nationality: "Dutch",
    heightCm: 181, weightKg: 72, team: "Red Bull", chassis: "Red Bull RB22",
    salaryMillionsUSD: 70,
    dnfs: 0, bestFinish: 4, avgGrid: 6.0, avgFinish: 8.0,
    h2hQuali: 2, h2hRace: 1, racesCompleted: 2,
    careerWins: 63, careerPoles: 40, careerPodiums: 112, championships: 4,
  },
  {
    id: "hadjar", name: "Isack Hadjar", code: "HAD", number: 6,
    dateOfBirth: "2004-09-28", nationality: "French",
    heightCm: 167, weightKg: 65, team: "Red Bull", chassis: "Red Bull RB22",
    salaryMillionsUSD: 5,
    dnfs: 0, bestFinish: 8, avgGrid: 8.5, avgFinish: 9.0,
    h2hQuali: 0, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },

  // ── McLaren ──────────────────────────────────────────────────────────────────
  {
    id: "norris", name: "Lando Norris", code: "NOR", number: 1,
    dateOfBirth: "1999-11-13", nationality: "British",
    heightCm: 176, weightKg: 68, team: "McLaren", chassis: "McLaren MCL40",
    salaryMillionsUSD: 30,
    dnfs: 0, bestFinish: 4, avgGrid: 3.5, avgFinish: 6.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 4, careerPoles: 8, careerPodiums: 28, championships: 0,
  },
  {
    id: "piastri", name: "Oscar Piastri", code: "PIA", number: 81,
    dateOfBirth: "2001-04-06", nationality: "Australian",
    heightCm: 178, weightKg: 68, team: "McLaren", chassis: "McLaren MCL40",
    salaryMillionsUSD: 13,
    dnfs: 0, bestFinish: 7, avgGrid: 7.0, avgFinish: 10.5,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 2, careerPoles: 2, careerPodiums: 12, championships: 0,
  },

  // ── Aston Martin ─────────────────────────────────────────────────────────────
  {
    id: "alonso", name: "Fernando Alonso", code: "ALO", number: 14,
    dateOfBirth: "1981-07-29", nationality: "Spanish",
    heightCm: 171, weightKg: 68, team: "Aston Martin", chassis: "Aston Martin AMR26",
    salaryMillionsUSD: 20,
    dnfs: 0, bestFinish: 11, avgGrid: 14.0, avgFinish: 13.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 32, careerPoles: 22, careerPodiums: 106, championships: 2,
  },
  {
    id: "stroll", name: "Lance Stroll", code: "STR", number: 18,
    dateOfBirth: "1998-10-29", nationality: "Canadian",
    heightCm: 182, weightKg: 79, team: "Aston Martin", chassis: "Aston Martin AMR26",
    salaryMillionsUSD: 12,
    dnfs: 0, bestFinish: 12, avgGrid: 15.0, avgFinish: 14.5,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 1, careerPodiums: 3, championships: 0,
  },

  // ── Alpine ───────────────────────────────────────────────────────────────────
  {
    id: "gasly", name: "Pierre Gasly", code: "GAS", number: 10,
    dateOfBirth: "1996-02-07", nationality: "French",
    heightCm: 177, weightKg: 70, team: "Alpine F1 Team", chassis: "Alpine A526",
    salaryMillionsUSD: 12,
    dnfs: 0, bestFinish: 6, avgGrid: 9.0, avgFinish: 7.5,
    h2hQuali: 2, h2hRace: 2, racesCompleted: 2,
    careerWins: 1, careerPoles: 0, careerPodiums: 4, championships: 0,
  },
  {
    id: "colapinto", name: "Franco Colapinto", code: "COL", number: 43,
    dateOfBirth: "2003-05-27", nationality: "Argentine",
    heightCm: 175, weightKg: 71, team: "Alpine F1 Team", chassis: "Alpine A526",
    salaryMillionsUSD: 0.75,
    dnfs: 0, bestFinish: 10, avgGrid: 12.0, avgFinish: 12.0,
    h2hQuali: 0, h2hRace: 0, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },

  // ── Williams ─────────────────────────────────────────────────────────────────
  {
    id: "sainz", name: "Carlos Sainz", code: "SAI", number: 55,
    dateOfBirth: "1994-09-01", nationality: "Spanish",
    heightCm: 178, weightKg: 66, team: "Williams", chassis: "Williams FW48",
    salaryMillionsUSD: 13,
    dnfs: 0, bestFinish: 9, avgGrid: 11.0, avgFinish: 11.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 4, careerPoles: 6, careerPodiums: 25, championships: 0,
  },
  {
    id: "albon", name: "Alexander Albon", code: "ALB", number: 23,
    dateOfBirth: "1996-03-23", nationality: "Thai",
    heightCm: 186, weightKg: 66, team: "Williams", chassis: "Williams FW48",
    salaryMillionsUSD: 12,
    dnfs: 1, bestFinish: 11, avgGrid: 13.0, avgFinish: 14.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 2, championships: 0,
  },

  // ── Racing Bulls ─────────────────────────────────────────────────────────────
  {
    id: "lawson", name: "Liam Lawson", code: "LAW", number: 30,
    dateOfBirth: "2002-02-11", nationality: "New Zealander",
    heightCm: 174, weightKg: 72, team: "Racing Bulls", chassis: "Racing Bulls VCARB 03",
    salaryMillionsUSD: 1,
    dnfs: 0, bestFinish: 7, avgGrid: 10.0, avgFinish: 9.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },
  {
    id: "lindblad", name: "Arvid Lindblad", code: "LIN", number: 41,
    dateOfBirth: "2007-08-08", nationality: "British",
    heightCm: 174, weightKg: 68, team: "Racing Bulls", chassis: "Racing Bulls VCARB 03",
    salaryMillionsUSD: 0.75,
    dnfs: 0, bestFinish: 8, avgGrid: 11.5, avgFinish: 10.5,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },

  // ── Haas ─────────────────────────────────────────────────────────────────────
  {
    id: "bearman", name: "Oliver Bearman", code: "BEA", number: 87,
    dateOfBirth: "2005-05-08", nationality: "British",
    heightCm: 184, weightKg: 68, team: "Haas F1 Team", chassis: "Haas VF-26",
    salaryMillionsUSD: 1,
    dnfs: 0, bestFinish: 5, avgGrid: 8.5, avgFinish: 5.5,
    h2hQuali: 2, h2hRace: 2, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },
  {
    id: "ocon", name: "Esteban Ocon", code: "OCO", number: 31,
    dateOfBirth: "1996-09-17", nationality: "French",
    heightCm: 186, weightKg: 66, team: "Haas F1 Team", chassis: "Haas VF-26",
    salaryMillionsUSD: 7,
    dnfs: 1, bestFinish: 11, avgGrid: 10.5, avgFinish: 13.0,
    h2hQuali: 0, h2hRace: 0, racesCompleted: 2,
    careerWins: 1, careerPoles: 0, careerPodiums: 3, championships: 0,
  },

  // ── Audi (formerly Sauber) ───────────────────────────────────────────────────
  {
    id: "hulkenberg", name: "Nico H\u00FClkenberg", code: "HUL", number: 27,
    dateOfBirth: "1987-08-19", nationality: "German",
    heightCm: 184, weightKg: 78, team: "Audi", chassis: "Audi R26",
    salaryMillionsUSD: 7,
    dnfs: 0, bestFinish: 11, avgGrid: 12.5, avgFinish: 13.5,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 1, careerPodiums: 0, championships: 0,
  },
  {
    id: "bortoleto", name: "Gabriel Bortoleto", code: "BOR", number: 5,
    dateOfBirth: "2004-10-14", nationality: "Brazilian",
    heightCm: 184, weightKg: 71, team: "Audi", chassis: "Audi R26",
    salaryMillionsUSD: 2,
    dnfs: 0, bestFinish: 10, avgGrid: 13.0, avgFinish: 12.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 0, careerPoles: 0, careerPodiums: 0, championships: 0,
  },

  // ── Cadillac F1 Team ─────────────────────────────────────────────────────────
  {
    id: "bottas", name: "Valtteri Bottas", code: "BOT", number: 77,
    dateOfBirth: "1989-08-28", nationality: "Finnish",
    heightCm: 174, weightKg: 69, team: "Cadillac F1 Team", chassis: "Cadillac MAC-26",
    salaryMillionsUSD: 5,
    dnfs: 0, bestFinish: 10, avgGrid: 16.0, avgFinish: 15.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 10, careerPoles: 20, careerPodiums: 67, championships: 0,
  },
  {
    id: "perez", name: "Sergio P\u00E9rez", code: "PER", number: 11,
    dateOfBirth: "1990-01-26", nationality: "Mexican",
    heightCm: 174, weightKg: 63, team: "Cadillac F1 Team", chassis: "Cadillac MAC-26",
    salaryMillionsUSD: 8,
    dnfs: 1, bestFinish: 12, avgGrid: 17.0, avgFinish: 16.0,
    h2hQuali: 1, h2hRace: 1, racesCompleted: 2,
    careerWins: 6, careerPoles: 3, careerPodiums: 39, championships: 0,
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────────

/** Map of driver id → DriverProfile for O(1) lookups */
export const DRIVER_PROFILE_MAP: Record<string, DriverProfile> = Object.fromEntries(
  DRIVER_PROFILES.map((d) => [d.id, d])
);

/** Compute a driver's current age from their date of birth */
export function getDriverAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/** Get a driver profile by id, or null if not found */
export function getDriverProfile(id: string): DriverProfile | null {
  return DRIVER_PROFILE_MAP[id] ?? null;
}

// ── 2026 Chassis Names (team-level reference) ──────────────────────────────────

export const TEAM_CHASSIS_2026: Record<string, string> = {
  Mercedes: "Mercedes W17",
  Ferrari: "Ferrari SF-26",
  "Red Bull": "Red Bull RB22",
  McLaren: "McLaren MCL40",
  "Aston Martin": "Aston Martin AMR26",
  "Alpine F1 Team": "Alpine A526",
  Williams: "Williams FW48",
  "Racing Bulls": "Racing Bulls VCARB 03",
  "Haas F1 Team": "Haas VF-26",
  Audi: "Audi R26",
  "Cadillac F1 Team": "Cadillac MAC-26",
};
