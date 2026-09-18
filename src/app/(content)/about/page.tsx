import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Holdytic is, where its data comes from, and what it deliberately does not do.",
};

export default function AboutPage() {
  return (
    <>
      <h1>About {SITE_NAME}</h1>

      <p>
        {SITE_NAME} is a read-only window onto prediction markets. It surfaces live odds,
        trading volume, order-book depth and price history for the most actively traded
        markets, so you can see what the crowd expects without signing up for anything.
      </p>

      <h2>Where the data comes from</h2>

      <p>
        Every figure on the site is pulled live from Polymarket&apos;s public APIs. Nothing
        is cached for long, estimated or filled in by hand:
      </p>

      <ul>
        <li>
          <strong>Markets, categories and search</strong> come from the Gamma API. Category
          tabs query Polymarket&apos;s own tag ids, so each one is a real filter rather than a
          re-sort of what is already loaded.
        </li>
        <li>
          <strong>Price history and order books</strong> come from the CLOB API, one series
          per outcome token.
        </li>
        <li>
          <strong>Comments, top holders and trade activity</strong> come from the public
          data API.
        </li>
      </ul>

      <p>
        Figures refresh roughly every 30 seconds while a tab is open, and polling pauses
        when the tab is hidden.
      </p>

      <h2>What it does not do</h2>

      <p>
        {SITE_NAME} places no orders, holds no funds and has no accounts. There is no
        wallet connection, no sign-up and no portfolio. Where an action needs a funded
        Polymarket account — placing a trade, posting a comment, bookmarking a market — the
        site links out to Polymarket instead of imitating the feature.
      </p>

      <p>
        Nothing here is financial advice, and market data can be delayed or incomplete. See
        the <Link href="/terms">Terms &amp; Conditions</Link> for the full position.
      </p>

      <h2>Privacy in one sentence</h2>

      <p>
        The site has no accounts, no analytics and no tracking cookies, and it collects no
        personal information. The <Link href="/privacy">Privacy Policy</Link> spells out
        the detail.
      </p>

      <h2>Built with</h2>

      <p>
        Next.js with the App Router, React, TypeScript and Tailwind CSS. Charts are drawn
        as inline SVG rather than pulling in a charting library, and their colours are
        checked for colour-blind separation against the page background.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonStyles("no-prose")}>
          Browse markets
        </Link>
        <Link
          href="/contact"
          className="no-prose inline-flex items-center justify-center rounded-2xl border-[3px] border-zinc-200 bg-white px-4 py-1.5 text-base font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57c]"
        >
          Get in touch
        </Link>
      </div>
    </>
  );
}
