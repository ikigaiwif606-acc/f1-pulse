# F1 Pulse — Project Specification

> F1 Analytics & Betting Intelligence Platform
> Bilingual (EN/ZH) | Polymarket Integration | Dark-Mode First
> Last updated: 2026-03-17

---

## 1. Project Overview

### Vision

F1 Pulse is a bilingual (English/Simplified Chinese) analytics platform that serves as the intelligence layer for F1 betting on Polymarket. It aggregates real-time race data, historical performance analytics, live Polymarket odds, team sponsorship intelligence, and F1-adjacent stock market data into a unified dashboard.

### Target Users

- **Primary:** Crypto-native F1 fans who bet (or want to bet) on Polymarket
- **Secondary:** Chinese-language F1 enthusiasts underserved by English-only tools
- **Tertiary:** Data-curious F1 fans who want deeper race analytics

### Core Value Proposition

- Everything an F1 bettor needs in one place — no more checking 10 tabs
- Polymarket odds displayed alongside the data that moves them
- Only bilingual (EN/ZH) F1 analytics platform in existence
- Sponsorship & stock tracker connecting on-track performance to business outcomes

### Live URL

`https://f1-pulse-three.vercel.app`

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 | SSR + ISR for performance |
| Language | TypeScript | 5.x | Strict mode |
| Runtime | React | 19.2.3 | Server + Client components |
| Styling | Tailwind CSS | 4.x | Dark mode first, custom design tokens |
| UI Components | shadcn/ui | 4.0.8 | Customized to F1 design system |
| Data Visualization | Recharts | 3.8.0 | Line charts, sparklines |
| i18n | next-intl | 4.8.3 | Server component compatible |
| Data Fetching | SWR | 2.4.1 | Client-side polling for live odds |
| Database | Supabase | 2.99.2 | Configured, not actively used yet |
| Icons | Lucide React | 0.577.0 | SVG icon library |
| Animations | tw-animate-css | 1.4.0 | Tailwind animation utilities |
| Fonts | Google Fonts | — | Inter, Oswald, JetBrains Mono |
| Hosting | Vercel | — | Edge functions, ISR caching |
| Package Manager | npm | — | |

---

## 3. Project Structure

```
f1-pulse/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (fonts, metadata)
│   │   ├── page.tsx                      # Root redirect
│   │   ├── globals.css                   # Design system
│   │   ├── api/
│   │   │   ├── drivers/route.ts
│   │   │   ├── markets/route.ts
│   │   │   ├── races/route.ts
│   │   │   └── teams/route.ts
│   │   └── [locale]/
│   │       ├── layout.tsx                # Locale layout
│   │       ├── page.tsx                  # Homepage
│   │       ├── loading.tsx               # Skeleton loading
│   │       ├── races/
│   │       │   ├── page.tsx              # Race calendar
│   │       │   └── [id]/page.tsx         # Race detail
│   │       ├── drivers/
│   │       │   ├── page.tsx              # Drivers grid (by team)
│   │       │   └── [id]/page.tsx         # Driver profile
│   │       ├── teams/
│   │       │   ├── page.tsx              # Teams list
│   │       │   └── [id]/page.tsx         # Team detail
│   │       ├── markets/page.tsx          # Polymarket odds
│   │       ├── analytics/page.tsx        # Analytics Lab
│   │       ├── sponsorships/page.tsx     # Sponsorship tracker
│   │       └── stocks/page.tsx           # Stock tracker
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx                # Sticky nav + locale switcher
│   │   │   └── footer.tsx
│   │   ├── charts/
│   │   │   ├── points-chart.tsx          # Season points line chart
│   │   │   └── stock-sparkline.tsx       # 30-day sparkline
│   │   ├── markets/
│   │   │   ├── odds-summary.tsx          # Championship odds (SWR)
│   │   │   └── markets-content.tsx       # Tabbed markets view
│   │   ├── races/
│   │   │   └── race-countdown.tsx        # Live countdown timer
│   │   ├── shared/
│   │   │   └── skeleton.tsx              # Loading skeletons
│   │   └── ui/                           # shadcn primitives
│   ├── lib/
│   │   ├── api/
│   │   │   ├── ergast.ts                 # Jolpica/Ergast API client
│   │   │   ├── openf1.ts                 # OpenF1 live data
│   │   │   ├── polymarket.ts             # Polymarket CLOB + Gamma
│   │   │   └── weather.ts               # OpenWeatherMap
│   │   ├── data/
│   │   │   ├── home.ts                   # Homepage aggregation
│   │   │   ├── races.ts                  # Race list + fallback
│   │   │   ├── race-detail.ts            # Individual race data
│   │   │   ├── drivers.ts                # Driver list + fallback
│   │   │   ├── driver-detail.ts          # Individual driver data
│   │   │   ├── driver-profiles.ts        # 22 driver bios (2026)
│   │   │   ├── teams.ts                  # Team list + fallback
│   │   │   ├── team-detail.ts            # Individual team data
│   │   │   ├── markets.ts               # Market data + fallback
│   │   │   ├── sponsorships.ts          # Sponsorship database
│   │   │   ├── stocks.ts               # F1 stock data
│   │   │   └── transformers.ts          # Team colors, code transforms
│   │   ├── i18n/
│   │   │   ├── config.ts               # Locales: en, zh
│   │   │   ├── routing.ts
│   │   │   ├── navigation.ts           # Link, useRouter, usePathname
│   │   │   └── request.ts
│   │   ├── hooks/
│   │   │   └── use-markets.ts          # SWR polling (60s refresh)
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── types/index.ts                   # All TypeScript interfaces
│   └── middleware.ts                    # i18n routing middleware
├── messages/
│   ├── en.json                          # English (133+ keys)
│   └── zh.json                          # Chinese Simplified
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── components.json                      # shadcn config
└── .vercel/project.json
```

