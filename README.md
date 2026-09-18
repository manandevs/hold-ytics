# Holdytic

A prediction-market explorer built on the [Polymarket Gamma API](https://gamma-api.polymarket.com).
Browse the most actively traded markets, search across all of Polymarket, and open any
market for live odds, price movement, volume and resolution rules.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys or environment variables are required — the Gamma API is public.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Production build                     |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Routes

| Route                                  | Rendering       | Purpose                                                |
| -------------------------------------- | --------------- | ------------------------------------------------------ |
| `/`                                    | Static, ISR 30s | Featured market + chart, hot topics, 16-market preview |
| `/markets`                             | Dynamic         | Every market: category tabs, search, load-more paging  |
| `/markets/[id]`                        | Dynamic         | Full market detail                                     |
| `/accuracy`                            | Static, ISR 6h  | Measured accuracy of resolved markets                  |
| `/about` `/contact` `/terms` `/privacy`| Static          | Secondary pages                                        |
| `/api/markets`                         | Route handler   | JSON feed used by the poller and load-more             |
| `/api/price-history`                   | Route handler   | Price series for the chart's time-range picker         |

`/markets` accepts `?q=` (search) and `?category=` (one of the slugs in `CATEGORIES`). Both
are resolved server-side and handed to the grid as initial data.

Every page is reachable from the header menu. Its links are rendered into the HTML even
while the menu is closed (via `hidden`), so crawlers and no-JS readers still see the
navigation.

## Project structure

Application code lives under `src/`; only configuration sits at the repo root.

```
src/
├── app/                         # routes only — no business logic
│   ├── api/
│   │   ├── markets/             # live market feed for the client poller
│   │   └── price-history/       # price series for the chart range picker
│   ├── markets/                 # all-markets list
│   ├── markets/[id]/            # market detail route
│   ├── accuracy/                # measured accuracy study
│   ├── (content)/               # About / Contact / Terms / Privacy
│   │   └── layout.tsx           # shared shell + prose typography
│   ├── error.tsx  layout.tsx  not-found.tsx  page.tsx
│   └── globals.css  icon.png
├── components/
│   ├── layout/                  # site chrome: Header, SearchInput
│   ├── markets/                 # the market domain
│   │   ├── home/                # home-page composition
│   │   ├── detail/              # detail-page composition
│   │   ├── MarketCard.tsx       # shared by both routes
│   │   └── PriceChart.tsx       # shared by both routes
│   ├── accuracy/                # charts for the accuracy study
│   └── ui/                      # domain-agnostic primitives
├── hooks/                       # useMarkets (live polling)
├── lib/
│   ├── cn.ts  format.ts         # generic helpers
│   ├── site.ts                  # site name, contact address, header nav
│   └── polymarket/              # the only code that talks to Polymarket
│       ├── client.ts            # base URLs, fetch policy, caching
│       ├── markets.ts           # markets, categories, featured, related
│       ├── prices.ts            # price history + chart intervals
│       ├── activity.ts          # order book, comments, holders, trades
│       └── accuracy.ts          # resolved-market scoring for /accuracy
└── types/                       # domain types
```

Conventions: components are `PascalCase.tsx`, everything else `camelCase.ts`,
folders are lowercase. All cross-folder imports use the `@/*` alias, which maps
to `src/*` — so moving a file never rewrites a relative path chain.

## Architecture

- **`lib/polymarket/` is the only place that talks to Polymarket.** `client.ts` owns the
  base URLs, the 30s cache window and the failure policy; the other three modules are split
  by responsibility and share it. Upstream failures resolve to empty results, so a page
  renders an empty state instead of crashing.
- **Two market shapes.** `MarketSummary` is a small projection (id, question, image, the
  two displayed outcomes, volume, end date) used by every list view; `Market` is the full
  object and is only used on the detail page. Projecting lists server-side keeps the
  serialized payload roughly a quarter of its raw size.
- **`lib/format.ts`** normalises the API's mixed string/number fields and renders every
  displayed value, so missing data shows an em dash rather than `$undefined`.
- **Categories are real.** `CATEGORIES` in `lib/polymarket/markets.ts` maps each tab to a Polymarket tag
  id (resolved once from `/tags/slug/<slug>`), which is passed through as `tag_id`. Every
  tab issues its own query rather than re-sorting markets already on the page.
- **Data flow.** Pages fetch on the server for the first paint; `useMarkets` then keeps the
  list fresh by polling `/api/markets` every 30s, carrying the active query and tag.
  Polling pauses while the tab is hidden and in-flight requests are aborted when superseded.
- **Charts** read `clob.polymarket.com/prices-history` for each outcome's CLOB token and
  draw inline SVG — no charting dependency. The two series use categorical slots 1 and 2 of
  the reference palette, validated for colorblind separation against white.

## What the detail page shows

Every panel is live data; the app places no orders and stores no accounts.

| Panel                  | Source                                                     |
| ---------------------- | ---------------------------------------------------------- |
| Price chart (1H → ALL) | `clob` `/prices-history`, refetched per range               |
| Order book             | `clob` `/book`, best-first with depth bars                  |
| Comments               | `gamma` `/comments` for the parent event                    |
| Top holders            | `data-api` `/holders`, per outcome                          |
| Activity               | `data-api` `/trades`                                        |
| Related markets        | `gamma` `/markets` filtered by the event's first tag        |
| FAQ                    | generated from this market's own figures, so it can't stale |

The sidebar shows live best bid/ask and spread from the order book, and links out to the
market on Polymarket — trading, posting comments and bookmarking all need a funded
Polymarket account, so they are deliberately not reimplemented here.

## The accuracy page

`/accuracy` is computed, not written. `lib/polymarket/accuracy.ts` samples resolved binary
markets, reads each one's price at six points before it closed, and scores those prices
against what actually happened:

- **Sample** — six pages of resolved markets ordered by volume, filtered to those that took
  at least $10k and stayed open 3+ days, then taken at an even stride across the volume
  range so the result isn't only mega-markets. Roughly 140 markets from a pool of ~590.
- **Cost** — two upstream calls per market (~7s cold). One 4-day window yields the
  1h/4h/12h/1d/3d prices; a second narrow window picks up the 1-month price. Cached for
  6 hours, and the page streams behind a Suspense boundary.
- **Output** — Brier score and accuracy per horizon, calibration (expected vs resolved by
  probability band), Brier by volume quartile, and the Yes/No split.

The Methods section on the page states the sample size, the filters and the known limits.
Figures move as new markets resolve.

Chart colours use categorical slots 1 and 2 of the reference palette, validated against a
white surface. Green/red was rejected for the Yes/No chart because that pair fails
colour-blind separation (deutan ΔE 5.8).

## Secondary pages

`/about`, `/contact`, `/terms` and `/privacy` share a layout in `app/(content)/` that owns
the container and the prose typography, so each page is plain semantic markup. Links inside
that prose are styled automatically; add `no-prose` to opt a link out (the CTA buttons use
it).

The Terms and Privacy copy describes what this app actually does — no accounts, no
analytics, no tracking cookies, server-side data fetching — so it stays accurate rather
than boilerplate. **Have a lawyer review both before you rely on them in production.**

The contact form has no backend: it composes a `mailto:` and hands it to the reader's mail
client, so nothing is submitted and no success state is faked. The destination address is
`CONTACT_EMAIL` in `lib/site.ts` and is currently a **placeholder** — point it at a real
inbox before going live.

## Stack

Next.js 16 (App Router, React Compiler) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP for entrance animations · lucide-react for icons.
