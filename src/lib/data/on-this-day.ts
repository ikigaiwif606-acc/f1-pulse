// ── On This Day in F1 ───────────────────────────────────────────────────────
// A curated list of ~100 notable F1 events across all 12 months.

export interface F1Event {
  month: number;  // 1-12
  day: number;    // 1-31
  year: number;
  event: string;  // English
  eventZh: string; // Chinese
  category: "race" | "championship" | "record" | "debut" | "tragedy";
}

const F1_EVENTS: F1Event[] = [
  // ── January ────────────────────────────────────────────────────────────────
  { month: 1, day: 3, year: 1969, event: "Michael Schumacher born in Hurth, Germany", eventZh: "迈克尔·舒马赫出生于德国许尔特", category: "debut" },
  { month: 1, day: 7, year: 1985, event: "Lewis Hamilton born in Stevenage, England", eventZh: "刘易斯·汉密尔顿出生于英格兰斯蒂夫尼奇", category: "debut" },
  { month: 1, day: 13, year: 1950, event: "FIA announces the first Formula One World Championship calendar", eventZh: "FIA公布首届一级方程式世界锦标赛赛历", category: "championship" },
  { month: 1, day: 16, year: 2009, event: "Brawn GP formed from the remains of Honda Racing F1", eventZh: "布朗GP车队由本田F1车队改组成立", category: "debut" },
  { month: 1, day: 20, year: 2003, event: "Fernando Alonso confirmed as Renault F1 race driver at age 21", eventZh: "费尔南多·阿隆索在21岁时被确认为雷诺F1正式车手", category: "debut" },
  { month: 1, day: 25, year: 1975, event: "Argentine Grand Prix: first race of the 1975 season, won by Emerson Fittipaldi", eventZh: "阿根廷大奖赛：1975赛季首场比赛，埃默森·菲蒂帕尔迪获胜", category: "race" },
  { month: 1, day: 29, year: 1980, event: "Jenson Button born in Frome, England", eventZh: "简森·巴顿出生于英格兰弗罗姆", category: "debut" },

  // ── February ───────────────────────────────────────────────────────────────
  { month: 2, day: 1, year: 2010, event: "Virgin Racing (later Marussia) unveiled as new F1 team", eventZh: "维珍车队（后来的玛鲁西亚）作为新F1车队亮相", category: "debut" },
  { month: 2, day: 7, year: 1962, event: "First F1 car with monocoque chassis unveiled by Lotus", eventZh: "莲花车队推出首辆单体壳底盘F1赛车", category: "record" },
  { month: 2, day: 11, year: 2019, event: "Racing Point (formerly Force India) launches new season livery", eventZh: "赛点车队（前印度力量）发布新赛季涂装", category: "debut" },
  { month: 2, day: 14, year: 2005, event: "Red Bull Racing makes its F1 debut in pre-season testing", eventZh: "红牛车队在季前测试中首次亮相F1", category: "debut" },
  { month: 2, day: 19, year: 2004, event: "BAR Honda unveils 006 car for the 2004 season", eventZh: "BAR本田车队发布2004赛季006赛车", category: "debut" },
  { month: 2, day: 22, year: 1966, event: "Nikki Lauda born in Vienna, Austria", eventZh: "尼基·劳达出生于奥地利维也纳", category: "debut" },
  { month: 2, day: 25, year: 2020, event: "Mercedes reveals the dominant W11 car for the 2020 season", eventZh: "梅赛德斯发布统治级W11赛车", category: "debut" },

  // ── March ──────────────────────────────────────────────────────────────────
  { month: 3, day: 1, year: 1980, event: "Alain Prost makes his F1 debut at the Argentine GP with McLaren", eventZh: "阿兰·普罗斯特在阿根廷大奖赛上代表迈凯伦首次亮相F1", category: "debut" },
  { month: 3, day: 5, year: 2006, event: "Bahrain GP: first race of the 2006 season, Alonso wins", eventZh: "巴林大奖赛：2006赛季首场比赛，阿隆索获胜", category: "race" },
  { month: 3, day: 9, year: 1958, event: "First rear-engined car enters F1 — Cooper T43", eventZh: "首辆后置引擎赛车Cooper T43进入F1", category: "record" },
  { month: 3, day: 12, year: 2000, event: "Australian GP: Michael Schumacher wins opening race for Ferrari", eventZh: "澳大利亚大奖赛：迈克尔·舒马赫为法拉利赢得揭幕战", category: "race" },
  { month: 3, day: 14, year: 1993, event: "Ayrton Senna wins the rain-soaked European GP at Donington in a legendary drive", eventZh: "塞纳在多宁顿公园的雨战中上演传奇驾驶赢得欧洲大奖赛", category: "race" },
  { month: 3, day: 17, year: 2024, event: "Australian GP: Carlos Sainz wins just weeks after appendix surgery", eventZh: "澳大利亚大奖赛：卡洛斯·塞恩斯在阑尾手术几周后获胜", category: "race" },
  { month: 3, day: 20, year: 2011, event: "Australian GP: Sebastian Vettel dominates the season opener in Melbourne", eventZh: "澳大利亚大奖赛：维特尔在墨尔本统治揭幕战", category: "race" },
  { month: 3, day: 26, year: 2017, event: "Australian GP: Vettel wins for Ferrari, beating Hamilton in Melbourne", eventZh: "澳大利亚大奖赛：维特尔驾驶法拉利击败汉密尔顿获胜", category: "race" },
  { month: 3, day: 28, year: 2021, event: "Bahrain GP: Hamilton edges Verstappen in thrilling season opener", eventZh: "巴林大奖赛：汉密尔顿在激动人心的揭幕战中险胜维斯塔潘", category: "race" },

  // ── April ──────────────────────────────────────────────────────────────────
  { month: 4, day: 2, year: 2006, event: "Australian GP: Jenson Button scores his first win in wet conditions", eventZh: "澳大利亚大奖赛：简森·巴顿在雨战中首次获胜", category: "race" },
  { month: 4, day: 6, year: 1968, event: "Jim Clark, two-time world champion, killed at Hockenheim in F2 race", eventZh: "两届世界冠军吉姆·克拉克在霍根海姆的F2比赛中遇难", category: "tragedy" },
  { month: 4, day: 10, year: 2011, event: "Malaysian GP: Vettel wins from pole in dominant display", eventZh: "马来西亚大奖赛：维特尔从杆位出发统治性获胜", category: "race" },
  { month: 4, day: 13, year: 1958, event: "First F1 championship race won by a rear-engined car (Stirling Moss, Cooper)", eventZh: "后置引擎赛车首次赢得F1锦标赛分站赛（斯特林·莫斯，库珀）", category: "record" },
  { month: 4, day: 14, year: 2019, event: "Chinese GP 1000th: Hamilton wins F1's 1,000th championship race", eventZh: "中国大奖赛：汉密尔顿赢得F1第1000场锦标赛分站赛", category: "record" },
  { month: 4, day: 17, year: 2016, event: "Chinese GP: Nico Rosberg takes his sixth consecutive victory", eventZh: "中国大奖赛：尼科·罗斯伯格取得六连胜", category: "race" },
  { month: 4, day: 20, year: 1968, event: "South African GP: Jim Clark's last victory, one week before his death", eventZh: "南非大奖赛：吉姆·克拉克在去世前一周取得最后一场胜利", category: "tragedy" },
  { month: 4, day: 25, year: 1993, event: "Ayrton Senna's famous punch thrown at Eddie Irvine after Brazilian GP", eventZh: "塞纳在巴西大奖赛后著名的挥拳事件", category: "race" },

  // ── May ────────────────────────────────────────────────────────────────────
  { month: 5, day: 1, year: 1994, event: "Ayrton Senna killed at the San Marino GP, Imola — darkest day in modern F1", eventZh: "艾尔顿·塞纳在伊莫拉圣马力诺大奖赛中遇难——现代F1最黑暗的一天", category: "tragedy" },
  { month: 5, day: 6, year: 2007, event: "Spanish GP: Felipe Massa wins for Ferrari at Catalunya", eventZh: "西班牙大奖赛：马萨驾驶法拉利在加泰罗尼亚获胜", category: "race" },
  { month: 5, day: 8, year: 2022, event: "Miami GP inaugural race: Charles Leclerc leads early but Verstappen wins", eventZh: "迈阿密大奖赛首届比赛：勒克莱尔早期领先但维斯塔潘最终获胜", category: "race" },
  { month: 5, day: 13, year: 1950, event: "First ever F1 World Championship race held at Silverstone — Farina wins", eventZh: "首场F1世界锦标赛在银石赛道举行——法里纳获胜", category: "championship" },
  { month: 5, day: 15, year: 2016, event: "Spanish GP: Verstappen becomes youngest ever F1 race winner at 18 years old", eventZh: "西班牙大奖赛：维斯塔潘以18岁成为F1历史上最年轻的分站赛冠军", category: "record" },
  { month: 5, day: 20, year: 2012, event: "Spanish GP: Pastor Maldonado scores his only F1 win for Williams", eventZh: "西班牙大奖赛：马尔多纳多为威廉姆斯取得唯一一场F1胜利", category: "race" },
  { month: 5, day: 22, year: 1994, event: "Monaco GP: Michael Schumacher wins, dedicating victory to Senna", eventZh: "摩纳哥大奖赛：迈克尔·舒马赫获胜，将胜利献给塞纳", category: "race" },
  { month: 5, day: 26, year: 2019, event: "Monaco GP: Hamilton wins despite severe tyre degradation in final laps", eventZh: "摩纳哥大奖赛：汉密尔顿在最后几圈轮胎严重退化的情况下获胜", category: "race" },
  { month: 5, day: 29, year: 2011, event: "Monaco GP: Vettel wins from pole in Monte Carlo", eventZh: "摩纳哥大奖赛：维特尔从杆位出发在蒙特卡洛获胜", category: "race" },

  // ── June ───────────────────────────────────────────────────────────────────
  { month: 6, day: 1, year: 1958, event: "Dutch GP: Stirling Moss wins at Zandvoort", eventZh: "荷兰大奖赛：斯特林·莫斯在赞德沃特获胜", category: "race" },
  { month: 6, day: 6, year: 2004, event: "Monaco GP: Jarno Trulli wins his only Grand Prix for Renault", eventZh: "摩纳哥大奖赛：特鲁利为雷诺车队赢得唯一一场大奖赛", category: "race" },
  { month: 6, day: 10, year: 2007, event: "Canadian GP: Lewis Hamilton wins his first-ever F1 Grand Prix", eventZh: "加拿大大奖赛：刘易斯·汉密尔顿赢得职业生涯首场F1大奖赛", category: "record" },
  { month: 6, day: 11, year: 2023, event: "Canadian GP: Verstappen wins, extending dominant run", eventZh: "加拿大大奖赛：维斯塔潘获胜，延续统治级表现", category: "race" },
  { month: 6, day: 13, year: 2010, event: "Canadian GP: Hamilton wins in Montreal amid exciting battle", eventZh: "加拿大大奖赛：汉密尔顿在蒙特利尔的激烈竞争中获胜", category: "race" },
  { month: 6, day: 15, year: 1996, event: "Canadian GP: Damon Hill wins in wet conditions for Williams", eventZh: "加拿大大奖赛：达蒙·希尔在雨战中为威廉姆斯获胜", category: "race" },
  { month: 6, day: 19, year: 2005, event: "US GP: Only six cars start after Michelin tyre controversy at Indianapolis", eventZh: "美国大奖赛：因米其林轮胎争议仅六辆赛车在印第安纳波利斯发车", category: "race" },
  { month: 6, day: 21, year: 1964, event: "French GP: Dan Gurney wins at Rouen in a Brabham", eventZh: "法国大奖赛：丹·格尼驾驶布拉汉姆在鲁昂获胜", category: "race" },
  { month: 6, day: 25, year: 2023, event: "Austrian GP: Verstappen wins sprint and main race double", eventZh: "奥地利大奖赛：维斯塔潘赢得冲刺赛和正赛双料冠军", category: "race" },

  // ── July ───────────────────────────────────────────────────────────────────
  { month: 7, day: 3, year: 2005, event: "French GP: Fernando Alonso extends championship lead with win at Magny-Cours", eventZh: "法国大奖赛：阿隆索在马尼库尔获胜扩大积分领先优势", category: "race" },
  { month: 7, day: 5, year: 2015, event: "British GP: Hamilton wins at rain-hit Silverstone in a classic race", eventZh: "英国大奖赛：汉密尔顿在雨中的银石经典比赛中获胜", category: "race" },
  { month: 7, day: 8, year: 1951, event: "British GP: Gonzalez gives Ferrari their first F1 victory at Silverstone", eventZh: "英国大奖赛：冈萨雷斯在银石为法拉利赢得首场F1胜利", category: "record" },
  { month: 7, day: 10, year: 1966, event: "French GP: Jack Brabham wins in a car bearing his own name", eventZh: "法国大奖赛：杰克·布拉汉姆驾驶以自己命名的赛车获胜", category: "record" },
  { month: 7, day: 14, year: 2019, event: "British GP: Hamilton and Verstappen battle wheel-to-wheel at Silverstone", eventZh: "英国大奖赛：汉密尔顿和维斯塔潘在银石展开轮对轮大战", category: "race" },
  { month: 7, day: 16, year: 2017, event: "British GP: Hamilton wins record fifth British GP at Silverstone", eventZh: "英国大奖赛：汉密尔顿在银石创纪录第五次赢得英国大奖赛", category: "record" },
  { month: 7, day: 18, year: 2021, event: "British GP: Hamilton and Verstappen collide at Copse — controversial 10s penalty", eventZh: "英国大奖赛：汉密尔顿和维斯塔潘在科普斯弯碰撞——争议性10秒罚时", category: "race" },
  { month: 7, day: 20, year: 2003, event: "French GP: Ralf Schumacher wins at Magny-Cours for Williams", eventZh: "法国大奖赛：拉尔夫·舒马赫为威廉姆斯在马尼库尔获胜", category: "race" },
  { month: 7, day: 25, year: 1976, event: "German GP: Lauda suffers horrific crash at the Nurburgring", eventZh: "德国大奖赛：劳达在纽博格林遭遇惨烈事故", category: "tragedy" },
  { month: 7, day: 31, year: 2005, event: "Hungarian GP: Kimi Raikkonen wins from 13th on the grid", eventZh: "匈牙利大奖赛：莱科宁从第13位发车逆袭获胜", category: "race" },

  // ── August ────────────────────────────────────────────────────────────────
  { month: 8, day: 1, year: 1954, event: "German GP: Fangio dominates at the Nurburgring Nordschleife", eventZh: "德国大奖赛：方吉奥在纽博格林北环称雄", category: "race" },
  { month: 8, day: 3, year: 2003, event: "Hungarian GP: Alonso becomes youngest F1 winner at age 22 (record later broken)", eventZh: "匈牙利大奖赛：阿隆索以22岁成为F1最年轻冠军（纪录后被打破）", category: "record" },
  { month: 8, day: 5, year: 2001, event: "Hungarian GP: Michael Schumacher wins his 4th World Championship", eventZh: "匈牙利大奖赛：迈克尔·舒马赫赢得第四个世界冠军", category: "championship" },
  { month: 8, day: 12, year: 2018, event: "Hungarian GP: Hamilton takes dominant win to extend championship lead", eventZh: "匈牙利大奖赛：汉密尔顿统治性获胜扩大积分领先", category: "race" },
  { month: 8, day: 14, year: 1994, event: "Hungarian GP: Michael Schumacher wins controversial race amid Benetton scrutiny", eventZh: "匈牙利大奖赛：舒马赫在贝纳通车队受审查之际赢得争议性比赛", category: "race" },
  { month: 8, day: 21, year: 2011, event: "Hungarian GP: Jenson Button wins amid changeable weather", eventZh: "匈牙利大奖赛：巴顿在多变天气中获胜", category: "race" },
  { month: 8, day: 25, year: 1991, event: "Belgian GP: Michael Schumacher makes his F1 debut at Spa", eventZh: "比利时大奖赛：迈克尔·舒马赫在斯帕首次亮相F1", category: "debut" },
  { month: 8, day: 27, year: 2017, event: "Belgian GP: Hamilton wins at Spa-Francorchamps, closes gap to Vettel", eventZh: "比利时大奖赛：汉密尔顿在斯帕获胜，缩小与维特尔的差距", category: "race" },
  { month: 8, day: 29, year: 1993, event: "Belgian GP: Damon Hill wins his first GP at Spa-Francorchamps", eventZh: "比利时大奖赛：达蒙·希尔在斯帕赢得首场大奖赛", category: "race" },

  // ── September ──────────────────────────────────────────────────────────────
  { month: 9, day: 1, year: 1985, event: "Italian GP: Ayrton Senna takes his first F1 pole position at Monza", eventZh: "意大利大奖赛：塞纳在蒙扎取得首个F1杆位", category: "record" },
  { month: 9, day: 2, year: 2012, event: "Belgian GP: Jenson Button wins chaotic race at Spa", eventZh: "比利时大奖赛：巴顿在斯帕混乱的比赛中获胜", category: "race" },
  { month: 9, day: 5, year: 2010, event: "Italian GP: Fernando Alonso wins at Monza for Ferrari", eventZh: "意大利大奖赛：阿隆索驾驶法拉利在蒙扎获胜", category: "race" },
  { month: 9, day: 10, year: 2006, event: "Italian GP: Michael Schumacher announces retirement from F1 (first time)", eventZh: "意大利大奖赛：迈克尔·舒马赫首次宣布退出F1", category: "championship" },
  { month: 9, day: 12, year: 2021, event: "Italian GP: Ricciardo wins at Monza — McLaren 1-2 finish", eventZh: "意大利大奖赛：里卡多在蒙扎获胜——迈凯伦包揽前二", category: "race" },
  { month: 9, day: 14, year: 2008, event: "Italian GP: Vettel wins his first F1 race in the rain at Monza with Toro Rosso", eventZh: "意大利大奖赛：维特尔在蒙扎雨战中驾驶红牛二队赢得首场F1胜利", category: "record" },
  { month: 9, day: 17, year: 2023, event: "Singapore GP: Carlos Sainz breaks Verstappen's 10-race winning streak", eventZh: "新加坡大奖赛：卡洛斯·塞恩斯打破维斯塔潘的十连胜", category: "race" },
  { month: 9, day: 22, year: 2019, event: "Singapore GP: Vettel wins in Singapore with undercut strategy", eventZh: "新加坡大奖赛：维特尔凭借底切策略在新加坡获胜", category: "race" },
  { month: 9, day: 26, year: 2004, event: "Chinese GP: Rubens Barrichello wins inaugural Chinese Grand Prix", eventZh: "中国大奖赛：巴里切罗赢得首届中国大奖赛", category: "race" },
  { month: 9, day: 30, year: 1997, event: "Max Verstappen born in Hasselt, Belgium", eventZh: "马克斯·维斯塔潘出生于比利时哈塞尔特", category: "debut" },

  // ── October ────────────────────────────────────────────────────────────────
  { month: 10, day: 2, year: 2022, event: "Japanese GP: Verstappen clinches 2nd World Championship at Suzuka", eventZh: "日本大奖赛：维斯塔潘在铃鹿锁定第二个世界冠军", category: "championship" },
  { month: 10, day: 5, year: 2014, event: "Japanese GP: Jules Bianchi suffers fatal crash at Suzuka", eventZh: "日本大奖赛：朱尔斯·比安奇在铃鹿遭遇致命事故", category: "tragedy" },
  { month: 10, day: 8, year: 2023, event: "Qatar GP: Verstappen wins sprint and race, clinches 3rd World Championship", eventZh: "卡塔尔大奖赛：维斯塔潘赢得冲刺赛和正赛，锁定第三个世界冠军", category: "championship" },
  { month: 10, day: 12, year: 2003, event: "Japanese GP: Rubens Barrichello wins, but Schumacher's 8th place is enough for 6th title", eventZh: "日本大奖赛：巴里切罗获胜，但舒马赫第八名足以锁定第六个冠军", category: "championship" },
  { month: 10, day: 13, year: 1985, event: "European GP: Mansell wins his first GP at Brands Hatch", eventZh: "欧洲大奖赛：曼塞尔在布兰兹哈奇赢得首场大奖赛", category: "race" },
  { month: 10, day: 19, year: 2008, event: "Chinese GP: Hamilton wins to set up title decider in Brazil", eventZh: "中国大奖赛：汉密尔顿获胜为巴西站的冠军决战做铺垫", category: "race" },
  { month: 10, day: 21, year: 2007, event: "Brazilian GP: Raikkonen wins race and championship by one point — greatest F1 finale", eventZh: "巴西大奖赛：莱科宁以一分之差赢得比赛和冠军——F1最伟大的收官战", category: "championship" },
  { month: 10, day: 22, year: 2023, event: "US GP: Verstappen wins at COTA in dominant display", eventZh: "美国大奖赛：维斯塔潘在COTA统治性获胜", category: "race" },
  { month: 10, day: 25, year: 2009, event: "Brazilian GP: Jenson Button finishes 5th to seal World Championship for Brawn GP", eventZh: "巴西大奖赛：巴顿第五名完赛为布朗GP锁定世界冠军", category: "championship" },
  { month: 10, day: 27, year: 2019, event: "Mexican GP: Hamilton clinches 6th World Championship", eventZh: "墨西哥大奖赛：汉密尔顿锁定第六个世界冠军", category: "championship" },
  { month: 10, day: 30, year: 2005, event: "Brazilian GP: Juan Pablo Montoya's last win before leaving F1", eventZh: "巴西大奖赛：蒙托亚离开F1前的最后一场胜利", category: "race" },

  // ── November ───────────────────────────────────────────────────────────────
  { month: 11, day: 2, year: 2008, event: "Brazilian GP: Hamilton wins first World Championship on last corner of last lap", eventZh: "巴西大奖赛：汉密尔顿在最后一圈最后一个弯道赢得首个世界冠军", category: "championship" },
  { month: 11, day: 3, year: 2019, event: "US GP: Bottas wins at COTA, Hamilton clinches 6th title", eventZh: "美国大奖赛：博塔斯在COTA获胜，汉密尔顿锁定第六冠", category: "race" },
  { month: 11, day: 5, year: 2006, event: "Brazilian GP: Schumacher's final race (first retirement) — emotional farewell", eventZh: "巴西大奖赛：舒马赫的最后一场比赛（首次退役）——感人的告别", category: "championship" },
  { month: 11, day: 12, year: 2017, event: "Brazilian GP: Vettel wins at Interlagos in classic drive", eventZh: "巴西大奖赛：维特尔在英特拉格斯经典驾驶获胜", category: "race" },
  { month: 11, day: 14, year: 2021, event: "Brazilian GP: Hamilton charges from P10 to win after sprint disqualification", eventZh: "巴西大奖赛：汉密尔顿在冲刺赛被罚后从第10位逆袭获胜", category: "race" },
  { month: 11, day: 15, year: 2020, event: "Turkish GP: Hamilton wins 7th World Championship, equaling Schumacher's record", eventZh: "土耳其大奖赛：汉密尔顿赢得第七个世界冠军，追平舒马赫纪录", category: "championship" },
  { month: 11, day: 17, year: 2013, event: "US GP: Vettel wins 8th consecutive race to close dominant season", eventZh: "美国大奖赛：维特尔连续第八场获胜为统治级赛季收官", category: "record" },
  { month: 11, day: 18, year: 2023, event: "Las Vegas GP inaugural race: Verstappen wins first-ever Las Vegas F1 GP", eventZh: "拉斯维加斯大奖赛首届比赛：维斯塔潘赢得首届拉斯维加斯F1大奖赛", category: "race" },
  { month: 11, day: 22, year: 2020, event: "Bahrain GP: Romain Grosjean survives horrific fireball crash", eventZh: "巴林大奖赛：格罗斯让在惊人的火球事故中幸存", category: "tragedy" },
  { month: 11, day: 25, year: 2012, event: "Brazilian GP: Vettel wins 3rd consecutive World Championship in dramatic finale", eventZh: "巴西大奖赛：维特尔在戏剧性收官战中赢得三连冠", category: "championship" },

  // ── December ───────────────────────────────────────────────────────────────
  { month: 12, day: 1, year: 2019, event: "Abu Dhabi GP: Hamilton wins season finale at Yas Marina", eventZh: "阿布扎比大奖赛：汉密尔顿在亚斯码头赢得赛季收官战", category: "race" },
  { month: 12, day: 3, year: 2023, event: "Abu Dhabi GP: Verstappen wins final race of dominant 19-win season", eventZh: "阿布扎比大奖赛：维斯塔潘赢得统治级19胜赛季的最后一场比赛", category: "record" },
  { month: 12, day: 8, year: 2024, event: "Abu Dhabi GP: Season finale of the 2024 championship", eventZh: "阿布扎比大奖赛：2024赛季收官战", category: "race" },
  { month: 12, day: 10, year: 1996, event: "FIA Prize Gala: Damon Hill crowned 1996 World Champion", eventZh: "FIA颁奖典礼：达蒙·希尔加冕1996年世界冠军", category: "championship" },
  { month: 12, day: 12, year: 2021, event: "Abu Dhabi GP: Verstappen overtakes Hamilton on last lap to win first World Championship", eventZh: "阿布扎比大奖赛：维斯塔潘在最后一圈超越汉密尔顿赢得首个世界冠军", category: "championship" },
  { month: 12, day: 13, year: 2020, event: "Abu Dhabi GP: Verstappen wins season finale as Hamilton misses race with COVID", eventZh: "阿布扎比大奖赛：维斯塔潘赢得赛季收官战，汉密尔顿因新冠缺席", category: "race" },
  { month: 12, day: 17, year: 2009, event: "Michael Schumacher announces F1 comeback with Mercedes for 2010", eventZh: "迈克尔·舒马赫宣布2010年加盟梅赛德斯重返F1", category: "debut" },
  { month: 12, day: 20, year: 2004, event: "FIA Prize Gala: Schumacher honored for record 7th World Championship", eventZh: "FIA颁奖典礼：舒马赫因创纪录的第七个世界冠军受到表彰", category: "championship" },
  { month: 12, day: 25, year: 1946, event: "Niki Lauda's rival James Hunt born on Christmas Day in Belmont, London", eventZh: "劳达的对手詹姆斯·亨特在圣诞节出生于伦敦贝尔蒙特", category: "debut" },
  { month: 12, day: 29, year: 1958, event: "FIA confirms final 1958 championship standings — Hawthorn champion by one point", eventZh: "FIA确认1958年最终积分榜——霍索恩以一分之差成为冠军", category: "championship" },
];