---

## 4. Design System

### Philosophy

Dark-mode first, data-dense, motorsport editorial aesthetic inspired by landonorris.com. Progressive disclosure through expandable sections. High contrast for readability during race weekends.

### Color Tokens

```css
/* Core */
--background: #080808;        /* Near-black background */
--card: #0f0f0f;              /* Card surfaces */
--accent: #131313;            /* Inner surfaces */
--border: #1c1c1c;            /* Default borders */

/* Text (WCAG AA compliant) */
--foreground: #ededed;        /* Primary text */
.f1-label color: #777;        /* Secondary labels */
.f1-label-xs color: #666;     /* Tertiary metadata */

/* Accent — F1 Red */
--primary: #E10600;           /* Official F1 red */

/* Semantic */
Positive: #22c55e             /* Gains, value bets */
Negative: #E10600             /* Losses, DNF, drops */
Warning:  #f59e0b             /* Safety car, caution */

/* Team Colors */
Mercedes:     #27F4D2    Ferrari:      #E80020
McLaren:      #FF8000    Red Bull:     #3671C6
Aston Martin: #229971    Alpine:       #0093CC
Williams:     #1868DB    Racing Bulls: #6692FF
Haas:         #B6BABD    Audi:         #00594F
Cadillac:     #C0C0C0
```

### Typography

| Class | Font | Size | Weight | Use |
|---|---|---|---|---|
| `.f1-display-xl` | Oswald | clamp(2rem, 5vw, 3.5rem) | 700 | Hero titles |
| `.f1-display-lg` | Oswald | clamp(1.5rem, 3vw, 2.25rem) | 700 | Page titles |
| `.f1-display-md` | Oswald | clamp(0.875rem, 1.5vw, 1.125rem) | 600 | Section headers |
| `.f1-heading` | Oswald | clamp(0.8125rem, 1.2vw, 0.9375rem) | 600 | Card titles |
| `.f1-body` | Inter | 13px | 500 | Body text |
| `.f1-body-sm` | Inter | 12px | 500 | Compact text |
| `.f1-label` | Inter | 10px, uppercase | 600 | Metadata |
| `.f1-label-xs` | Inter | 9px, uppercase | 700 | Timestamps |
| `.f1-data` | JetBrains Mono | inherited | 600 | Numbers |
| `.f1-data-lg` | JetBrains Mono | clamp(1.25rem, 2.5vw, 2rem) | 700 | Stats |
| `.f1-data-xl` | JetBrains Mono | clamp(1.75rem, 4vw, 2.75rem) | 700 | Countdown |

### Component Classes

