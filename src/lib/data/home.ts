import { getSeasonContext } from "./season";
import { getDriversList } from "./drivers";
import type { HomepageData } from "@/types";

// ── Chinese translations for race names ────────────────────────
const RACE_NAME_ZH: Record<string, string> = {
  "Australian Grand Prix": "澳大利亚大奖赛",
  "Barcelona Grand Prix": "巴塞罗那大奖赛",
  "Chinese Grand Prix": "中国大奖赛",
  "Japanese Grand Prix": "日本大奖赛",
  "Bahrain Grand Prix": "巴林大奖赛",
  "Saudi Arabian Grand Prix": "沙特阿拉伯大奖赛",
  "Miami Grand Prix": "迈阿密大奖赛",
  "Canadian Grand Prix": "加拿大大奖赛",
  "Monaco Grand Prix": "摩纳哥大奖赛",
  "Spanish Grand Prix": "西班牙大奖赛",
  "Austrian Grand Prix": "奥地利大奖赛",
  "British Grand Prix": "英国大奖赛",
  "Belgian Grand Prix": "比利时大奖赛",
  "Hungarian Grand Prix": "匈牙利大奖赛",
  "Dutch Grand Prix": "荷兰大奖赛",
  "Italian Grand Prix": "意大利大奖赛",
  "Madrid Grand Prix": "马德里大奖赛",
  "Azerbaijan Grand Prix": "阿塞拜疆大奖赛",
  "Singapore Grand Prix": "新加坡大奖赛",
  "United States Grand Prix": "美国大奖赛",
  "Mexico City Grand Prix": "墨西哥城大奖赛",
  "Brazilian Grand Prix": "巴西大奖赛",
  "Las Vegas Grand Prix": "拉斯维加斯大奖赛",
  "Qatar Grand Prix": "卡塔尔大奖赛",
  "Abu Dhabi Grand Prix": "阿布扎比大奖赛",
};

const CIRCUIT_FULL_NAME: Record<string, string> = {
  Melbourne: "Albert Park Circuit",
  Shanghai: "Shanghai International Circuit",
  Suzuka: "Suzuka International Racing Course",
  Sakhir: "Bahrain International Circuit",
  Jeddah: "Jeddah Corniche Circuit",
  Miami: "Miami International Autodrome",
  Montreal: "Circuit Gilles Villeneuve",
  "Monte Carlo": "Circuit de Monaco",
  Catalunya: "Circuit de Barcelona-Catalunya",
  Spielberg: "Red Bull Ring",
  Silverstone: "Silverstone Circuit",
  "Spa-Francorchamps": "Circuit de Spa-Francorchamps",
  Hungaroring: "Hungaroring",
  Zandvoort: "Circuit Zandvoort",
  Monza: "Autodromo Nazionale Monza",
  Madring: "Madrid Street Circuit",
  Baku: "Baku City Circuit",
  Singapore: "Marina Bay Street Circuit",
  Austin: "Circuit of the Americas",
  "Mexico City": "Autódromo Hermanos Rodríguez",
  Interlagos: "Autódromo José Carlos Pace",
  "Las Vegas": "Las Vegas Street Circuit",
  Lusail: "Lusail International Circuit",
  "Yas Marina Circuit": "Yas Marina Circuit",
};

const CIRCUIT_ZH: Record<string, string> = {
  Melbourne: "阿尔伯特公园赛道",
  Shanghai: "上海国际赛道",
  Suzuka: "铃鹿国际赛车场",
  Sakhir: "巴林国际赛道",
  Jeddah: "吉达滨海赛道",
  Miami: "迈阿密国际赛道",
  Montreal: "吉尔·维伦纽夫赛道",
  "Monte Carlo": "摩纳哥赛道",
  Catalunya: "巴塞罗那-加泰罗尼亚赛道",
  Spielberg: "红牛赛道",
  Silverstone: "银石赛道",
  "Spa-Francorchamps": "斯帕-弗朗科尔尚赛道",
  Hungaroring: "匈格罗灵赛道",
  Zandvoort: "赞德沃特赛道",
  Monza: "蒙扎国家赛道",
  Madring: "马德里街道赛道",
  Baku: "巴库城市赛道",
  Singapore: "滨海湾街道赛道",
  Austin: "美洲赛道",
  "Mexico City": "罗德里格斯兄弟赛道",
  Interlagos: "何塞·卡洛斯·帕塞赛道",
  "Las Vegas": "拉斯维加斯街道赛道",
  Lusail: "卢赛尔国际赛道",
  "Yas Marina Circuit": "亚斯码头赛道",
};

