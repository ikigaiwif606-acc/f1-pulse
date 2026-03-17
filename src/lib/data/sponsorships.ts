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
      { name: "Petronas", nameZh: "马石油", dealType: "title", reportedValue: "$75M/yr", contractEnd: "2030", industry: "Energy" },
      { name: "INEOS", nameZh: "英力士", dealType: "major", reportedValue: "$50M/yr", contractEnd: "2030", industry: "Chemicals" },
      { name: "IWC Schaffhausen", nameZh: "万国表", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Luxury Watches" },
      { name: "adidas", nameZh: "阿迪达斯", dealType: "major", reportedValue: "$30M/yr", contractEnd: "2029", industry: "Sportswear" },
      { name: "Microsoft", nameZh: "微软", dealType: "technical", reportedValue: null, contractEnd: "2029", industry: "Technology" },
      { name: "Hewlett Packard Enterprise", nameZh: "惠普企业", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Technology" },
      { name: "CrowdStrike", nameZh: "CrowdStrike", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Cybersecurity" },
      { name: "Monster Energy", nameZh: "魔爪", dealType: "official", reportedValue: null, contractEnd: null, industry: "Beverages" },
      { name: "Qualcomm Snapdragon", nameZh: "高通骁龙", dealType: "official", reportedValue: null, contractEnd: null, industry: "Semiconductors" },
    ],
  },
  {
    teamId: "ferrari",
    team: "Ferrari",
    color: "#E80020",
    titleSponsor: "HP",
    sponsors: [
      { name: "HP", nameZh: "惠普", dealType: "title", reportedValue: "$60M/yr", contractEnd: "2030", industry: "Technology" },
      { name: "Shell", nameZh: "壳牌", dealType: "major", reportedValue: "$50M/yr", contractEnd: "2030", industry: "Energy" },
      { name: "Ray-Ban", nameZh: "雷朋", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Eyewear" },
      { name: "UniCredit", nameZh: "联合信贷银行", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Banking" },
      { name: "IBM", nameZh: "IBM", dealType: "technical", reportedValue: null, contractEnd: "2029", industry: "Technology" },
      { name: "Puma", nameZh: "彪马", dealType: "official", reportedValue: null, contractEnd: "2028", industry: "Sportswear" },
      { name: "Richard Mille", nameZh: "理查德·米勒", dealType: "official", reportedValue: null, contractEnd: null, industry: "Luxury Watches" },
      { name: "CEVA Logistics", nameZh: "CEVA物流", dealType: "official", reportedValue: null, contractEnd: null, industry: "Logistics" },
    ],
  },
  {
    teamId: "red_bull",
    team: "Red Bull",
    color: "#3671C6",
    titleSponsor: "Oracle",
    sponsors: [
      { name: "Oracle", nameZh: "甲骨文", dealType: "title", reportedValue: "$110M/yr", contractEnd: "2028", industry: "Technology" },
      { name: "Gate.io", nameZh: "Gate.io", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Crypto Exchange" },
      { name: "Visa", nameZh: "Visa", dealType: "major", reportedValue: null, contractEnd: "2030", industry: "Financial Services" },
      { name: "TAG Heuer", nameZh: "泰格豪雅", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Luxury Watches" },
      { name: "Ford", nameZh: "福特", dealType: "technical", reportedValue: null, contractEnd: "2030", industry: "Automotive (PU)" },
      { name: "ExxonMobil", nameZh: "埃克森美孚", dealType: "technical", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Castore", nameZh: "Castore", dealType: "official", reportedValue: null, contractEnd: "2028", industry: "Sportswear" },
      { name: "AT&T", nameZh: "AT&T", dealType: "official", reportedValue: null, contractEnd: null, industry: "Telecommunications" },
    ],
  },
  {
    teamId: "mclaren",
    team: "McLaren",
    color: "#FF8000",
    titleSponsor: "Mastercard",
    sponsors: [
      { name: "Mastercard", nameZh: "万事达", dealType: "title", reportedValue: "$100M/yr", contractEnd: "2035", industry: "Financial Services" },
      { name: "OKX", nameZh: "OKX", dealType: "major", reportedValue: "$35M/yr", contractEnd: "2027", industry: "Crypto Exchange" },
      { name: "Google", nameZh: "谷歌", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Technology" },
      { name: "Hilton", nameZh: "希尔顿", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Hospitality" },
      { name: "Etihad Airways", nameZh: "阿提哈德航空", dealType: "major", reportedValue: null, contractEnd: "2029", industry: "Aviation" },
      { name: "Puma", nameZh: "彪马", dealType: "official", reportedValue: null, contractEnd: "2029", industry: "Sportswear" },
      { name: "Dell Technologies", nameZh: "戴尔科技", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Technology" },
      { name: "Monster Energy", nameZh: "魔爪", dealType: "official", reportedValue: null, contractEnd: null, industry: "Beverages" },
    ],
  },
  {
    teamId: "aston_martin",
    team: "Aston Martin",
    color: "#229971",
    titleSponsor: "Aramco",
    sponsors: [
      { name: "Aramco", nameZh: "沙特阿美", dealType: "title", reportedValue: "$75M/yr", contractEnd: "2030", industry: "Energy" },
      { name: "Honda", nameZh: "本田", dealType: "technical", reportedValue: null, contractEnd: "2030", industry: "Automotive (PU)" },
      { name: "Cognizant", nameZh: "高知特", dealType: "technical", reportedValue: null, contractEnd: null, industry: "Technology" },
      { name: "SentinelOne", nameZh: "SentinelOne", dealType: "technical", reportedValue: null, contractEnd: "2027", industry: "Cybersecurity" },
      { name: "Valvoline", nameZh: "胜牌", dealType: "official", reportedValue: null, contractEnd: "2027", industry: "Lubricants" },
    ],
  },
  {
    teamId: "alpine",
    team: "Alpine F1 Team",
    color: "#0093CC",
    titleSponsor: "BWT",
    sponsors: [
      { name: "BWT", nameZh: "BWT", dealType: "title", reportedValue: "$20M/yr", contractEnd: "2027", industry: "Water Treatment" },
      { name: "eToro", nameZh: "eToro", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Trading Platform" },
      { name: "Eni", nameZh: "埃尼", dealType: "technical", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Castore", nameZh: "Castore", dealType: "official", reportedValue: null, contractEnd: null, industry: "Sportswear" },
      { name: "MAPFRE", nameZh: "MAPFRE", dealType: "official", reportedValue: null, contractEnd: null, industry: "Insurance" },
    ],
  },
  {
    teamId: "williams",
    team: "Williams",
    color: "#1868DB",
    titleSponsor: "Atlassian",
    sponsors: [
      { name: "Atlassian", nameZh: "Atlassian", dealType: "title", reportedValue: null, contractEnd: "2029", industry: "Software" },
      { name: "Duracell", nameZh: "金霸王", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Batteries" },
      { name: "Gulf Oil", nameZh: "海湾石油", dealType: "major", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Anthropic (Claude)", nameZh: "Anthropic (Claude)", dealType: "major", reportedValue: null, contractEnd: null, industry: "AI" },
      { name: "Barclays", nameZh: "巴克莱银行", dealType: "major", reportedValue: null, contractEnd: null, industry: "Banking" },
      { name: "Kraken", nameZh: "Kraken", dealType: "official", reportedValue: null, contractEnd: null, industry: "Crypto Exchange" },
      { name: "Dorilton Capital", nameZh: "多利顿资本", dealType: "official", reportedValue: null, contractEnd: null, industry: "Private Equity" },
    ],
  },
  {
    teamId: "rb",
    team: "Racing Bulls",
    color: "#6692FF",
    titleSponsor: "Visa Cash App",
    sponsors: [
      { name: "Visa Cash App", nameZh: "Visa Cash App", dealType: "title", reportedValue: null, contractEnd: "2030", industry: "Fintech" },
      { name: "Hugo Boss", nameZh: "雨果博斯", dealType: "major", reportedValue: null, contractEnd: "2027", industry: "Fashion" },
      { name: "Tudor", nameZh: "帝舵", dealType: "official", reportedValue: null, contractEnd: null, industry: "Luxury Watches" },
    ],
  },
  {
    teamId: "haas",
    team: "Haas F1 Team",
    color: "#B6BABD",
    titleSponsor: "Toyota Gazoo Racing",
    sponsors: [
      { name: "Toyota Gazoo Racing", nameZh: "丰田 GR", dealType: "title", reportedValue: null, contractEnd: "2028", industry: "Automotive" },
      { name: "MoneyGram", nameZh: "速汇金", dealType: "major", reportedValue: "$20M/yr", contractEnd: "2028", industry: "Financial Services" },
      { name: "Castore", nameZh: "Castore", dealType: "official", reportedValue: null, contractEnd: null, industry: "Sportswear" },
    ],
  },
  {
    teamId: "sauber",
    team: "Audi",
    color: "#00594F",
    titleSponsor: "Revolut",
    sponsors: [
      { name: "Revolut", nameZh: "Revolut", dealType: "title", reportedValue: "$75M/yr", contractEnd: "2028", industry: "Fintech" },
      { name: "BP/Castrol", nameZh: "BP/嘉实多", dealType: "technical", reportedValue: null, contractEnd: "2028", industry: "Energy" },
      { name: "Visit Qatar", nameZh: "卡塔尔旅游", dealType: "major", reportedValue: null, contractEnd: null, industry: "Tourism" },
      { name: "adidas", nameZh: "阿迪达斯", dealType: "official", reportedValue: null, contractEnd: null, industry: "Sportswear" },
      { name: "Gillette", nameZh: "吉列", dealType: "official", reportedValue: null, contractEnd: null, industry: "Consumer Goods" },
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
      { name: "Tommy Hilfiger", nameZh: "汤米·希尔费格", dealType: "official", reportedValue: null, contractEnd: null, industry: "Fashion" },
      { name: "America Movil", nameZh: "美洲移动", dealType: "official", reportedValue: null, contractEnd: null, industry: "Telecommunications" },
      { name: "Jim Beam", nameZh: "金宾", dealType: "official", reportedValue: null, contractEnd: null, industry: "Spirits" },
      { name: "Gainbridge", nameZh: "Gainbridge", dealType: "official", reportedValue: null, contractEnd: null, industry: "Financial Services" },
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
  { name: "LVMH", nameZh: "路威酩轩", role: "Global Partner (~$150M/yr)", industry: "Luxury" },
  { name: "Aramco", nameZh: "沙特阿美", role: "Global Partner", industry: "Energy" },
  { name: "DHL", nameZh: "DHL", role: "Official Logistics Partner", industry: "Logistics" },
  { name: "Pirelli", nameZh: "倍耐力", role: "Official Tyre Supplier", industry: "Tyres" },
  { name: "TAG Heuer (LVMH)", nameZh: "泰格豪雅", role: "Official Timekeeper", industry: "Luxury Watches" },
  { name: "Heineken", nameZh: "喜力", role: "Official Beer Partner", industry: "Beverages" },
  { name: "Crypto.com", nameZh: "Crypto.com", role: "Official Crypto Partner", industry: "Crypto" },
  { name: "Salesforce", nameZh: "Salesforce", role: "Official CRM Partner", industry: "Technology" },
  { name: "Lenovo", nameZh: "联想", role: "Official PC & Laptop Partner", industry: "Technology" },
  { name: "Puma", nameZh: "彪马", role: "Official F1 Provider", industry: "Sportswear" },
  { name: "Santander", nameZh: "桑坦德银行", role: "Official Partner", industry: "Banking" },
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