| Class | Purpose |
|---|---|
| `.f1-surface` | Standard card (bg #0f0f0f, border #1c1c1c) |
| `.f1-surface-primary` | Featured card (glow border, subtle shadow) |
| `.f1-surface-tertiary` | Minimal card (background only) |
| `.f1-surface-inner` | Nested element (bg #0a0a0a) |
| `.f1-accent-bar` | Red 2px vertical section marker |
| `.f1-team-bar` | Colored 2px team indicator |
| `.f1-transition` | 0.5s cubic-bezier transition |
| `.f1-hover` | Lift effect (-1px translateY) |
| `.f1-hover-scale` | Scale effect (1.01x) |
| `.animate-fade-up` | Entrance animation (16px slide + fade) |
| `.animate-live` | Pulsing opacity for live indicators |
| `.glow-red` | Red box-shadow glow |
| `.bg-grid` | Subtle red grid pattern background |

### Animations

```css
--ease: cubic-bezier(0.65, 0.05, 0, 1);  /* F1-inspired curve */
--duration: 0.5s;

fade-up: opacity 0→1, translateY 16px→0 (0.6s)
live-pulse: opacity 1→0.25→1 (2s loop)
stagger-1 through stagger-4: 50ms delay increments
```

---

## 5. Pages & Features

### Route Map

```
/[locale]                    → Homepage (dashboard)
/[locale]/races              → 22-race 2026 calendar
/[locale]/races/[id]         → Race detail (sessions, weather, odds, history)
/[locale]/drivers            → 22 drivers grouped by 11 teams
/[locale]/drivers/[id]       → Driver profile (stats, bio, H2H, circuits)
/[locale]/teams              → 11 constructors
/[locale]/teams/[id]         → Team detail (drivers, stats, odds)
/[locale]/markets            → Polymarket hub (championship, race, props)
/[locale]/analytics          → Analytics Lab (7 data sections + charts)
/[locale]/sponsorships       → Sponsorship tracker (11 teams + F1 global)
/[locale]/stocks             → F1 stock tracker (7 tickers + correlation)
```

### Homepage

- Pulsing hero glow + live indicator badge
- Next race countdown timer (days/hours/min/sec)
- Championship odds (SWR 60s refresh, top 5 drivers)
- Top odds movers (24h changes with direction arrows)
- Championship standings (top 5 with progress bars)
- Recent race results (last completed rounds)
- Latest sponsorship deals (links to /sponsorships)

### Drivers Grid

- Grouped by team (11 blocks, 2 drivers each)
- Per driver: nationality flag, age, height, weight, salary, car model
- Stats row: PTS, WIN, POD, POL
- Responsive: 1-col mobile, 2-col tablet+

### Analytics Lab

1. **Qualifying Pace** — Top 10 drivers, gap to pole
2. **Safety Car Probability** — 12 circuits, historical rates
3. **DNF Rate** — All 11 teams
4. **Season Points Progression** — Recharts line chart (top 6 drivers)
5. **Teammate Battles** — All 11 pairings, quali/race H2H
6. **Grid vs Finish** — Top 10, place gains/losses
7. **Betting Edge Finder** — Polymarket odds vs actual points share

### Sponsorship Tracker

- 11 teams with curated sponsor data
- Deal type badges: Title, Major, Technical, Official
- Reported values and contract end dates
- F1 Global Partners section (LVMH, Aramco, DHL, Pirelli, etc.)
- Summary stats: total partners, title sponsors, top deal

### Stock Tracker

- 7 tickers: RACE, AML, FWONA, MBG, VOW3, GM, RNO
- Stock cards: price, 1D/1W/YTD changes, 30-day sparkline
- 52-week range dot indicator
- Summary bar: avg daily change, best/worst YTD
- Race-stock correlation insights
- Full data table (responsive mobile/desktop)

---

## 6. External APIs

| API | Base URL | Auth | Revalidation | Purpose |
|---|---|---|---|---|
| Jolpica/Ergast | `api.jolpi.ca/ergast/f1` | None | 1 hour | Historical F1 data, standings |
| OpenF1 | `api.openf1.org/v1` | None | 5 min | Live sessions, positions, laps |
| Polymarket Gamma | `gamma-api.polymarket.com` | None | 60s | Market search/browse |
| Polymarket CLOB | `clob.polymarket.com` | None | 60s | Live pricing |
| OpenWeatherMap | `api.openweathermap.org` | API key | 30 min | Race weather forecasts |

### Data Strategy

All pages use **API-first with static fallbacks**:
1. Try live API data (ISR with revalidation)
2. If API fails or returns empty, fall back to hardcoded 2026 season data
3. Client-side: SWR for Polymarket odds (60s polling)

---

## 7. Internationalization

| Locale | File | Keys |
|---|---|---|
| English | `messages/en.json` | 133+ |
| Chinese Simplified | `messages/zh.json` | 133+ (full parity) |

### Sections

`common`, `nav`, `home`, `race`, `driver`, `team`, `markets`, `analytics`, `stocks`, `sponsorships`, `footer`

### Features

- Route prefix: `/en/...`, `/zh/...`
- Middleware redirect: `/` → `/en`
- Locale switcher in header (中文 / ENG toggle)
- Race/circuit names have Chinese translations
- Driver names use standard transliterations

---

## 8. Deployment

### Vercel

- **Project**: `f1-pulse` (prj_YZUCpwPsqXVWyZ5U8aCS73w1CCxi)
- **Auto-deploy**: Push to `main` triggers build
- **ISR caching**: Per-page revalidation
- **Edge**: Middleware runs on Vercel Edge

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENWEATHERMAP_API_KEY=your-api-key
```

---

## 9. Development History

30 commits from initial scaffold to current state:

1. **Phase 0**: Next.js scaffold, dark theme, typography system, i18n
2. **Phase 1a**: Race calendar, driver profiles, team pages, detail pages
3. **Phase 1b**: Polymarket integration, live odds, markets page
4. **Phase 1c**: Sponsorship tracker, stock tracker
5. **Phase 2**: Analytics lab (7 sections), Recharts visualizations
6. **Polish**: UI/UX overhaul (accessibility, animations, navigation, loading states)

### Key Metrics

- **11 pages** + detail pages (22 races, 22 drivers, 11 teams)
- **22 drivers** with full bio data (DOB, height, weight, salary, chassis)
- **11 teams** with curated sponsorship data (60+ partnerships)
- **7 stock tickers** with sparklines and correlation insights
- **4 external APIs** with automatic fallbacks
- **133+ i18n keys** in EN and ZH
- **Custom design system** with 15+ utility classes

---

*F1 Pulse — Built with Next.js 16, React 19, Tailwind CSS 4, Recharts, and Polymarket API*
