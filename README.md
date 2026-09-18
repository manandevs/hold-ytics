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

| Route                | Rendering     | Purpose                                                 |
| -------------------- | ------------- | ------------------------------------------------------- |
| `/`                  | Dynamic       | Featured market + chart, hot topics, category nav, grid |
| `/markets/[id]`      | Dynamic       | Full market detail                                      |
| `/api/markets`       | Route handler | JSON feed used by the client-side live poller           |
| `/api/price-history` | Route handler | Price series for the chart's time-range picker          |

The home page accepts `?q=` (search) and `?category=` (one of the slugs in
`CATEGORIES`). Both are resolved server-side and handed to the grid as initial data.

## Architecture

- **`lib/api.ts`** is the only place that talks to Polymarket. `getMarkets()` lists open
  markets ordered by 24h volume, or routes free-text queries to the public search
  endpoint. `getMarketById()` fetches a single market. Upstream failures resolve to empty
  results so a page renders an empty state instead of crashing.
- **Two market shapes.** `MarketSummary` is a small projection (id, question, image, the
  two displayed outcomes, volume, end date) used by every list view; `Market` is the full
  object and is only used on the detail page. Projecting lists server-side keeps the
  serialized payload roughly a quarter of its raw size.
- **`lib/format.ts`** normalises the API's mixed string/number fields and renders every
  displayed value, so missing data shows an em dash rather than `$undefined`.
- **Categories are real.** `CATEGORIES` in `lib/api.ts` maps each tab to a Polymarket tag
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

## Stack

Next.js 16 (App Router, React Compiler) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP for entrance animations · lucide-react for icons.