/**
 * Returns all F1 events for a given month/day.
 * If no events match the exact date, returns the nearest upcoming events
 * (wrapping around to January if needed).
 */
export function getOnThisDay(month: number, day: number): { events: F1Event[]; isExact: boolean; fallbackDate?: { month: number; day: number } } {
  const exact = F1_EVENTS.filter((e) => e.month === month && e.day === day);
  if (exact.length > 0) {
    return { events: exact, isExact: true };
  }

  // Find the nearest upcoming event
  const todayValue = month * 100 + day;

  // Sort events by how far they are in the future from today (wrapping at year end)
  const sorted = [...F1_EVENTS].sort((a, b) => {
    const aVal = a.month * 100 + a.day;
    const bVal = b.month * 100 + b.day;
    const aDist = aVal >= todayValue ? aVal - todayValue : aVal + 1231 - todayValue;
    const bDist = bVal >= todayValue ? bVal - todayValue : bVal + 1231 - todayValue;
    return aDist - bDist;
  });

  // Get events on the nearest date
  const nearest = sorted[0];
  const nearestEvents = F1_EVENTS.filter((e) => e.month === nearest.month && e.day === nearest.day);

  return {
    events: nearestEvents,
    isExact: false,
    fallbackDate: { month: nearest.month, day: nearest.day },
  };
}
