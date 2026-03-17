// ── 2026 F1 Sponsorship & Partnership Data ──────────────────────────────────
// Curated from official team websites, press releases, and news reports.

export interface Sponsor {
  name: string;
  nameZh: string;
  dealType: "title" | "major" | "technical" | "official";
  reportedValue: string | null; // e.g. "$500M/5yr" or null if undisclosed
  contractEnd: string | null;   // e.g. "2028" or null
  industry: string;
}

export interface TeamSponsors {
  teamId: string;
  team: string;
  color: string;
  titleSponsor: string | null;
  sponsors: Sponsor[];
}

export const TEAM_SPONSORSHIPS: TeamSponsors[] = [
  {
    teamId: "mercedes",
    team: "Mercedes",
    color: "#27F4D2",
    titleSponsor: "Petronas",
    sponsors: [
      { name: "Petronas", nameZh: "马石油", dealType: "title", reportedValue: "$75M/yr", contractEnd: "2028", industry: "Energy" },
      { name: "INEOS", nameZh: "英力士", dealType: "major", reportedValue: "$50M/yr", contractEnd: "2030", industry: "Chemicals" },
      { name: "IWC Schaffhausen", nameZh: "万国表", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Luxury Watches" },
      { name: "Hewlett Packard Enterprise", nameZh: "惠普企业", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Technology" },
      { name: "CrowdStrike", nameZh: "CrowdStrike", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Cybersecurity" },
      { name: "Tommy Hilfiger", nameZh: "汤米·希尔费格", dealType: "official", reportedValue: null, contractEnd: null, industry: "Fashion" },
      { name: "Monster Energy", nameZh: "魔爪", dealType: "official", reportedValue: null, contractEnd: null, industry: "Beverages" },
    ],
  },
  {
    teamId: "ferrari",
    team: "Ferrari",
    color: "#E80020",
    titleSponsor: "HP",
    sponsors: [
      { name: "HP", nameZh: "惠普", dealType: "title", reportedValue: "$100M/yr", contractEnd: "2030", industry: "Technology" },
      { name: "Shell", nameZh: "壳牌", dealType: "major", reportedValue: "$50M/yr", contractEnd: "2030", industry: "Energy" },
      { name: "Ray-Ban", nameZh: "雷朋", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Eyewear" },
      { name: "Santander", nameZh: "桑坦德银行", dealType: "major", reportedValue: "$40M/yr", contractEnd: "2027", industry: "Banking" },
      { name: "AWS", nameZh: "亚马逊云", dealType: "technical", reportedValue: null, contractEnd: "2029", industry: "Cloud Computing" },
      { name: "Puma", nameZh: "彪马", dealType: "official", reportedValue: null, contractEnd: "2028", industry: "Sportswear" },
      { name: "Richard Mille", nameZh: "理查德·米勒", dealType: "official", reportedValue: null, contractEnd: null, industry: "Luxury Watches" },
    ],
  },
  {
    teamId: "red_bull",
    team: "Red Bull",
    color: "#3671C6",
    titleSponsor: "Oracle",
    sponsors: [
      { name: "Oracle", nameZh: "甲骨文", dealType: "title", reportedValue: "$100M/yr", contractEnd: "2028", industry: "Technology" },
      { name: "Bybit", nameZh: "Bybit", dealType: "major", reportedValue: "$50M/yr", contractEnd: "2027", industry: "Crypto Exchange" },
      { name: "TAG Heuer", nameZh: "泰格豪雅", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Luxury Watches" },
      { name: "ExxonMobil", nameZh: "埃克森美孚", dealType: "technical", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Puma", nameZh: "彪马", dealType: "official", reportedValue: null, contractEnd: "2028", industry: "Sportswear" },
      { name: "AT&T", nameZh: "AT&T", dealType: "official", reportedValue: null, contractEnd: null, industry: "Telecommunications" },
    ],
  },
  {
    teamId: "mclaren",
    team: "McLaren",
    color: "#FF8000",
    titleSponsor: "OKX",
    sponsors: [
      { name: "OKX", nameZh: "OKX", dealType: "title", reportedValue: "$35M/yr", contractEnd: "2027", industry: "Crypto Exchange" },
      { name: "Google", nameZh: "谷歌", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Technology" },
      { name: "Hilton", nameZh: "希尔顿", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Hospitality" },
      { name: "Estrella Galicia", nameZh: "埃斯特拉加利西亚", dealType: "official", reportedValue: null, contractEnd: null, industry: "Beverages" },
      { name: "Dell Technologies", nameZh: "戴尔科技", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Technology" },
    ],
  },
  {
    teamId: "aston_martin",
    team: "Aston Martin",
    color: "#229971",
    titleSponsor: "Aramco",
    sponsors: [
      { name: "Aramco", nameZh: "沙特阿美", dealType: "title", reportedValue: "$100M/yr", contractEnd: "2030", industry: "Energy" },
      { name: "Cognizant", nameZh: "高知特", dealType: "major", reportedValue: "$30M/yr", contractEnd: "2026", industry: "Technology" },
      { name: "SentinelOne", nameZh: "SentinelOne", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Cybersecurity" },
      { name: "Valvoline", nameZh: "胜牌", dealType: "official", reportedValue: null, contractEnd: "2027", industry: "Lubricants" },
    ],
  },
  {
    teamId: "alpine",
    team: "Alpine F1 Team",
    color: "#0093CC",
    titleSponsor: null,
    sponsors: [
      { name: "BWT", nameZh: "BWT", dealType: "major", reportedValue: "$20M/yr", contractEnd: "2027", industry: "Water Treatment" },
      { name: "Microsoft", nameZh: "微软", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Technology" },
      { name: "Castrol", nameZh: "嘉实多", dealType: "technical", reportedValue: null, contractEnd: "2028", industry: "Lubricants" },
      { name: "MAPFRE", nameZh: "MAPFRE", dealType: "official", reportedValue: null, contractEnd: null, industry: "Insurance" },
    ],
  },
  {
    teamId: "williams",
    team: "Williams",
    color: "#1868DB",
    titleSponsor: null,
    sponsors: [
      { name: "Duracell", nameZh: "金霸王", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Batteries" },
      { name: "Gulf Oil", nameZh: "海湾石油", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Komatsu", nameZh: "小松", dealType: "technical", reportedValue: null, contractEnd: "2026", industry: "Machinery" },
      { name: "Dorilton Capital", nameZh: "多利顿资本", dealType: "official", reportedValue: null, contractEnd: null, industry: "Private Equity" },
    ],
  },
  {
    teamId: "rb",
    team: "Racing Bulls",
    color: "#6692FF",
    titleSponsor: "Visa Cash App",
    sponsors: [
      { name: "Visa Cash App", nameZh: "Visa Cash App", dealType: "title", reportedValue: null, contractEnd: "2027", industry: "Fintech" },
      { name: "Hugo Boss", nameZh: "雨果博斯", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Fashion" },
      { name: "Tudor", nameZh: "帝舵", dealType: "official", reportedValue: null, contractEnd: null, industry: "Luxury Watches" },
    ],
  },
  {
    teamId: "haas",
    team: "Haas F1 Team",
    color: "#B6BABD",
    titleSponsor: "MoneyGram",
    sponsors: [
      { name: "MoneyGram", nameZh: "速汇金", dealType: "title", reportedValue: "$20M/yr", contractEnd: "2028", industry: "Financial Services" },
      { name: "Jack Daniel's", nameZh: "杰克丹尼", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Spirits" },
      { name: "ADOBE", nameZh: "Adobe", dealType: "technical", reportedValue: null, contractEnd: null, industry: "Software" },
    ],
  },
  {
    teamId: "sauber",
    team: "Audi",
    color: "#00594F",
    titleSponsor: "Revolut",
    sponsors: [
      { name: "Revolut", nameZh: "Revolut", dealType: "title", reportedValue: null, contractEnd: "2028", industry: "Fintech" },
      { name: "Stake", nameZh: "Stake", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Crypto/Betting" },
      { name: "Audi Sport", nameZh: "奥迪运动", dealType: "technical", reportedValue: null, contractEnd: null, industry: "Automotive" },
    ],
  },
  {
    teamId: "cadillac",
    team: "Cadillac F1 Team",
    color: "#C0C0C0",
    titleSponsor: null,
    sponsors: [
      { name: "General Motors", nameZh: "通用汽车", dealType: "major", reportedValue: null, contractEnd: null, industry: "Automotive" },
      { name: "TWG Global", nameZh: "TWG Global", dealType: "major", reportedValue: null, contractEnd: null, industry: "Entertainment" },
    ],
  },
];

// ── F1 Global Partners ───────────────────────────────────────────────────────
export interface GlobalPartner {
  name: string;
  nameZh: string;
  role: string;
  industry: string;
}

export const F1_GLOBAL_PARTNERS: GlobalPartner[] = [
  { name: "Aramco", nameZh: "沙特阿美", role: "Global Partner", industry: "Energy" },
  { name: "DHL", nameZh: "DHL", role: "Official Logistics Partner", industry: "Logistics" },
  { name: "Pirelli", nameZh: "倍耐力", role: "Official Tyre Supplier", industry: "Tyres" },
  { name: "AWS", nameZh: "亚马逊云", role: "Official Cloud Provider", industry: "Cloud Computing" },
  { name: "Heineken", nameZh: "喜力", role: "Official Beer Partner", industry: "Beverages" },
  { name: "Crypto.com", nameZh: "Crypto.com", role: "Official Crypto Partner", industry: "Crypto" },
  { name: "Salesforce", nameZh: "Salesforce", role: "Official CRM Partner", industry: "Technology" },
  { name: "Lenovo", nameZh: "联想", role: "Official PC & Laptop Partner", industry: "Technology" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const DEAL_TYPE_ORDER: Record<string, number> = { title: 0, major: 1, technical: 2, official: 3 };

export function getSponsorshipData() {
  // Sort sponsors within each team by deal type hierarchy
  return TEAM_SPONSORSHIPS.map((t) => ({
    ...t,
    sponsors: [...t.sponsors].sort((a, b) => (DEAL_TYPE_ORDER[a.dealType] ?? 9) - (DEAL_TYPE_ORDER[b.dealType] ?? 9)),
  }));
}

export function getTotalEstimatedValue(teamId: string): string {
  const team = TEAM_SPONSORSHIPS.find((t) => t.teamId === teamId);
  if (!team) return "N/A";

  let total = 0;
  let hasEstimate = false;
  for (const s of team.sponsors) {
    if (s.reportedValue) {
      const match = s.reportedValue.match(/\$(\d+)M/);
      if (match) {
        total += parseInt(match[1], 10);
        hasEstimate = true;
      }
    }
  }
  return hasEstimate ? `$${total}M+/yr` : "Undisclosed";
}
