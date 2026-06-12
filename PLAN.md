# F1 Pulse — Full Redesign Plan (2026-06-12)

> **Status: SHIPPED 2026-06-12** — commits `c9a612a` (phases 0–3) and `729cd99`
> (⌘K palette, live deep-analytics stats, Jolpica pagination fix, OpenF1 key
> support), both deployed to production and verified live.
> Remaining ideas: OpenF1 API key in Vercel env to enable live timing;
> dynamize the tire-strategy card (needs OpenF1 stints data).

Goal: turn F1 Pulse into a live "trading terminal for F1" — correct data first, then a dense,
animated, odds-driven UI. Keep the existing brand DNA: dark broadcast theme, Oswald/Inter/
JetBrains Mono (deliberately chosen in commit 62c82ec), team colors, `f1-*` utility classes.

## Diagnosis (verified 2026-06-12)

- **OpenF1 API now returns HTTP 401** (auth required). `getRacesList()` falls back to
  `FALLBACK_RACES` frozen at "Round 3 next / 2 completed" → stale hero, countdown stuck at
  00:00:00, wrong OFF-SEASON badge. Jolpica (`api.jolpi.ca`) works and has all 2026 results.
- `/standings` URL 404s; nav "Standings" actually points to `/drivers` (confusing IA).
- Homepage hero is ~2.5 viewports of near-empty space; Markets page is 2 cards + dead space.
- 24H/7D trend columns render "—" placeholders; WDC odds duplicated on homepage.
- Analytics page content renders at ~0 opacity in headless Chrome (entrance animation bug).
- Contrast on secondary text below WCAG AA in places; tokens exist (`--text-dim` etc.) but
  components use raw inline styles instead.

## Phase 0 — Data integrity

1. Rewrite `src/lib/data/races.ts` on Jolpica: schedule + round winners, `completed`/`next`
   computed from current date. Static calendar stays as last-resort fallback only.
2. New `getSeasonStatus()` → `live | raceWeekend | midSeason | offSeason` + next race; drives
   the header badge (replaces hardcoded OFF-SEASON) and hero state.
3. Countdown becomes a state machine: upcoming → race weekend (session schedule highlighted,
   LIVE pulse during sessions) → "results coming" — never all-zeros.
4. New `/standings` page (drivers + constructors, points progression chart); nav points there.
5. Fix analytics page invisible-content animation bug.

## Phase 1 — Homepage command center

- Compact one-viewport hero: race info + countdown + weekend session timeline (left),
  live win-probability animated bars from Polymarket (right).
- Scrolling odds ticker strip under the header (stock-exchange style, SWR 60s).
- Bento grid below: standings w/ gap bars + movement arrows, market movers, latest podium,
  headlines. Kill the duplicated WDC odds card.

## Phase 2 — Interactivity

- Standings: cumulative points progression line chart (Recharts) from Jolpica results.
- Markets: real 24H change from Polymarket price history where available; odds flash
  green/red on change; sparklines fed by real series.
- Number-ticker animation for odds/points; staggered section reveals (CSS only, no new deps).
- ⌘K command palette (lightweight, no dep): jump to any driver / team / race.

## Phase 3 — Mobile & polish

- Mobile bottom tab bar (Home / Races / Markets / Standings) — app-like nav.
- Contrast pass: replace sub-AA greys on meaningful text with `--text-dim`/`--text-muted`.
- Loading skeletons for standings/markets; `error.tsx` boundaries; `prefers-reduced-motion`.
- Full EN/ZH parity for every new i18n key.

## Definition of Done

`npm run lint` ✓, `npm run build` ✓, dev server starts clean, headless screenshots of
/en, /en/standings, /en/markets, /en/races (desktop + 390px) look correct, then commit
and push to `main` (auto-deploys to Vercel).
