import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import ContactForm from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
};

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>

      <p>
        Questions, bug reports and feedback are all welcome. Fill in the form below and it
        will open a draft in your own mail client, or email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
      </p>

      <ContactForm />

      <h2>Before you write</h2>

      <p>A couple of things we cannot help with, so you don&apos;t lose time:</p>

      <ul>
        <li>
          <strong>Trades, balances and withdrawals.</strong> {SITE_NAME} is a read-only view
          of public data — it holds no funds and has no accounts. Anything to do with a
          position or a wallet has to go to Polymarket support.
        </li>
        <li>
          <strong>How a market will resolve.</strong> Resolution is decided by Polymarket
          against the rules printed on each market page, not by us.
        </li>
        <li>
          <strong>Wrong or missing market data.</strong> Worth reporting, but the figures
          come straight from Polymarket&apos;s API — if they are wrong at the source they
          will be wrong here too.
        </li>
      </ul>

      <h2>Reporting a problem</h2>

      <p>
        If something looks broken, the link to the page plus what you expected to see is
        usually enough to reproduce it. Screenshots help for layout issues.
      </p>

      <p>
        For background on what the site does and where its numbers come from, see{" "}
        <Link href="/about">About</Link>.
      </p>
    </>
  );
}
