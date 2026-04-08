# F1 Pulse — Claude Code Instructions

## Project Overview
F1 Pulse is a bilingual (EN/ZH) F1 analytics & betting intelligence platform. It aggregates race data, Polymarket odds, sponsorship intelligence, and F1-adjacent stock data into a dark-mode-first dashboard.

- **Live URL:** https://f1-pulse-three.vercel.app
- **Full spec:** See `F1_PULSE_SPEC.md` for design system, route map, and project history

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- Tailwind CSS 4 (dark-mode first), shadcn/ui 4
- Recharts for data viz, SWR for client-side polling
- next-intl for i18n (EN/ZH), middleware-based locale routing
- Hosted on Vercel with ISR caching

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

### Routing
All pages are under `src/app/[locale]/`. Root `/` redirects to `/en`. Locale switcher in header toggles `/en` ↔ `/zh`.

### Data Strategy
API-first with static fallbacks:
1. Try live API data (ISR with revalidation intervals)
2. If API fails, fall back to hardcoded 2026 season data in `src/lib/data/`
3. Client-side: SWR polls Polymarket odds every 60s

### External APIs
- **Jolpica/Ergast** (`api.jolpi.ca/ergast/f1`) — historical F1 data, no auth, 1h revalidation
- **OpenF1** (`api.openf1.org/v1`) — live session data, no auth, 5min revalidation
- **Polymarket** (Gamma + CLOB APIs) — market odds, no auth, 60s polling
- **OpenWeatherMap** — race weather, requires `OPENWEATHERMAP_API_KEY`

### Key Directories
- `src/app/api/` — API routes (drivers, markets, races, teams)
- `src/lib/api/` — External API clients (ergast, openf1, polymarket, weather)
- `src/lib/data/` — Data fetching + hardcoded fallbacks (drivers, races, teams, markets, stocks, sponsorships)
- `src/components/` — UI components organized by feature (charts, markets, races, layout, ui)
- `messages/` — i18n JSON files (en.json, zh.json, 133+ keys each)

## Design System
- Dark-mode first, data-dense, motorsport editorial aesthetic
- Custom `f1-*` CSS utility classes defined in `src/app/globals.css`
- Fonts: Oswald (headings), Inter (body), JetBrains Mono (data/numbers)
- Primary accent: `#E10600` (F1 red)
- Each team has a designated color — see `src/lib/data/transformers.ts`
- Always use `f1-*` typography classes, not raw Tailwind text utilities

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENWEATHERMAP_API_KEY
```

## Conventions
- All i18n keys go in both `messages/en.json` and `messages/zh.json` — maintain full parity
- Use `useTranslations()` from next-intl for all user-facing strings
- Driver/race/circuit names have standard Chinese transliterations in zh.json
- Prefer Server Components; use `"use client"` only when needed (SWR, interactivity)
- Deploy: push to `main` triggers Vercel auto-deploy
