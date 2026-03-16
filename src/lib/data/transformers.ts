// Pure transform functions for API responses

export const TEAM_COLORS: Record<string, string> = {
  Mercedes: "#27F4D2",
  "Mercedes-AMG Petronas": "#27F4D2",
  Ferrari: "#E80020",
  "Scuderia Ferrari": "#E80020",
  McLaren: "#FF8000",
  "McLaren F1 Team": "#FF8000",
  "Red Bull": "#3671C6",
  "Red Bull Racing": "#3671C6",
  "Oracle Red Bull Racing": "#3671C6",
  "Aston Martin": "#229971",
  "Aston Martin Aramco": "#229971",
  Audi: "#00594F",
  "Audi F1 Team": "#00594F",
  "Kick Sauber": "#00594F",
  Alpine: "#0093CC",
  "Alpine F1 Team": "#0093CC",
  Haas: "#B6BABD",
  "MoneyGram Haas F1": "#B6BABD",
  "Haas F1 Team": "#B6BABD",
  Williams: "#1868DB",
  "Williams Racing": "#1868DB",
  Cadillac: "#C0C0C0",
  "Cadillac F1 Team": "#C0C0C0",
  RB: "#6692FF",
  "Racing Bulls": "#6692FF",
  "Visa Cash App RB": "#6692FF",
};

const DRIVER_CODES: Record<string, string> = {
  russell: "RUS",
  antonelli: "ANT",
  leclerc: "LEC",
  norris: "NOR",
  verstappen: "VER",
  hamilton: "HAM",
  piastri: "PIA",
  hulkenberg: "HUL",
  alonso: "ALO",
  tsunoda: "TSU",
  gasly: "GAS",
  ocon: "OCO",
  stroll: "STR",
  albon: "ALB",
  sainz: "SAI",
  bearman: "BEA",
  doohan: "DOO",
  bortoleto: "BOR",
};

/** "Japanese Grand Prix" → "japanese-gp" */
export function deriveSlug(name: string): string {
  return name
    .replace(/Grand Prix$/i, "GP")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** Resolve a team color from a team name string */
export function getTeamColor(teamName: string): string {
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (teamName.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "#666";
}

/** Get driver code from last name */
export function getDriverCode(lastName: string): string {
  const key = lastName.toLowerCase().replace(/\s+/g, "");
  return DRIVER_CODES[key] || lastName.slice(0, 3).toUpperCase();
}

/** Format a date string into display format like "MAR 06" */
export function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Transform OpenF1 session data into RaceListItem[].
 * OpenF1 sessions are individual session objects; we group by meeting/round.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformOpenF1Sessions(sessions: any[]): import("@/types").RaceListItem[] {
  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) return [];

  // Group sessions by meeting_key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byMeeting = new Map<number, any[]>();
  for (const s of sessions) {
    const key = s.meeting_key;
    if (!byMeeting.has(key)) byMeeting.set(key, []);
    byMeeting.get(key)!.push(s);
  }

  const now = new Date();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const races: any[] = [];
  let round = 0;

  for (const [, meetingSessions] of byMeeting) {
    round++;
    const raceSess = meetingSessions.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => s.session_type === "Race"
    ) || meetingSessions[0];

    const name = raceSess.meeting_name || raceSess.circuit_short_name || `Round ${round}`;
    const circuit = raceSess.circuit_short_name || raceSess.location || "";
    const isSprint = meetingSessions.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => s.session_type === "Sprint"
    );
    const dateStr = raceSess.date_start || raceSess.date_end || "";
    const completed = dateStr ? new Date(dateStr) < now : false;

    races.push({
      slug: deriveSlug(name.includes("Grand Prix") ? name : `${name} Grand Prix`),
      round,
      name: name.includes("Grand Prix") ? name : `${name} Grand Prix`,
      circuit,
      date: dateStr ? formatDisplayDate(dateStr) : "",
      isoDate: dateStr,
      completed,
      sprint: isSprint || undefined,
    });
  }

  // Mark the next upcoming race
  const nextIdx = races.findIndex((r) => !r.completed);
  if (nextIdx >= 0) races[nextIdx].next = true;

  return races;
}

/**
 * Transform Ergast driver standings into DriverListItem[].
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformErgastDriverStandings(data: any): import("@/types").DriverListItem[] {
  try {
    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return standings.map((entry: any, i: number) => {
      const d = entry.Driver;
      const team = entry.Constructors?.[0]?.name || "";
      return {
        id: d.driverId,
        name: `${d.givenName} ${d.familyName}`,
        code: d.code || getDriverCode(d.familyName),
        team,
        number: parseInt(d.permanentNumber || "0", 10),
        pts: parseInt(entry.points || "0", 10),
        wins: parseInt(entry.wins || "0", 10),
        podiums: 0, // Ergast doesn't provide podiums in standings
        poles: 0, // Ergast doesn't provide poles in standings
        pos: i + 1,
        color: getTeamColor(team),
      };
    });
  } catch {
    return [];
  }
}

/**
 * Transform Ergast constructor standings into TeamListItem[].
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformErgastConstructorStandings(data: any): import("@/types").TeamListItem[] {
  try {
    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return standings.map((entry: any, i: number) => {
      const c = entry.Constructor;
      return {
        id: c.constructorId,
        name: c.name,
        drivers: [], // Ergast doesn't include drivers in constructor standings
        pts: parseInt(entry.points || "0", 10),
        wins: parseInt(entry.wins || "0", 10),
        podiums: 0,
        pos: i + 1,
        color: getTeamColor(c.name),
      };
    });
  } catch {
    return [];
  }
}

/**
 * Transform Polymarket Gamma API results into categorized markets.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformPolymarketResults(raw: any[]): import("@/types").MarketsData {
  const result: import("@/types").MarketsData = {
    championship: [],
    raceWinner: [],
    props: [],
  };

  if (!raw || !Array.isArray(raw)) return result;

  for (const m of raw) {
    const question = m.question || m.title || "";
    const qLower = question.toLowerCase();

    const outcomes = (m.outcomes || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o: any, idx: number) => ({
        name: typeof o === "string" ? o : o.name || o.title || `Option ${idx + 1}`,
        code: (typeof o === "string" ? o : o.name || "")
          .split(" ")
          .pop()
          ?.slice(0, 3)
          .toUpperCase() || "",
        price: m.outcomePrices
          ? parseFloat(m.outcomePrices[idx] || "0")
          : o.price || 0,
        color: getTeamColor(typeof o === "string" ? o : o.name || ""),
      })
    );

    const item: import("@/types").MarketListItem = {
      question,
      volume: `$${((m.volume || 0) / 1e6).toFixed(1)}M`,
      endDate: m.endDate
        ? new Date(m.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      outcomes,
    };

    if (qLower.includes("championship") || qLower.includes("constructors")) {
      result.championship.push(item);
    } else if (qLower.includes("win") && qLower.includes("grand prix")) {
      result.raceWinner.push(item);
    } else {
      result.props.push(item);
    }
  }

  return result;
}
