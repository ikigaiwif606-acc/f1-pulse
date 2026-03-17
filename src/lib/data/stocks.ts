// ── 2026 F1-Adjacent Stock Data ──────────────────────────────────────────────
// Prices as of mid-March 2026. Updated periodically from public sources.

export interface F1Stock {
  ticker: string;
  exchange: string;
  company: string;
  companyZh: string;
  teamId: string | null;
  team: string | null;
  teamColor: string;
  currency: string;
  price: number;
  change1d: number;      // daily change %
  change1w: number;      // weekly change %
  changeYtd: number;     // year-to-date %
  high52w: number;
  low52w: number;
  note: string;
  noteZh: string;
}

export const F1_STOCKS: F1Stock[] = [
  {
    ticker: "RACE",
    exchange: "NYSE",
    company: "Ferrari N.V.",
    companyZh: "法拉利",
    teamId: "ferrari",
    team: "Ferrari",
    teamColor: "#E80020",
    currency: "USD",
    price: 329.50,
    change1d: -1.1,
    change1w: -2.3,
    changeYtd: -8.5,
    high52w: 519.10,
    low52w: 328.00,
    note: "Near 52-week low after disappointing Capital Markets Day. Analysts still rate Buy with ~$489 target.",
    noteZh: "接近52周低点，因资本市场日表现不佳。分析师仍维持买入评级，目标价约$489。",
  },
  {
    ticker: "AML",
    exchange: "LSE",
    company: "Aston Martin Lagonda",
    companyZh: "阿斯顿·马丁",
    teamId: "aston_martin",
    team: "Aston Martin",
    teamColor: "#229971",
    currency: "GBp",
    price: 40.12,
    change1d: -4.7,
    change1w: -3.0,
    changeYtd: -22.4,
    high52w: 88.90,
    low52w: 38.02,
    note: "Trading near 52-week low, lost over half its value. Profitability headwinds continue.",
    noteZh: "接近52周低点，市值蒸发过半。盈利能力面临持续挑战。",
  },
  {
    ticker: "FWONA",
    exchange: "NASDAQ",
    company: "Liberty Media (F1 Group)",
    companyZh: "自由媒体 (F1集团)",
    teamId: null,
    team: "Formula 1",
    teamColor: "#E10600",
    currency: "USD",
    price: 77.57,
    change1d: -2.3,
    change1w: -1.8,
    changeYtd: -5.2,
    high52w: 99.52,
    low52w: 68.00,
    note: "F1 revenue ~$4B in 2025. Evercore flagged $70M earnings hit from race cancellations.",
    noteZh: "F1 2025年收入约40亿美元。Evercore警告赛事取消可能带来7000万美元盈利冲击。",
  },
  {
    ticker: "MBG",
    exchange: "XETRA",
    company: "Mercedes-Benz Group",
    companyZh: "梅赛德斯-奔驰集团",
    teamId: "mercedes",
    team: "Mercedes",
    teamColor: "#27F4D2",
    currency: "EUR",
    price: 54.85,
    change1d: -0.7,
    change1w: -1.5,
    changeYtd: -3.8,
    high52w: 77.45,
    low52w: 50.75,
    note: "Goldman Sachs issued Buy rating in Feb 2026. Tariff costs and EU auto sector weakness weigh.",
    noteZh: "高盛于2026年2月给出买入评级。关税成本和欧洲汽车行业疲软施压。",
  },
  {
    ticker: "VOW3",
    exchange: "XETRA",
    company: "Volkswagen AG (Audi)",
    companyZh: "大众汽车 (奥迪)",
    teamId: "sauber",
    team: "Audi",
    teamColor: "#00594F",
    currency: "EUR",
    price: 90.20,
    change1d: -0.5,
    change1w: -0.5,
    changeYtd: -12.1,
    high52w: 128.60,
    low52w: 78.86,
    note: "Pressure from EV transition costs and Chinese competition. Audi F1 entry in 2026.",
    noteZh: "电动化转型成本和中国竞争施压。奥迪2026年进军F1。",
  },
  {
    ticker: "GM",
    exchange: "NYSE",
    company: "General Motors (Cadillac)",
    companyZh: "通用汽车 (凯迪拉克)",
    teamId: "cadillac",
    team: "Cadillac",
    teamColor: "#C0C0C0",
    currency: "USD",
    price: 72.39,
    change1d: -1.4,
    change1w: +0.8,
    changeYtd: +12.3,
    high52w: 87.62,
    low52w: 41.60,
    note: "19/21 analysts rate Buy, avg target ~$95. Nearly doubled from 52-week low. Cadillac F1 debut.",
    noteZh: "19/21分析师给出买入评级，目标价约$95。从52周低点几近翻倍。凯迪拉克F1首秀。",
  },
  {
    ticker: "RNO",
    exchange: "EPA",
    company: "Renault (Alpine)",
    companyZh: "雷诺 (Alpine)",
    teamId: "alpine",
    team: "Alpine",
    teamColor: "#0093CC",
    currency: "EUR",
    price: 28.26,
    change1d: -2.2,
    change1w: -10.7,
    changeYtd: -18.5,
    high52w: 50.68,
    low52w: 27.78,
    note: "Near 52-week low, down ~30% YoY. Alpine F1 remains a significant cost center.",
    noteZh: "接近52周低点，同比下跌约30%。Alpine F1仍是重要成本中心。",
  },
];

// ── Race-Stock Correlation Insights ─────────────────────────────────────────
export interface CorrelationInsight {
  ticker: string;
  insight: string;
  insightZh: string;
}

export const CORRELATION_INSIGHTS: CorrelationInsight[] = [
  {
    ticker: "RACE",
    insight: "Hamilton's move to Ferrari in early 2024 caused a ~20% share price jump — the clearest example of F1 news moving a stock.",
    insightZh: "2024年初汉密尔顿转会法拉利的消息导致股价上涨约20%——F1新闻影响股价的最典型案例。",
  },
  {
    ticker: "FWONA",
    insight: "F1 revenue grew from $3.65B (2024) to ~$4B (2025). Race cancellations pose the biggest risk to earnings.",
    insightZh: "F1收入从2024年36.5亿美元增长至2025年约40亿美元。赛事取消是盈利的最大风险。",
  },
  {
    ticker: "GM",
    insight: "Cadillac's F1 entry is seen as a brand-building play. GM stock reacted positively to the team announcement.",
    insightZh: "凯迪拉克进军F1被视为品牌建设举措。通用汽车股价在车队公告后积极反应。",
  },
];
