import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply to using ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms &amp; Conditions</h1>
      <p className="!mt-2 text-sm !text-zinc-500">Last updated {POLICY_UPDATED}</p>

      <p>
        These terms cover your use of {SITE_NAME} (&ldquo;the site&rdquo;). By using the
        site you accept them. If you do not, please stop using it.
      </p>

      <h2>1. What the site is</h2>

      <p>
        {SITE_NAME} is an informational, read-only viewer for publicly available prediction
        market data. It displays odds, volume, liquidity, order books, price history and
        public activity sourced from Polymarket&apos;s public APIs.
      </p>

      <p>
        The site is not a broker, exchange, market maker or custodian. It does not accept
        deposits, hold funds, execute orders or maintain user accounts. Where an action
        requires a funded Polymarket account, the site links to Polymarket and the
        transaction happens entirely there, under Polymarket&apos;s own terms.
      </p>

      <h2>2. Not financial advice</h2>

      <p>
        Nothing on the site is financial, investment, legal or tax advice, or a
        recommendation to enter any position. Prices and probabilities shown are market
        data, not predictions or endorsements by us. Any decision you make after reading
        the site is yours alone.
      </p>

      <h2>3. Accuracy and availability</h2>

      <p>
        Data is fetched from third-party APIs and shown broadly as received. It may be
        delayed, incomplete, out of date or unavailable, and an upstream outage can leave
        parts of a page empty. We do not verify or guarantee it. Figures refresh
        periodically while a page is open and are a snapshot, not a live tick-by-tick feed.
      </p>

      <p>
        We may change, suspend or withdraw any part of the site at any time without notice.
      </p>

      <h2>4. Acceptable use</h2>

      <p>You agree not to:</p>

      <ul>
        <li>
          use the site unlawfully, or in any way that interferes with it or with other
          people&apos;s use of it;
        </li>
        <li>
          scrape, overload or place automated load on the site or the upstream APIs it
          calls;
        </li>
        <li>
          attempt to gain unauthorised access to any part of the site or its
          infrastructure; or
        </li>
        <li>
          present the site&apos;s data as your own, or as verified or endorsed by
          Polymarket.
        </li>
      </ul>

      <p>
        Prediction markets are restricted or prohibited in some jurisdictions. Complying
        with the law that applies to you is your responsibility.
      </p>

      <h2>5. Third-party data and links</h2>

      <p>
        Market data, market artwork, usernames and comments originate from Polymarket and
        remain the property of Polymarket or their respective owners. Comments and
        usernames are user-generated content published by third parties; they are shown as
        returned by the API and do not represent our views.
      </p>

      <p>
        Outbound links are provided for convenience. We do not control third-party sites
        and are not responsible for their content or practices.
      </p>

      <h2>6. Intellectual property</h2>

      <p>
        The site&apos;s own design, layout and source code belong to us. Third-party data
        and trademarks shown on the site belong to their respective owners, and no
        affiliation with or endorsement by Polymarket is claimed or implied.
      </p>

      <h2>7. Disclaimer and liability</h2>

      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
        warranties of any kind, express or implied, including fitness for a particular
        purpose and accuracy of information.
      </p>

      <p>
        To the fullest extent permitted by law, we are not liable for any loss or damage —
        including trading losses, lost profits, or loss of data — arising from your use of,
        or inability to use, the site or the data it displays. Nothing in these terms
        excludes liability that cannot lawfully be excluded.
      </p>

      <h2>8. Changes to these terms</h2>

      <p>
        We may update these terms from time to time. The &ldquo;last updated&rdquo; date
        above reflects the current version, and continuing to use the site after a change
        means you accept it.
      </p>

      <h2>9. Contact</h2>

      <p>
        Questions about these terms can go to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through the{" "}
        <Link href="/contact">contact page</Link>. See also our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </>
  );
}