// ── Fallback ───────────────────────────────────────────────────
const FALLBACK: HomepageData = {
  nextRace: {
    name: "Japanese Grand Prix",
    nameZh: "日本大奖赛",
    circuit: "Suzuka International Racing Course",
    circuitZh: "铃鹿国际赛车场",
    date: "2026-03-29T05:00:00Z",
    round: 3,
    isSprint: false,
    slug: "japanese-gp",
    flag: "🇯🇵",
    sessions: [],
  },
  seasonStatus: "midSeason",
  liveSession: null,
  seasonProgress: { completed: 2, total: 22 },
  standings: [
    { pos: 1, id: "russell", name: "George Russell", code: "RUS", pts: 51, wins: 1, color: "#27F4D2" },
    { pos: 2, id: "antonelli", name: "Andrea Kimi Antonelli", code: "ANT", pts: 47, wins: 1, color: "#27F4D2" },
    { pos: 3, id: "leclerc", name: "Charles Leclerc", code: "LEC", pts: 34, wins: 0, color: "#E80020" },
    { pos: 4, id: "hamilton", name: "Lewis Hamilton", code: "HAM", pts: 33, wins: 0, color: "#E80020" },
    { pos: 5, id: "bearman", name: "Oliver Bearman", code: "BEA", pts: 17, wins: 0, color: "#B6BABD" },
  ],
  recent: [
    { round: 2, slug: "chinese-gp", name: "Chinese GP", winner: "Antonelli", code: "ANT", color: "#27F4D2" },
    { round: 1, slug: "australian-gp", name: "Australian GP", winner: "Russell", code: "RUS", color: "#27F4D2" },
  ],
  maxPts: 51,
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [ctx, drivers] = await Promise.all([getSeasonContext(), getDriversList()]);

    const nextRace = ctx?.nextRace || null;
    const completedRaces = (ctx?.races || []).filter((r) => r.completed).reverse().slice(0, 3);

    // Top 5 drivers for standings widget
    const top5 = drivers.slice(0, 5);
    const maxPts = top5[0]?.pts || 1;

    if (!ctx && top5.length === 0) return FALLBACK;

    return {
      nextRace: nextRace
        ? {
            name: nextRace.name,
            nameZh: RACE_NAME_ZH[nextRace.name] || nextRace.name,
            circuit: CIRCUIT_FULL_NAME[nextRace.circuit] || nextRace.circuitFull,
            circuitZh: CIRCUIT_ZH[nextRace.circuit] || nextRace.circuitFull,
            date: nextRace.isoDate || FALLBACK.nextRace.date,
            round: nextRace.round,
            isSprint: nextRace.sprint,
            slug: nextRace.slug,
            flag: nextRace.flag,
            sessions: nextRace.sessions,
          }
        : FALLBACK.nextRace,
      seasonStatus: ctx?.status || "midSeason",
      liveSession: ctx?.liveSession || null,
      seasonProgress: {
        completed: ctx?.completedCount ?? FALLBACK.seasonProgress.completed,
        total: ctx?.totalRounds ?? FALLBACK.seasonProgress.total,
      },
      standings:
        top5.length > 0
          ? top5.map((d) => ({
              pos: d.pos,
              id: d.id,
              name: d.name,
              code: d.code,
              pts: d.pts,
              wins: d.wins,
              color: d.color,
            }))
          : FALLBACK.standings,
      recent:
        completedRaces.length > 0
          ? completedRaces.map((r) => ({
              round: r.round,
              slug: r.slug,
              name: r.name.replace("Grand Prix", "GP"),
              winner: r.winner || "",
              code: r.code || "",
              color: r.color || "#666",
            }))
          : FALLBACK.recent,
      maxPts,
    };
  } catch {
    return FALLBACK;
  }
}
