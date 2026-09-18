import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data. There are no accounts, no analytics and no tracking cookies.`,
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="!mt-2 text-sm !text-zinc-500">Last updated {POLICY_UPDATED}</p>

      <p>
        Short version: {SITE_NAME} has no accounts, sets no tracking cookies, runs no
        analytics and asks you for nothing. This page describes the little data that is
        involved anyway.
      </p>

      <h2>What we do not collect</h2>

      <ul>
        <li>No sign-up, login, profile or wallet connection — so no account data exists.</li>
        <li>No tracking or advertising cookies, and no third-party analytics scripts.</li>
        <li>No cross-site tracking, fingerprinting, profiling or ad targeting.</li>
        <li>We do not sell, rent or share personal information, because we do not hold any.</li>
      </ul>

      <h2>What happens when you use the site</h2>

      <h3>Server logs</h3>

      <p>
        Like any website, requests reach a server and our hosting provider may record
        standard technical information — IP address, timestamp, requested URL, user agent —
        for security, abuse prevention and debugging. We do not use these logs to build
        profiles, and they are retained only as long as the provider&apos;s normal
        operational needs require.
      </p>

      <h3>Requests to Polymarket</h3>

      <p>
        Market data is fetched from Polymarket&apos;s public APIs. Those requests are made
        by our server, not your browser, so your IP address is not passed to Polymarket
        when a page loads. Market images are served through our own image optimiser for the
        same reason.
      </p>

      <p>
        If you follow an outbound link to Polymarket, you leave this site and
        Polymarket&apos;s own privacy policy applies from that point.
      </p>

      <h3>Your search terms and filters</h3>

      <p>
        Searches and category filters are held in the page URL and sent to our server to
        fetch matching markets. They are not stored against any identity, because there is
        no identity to store them against.
      </p>

      <h3>Fonts and assets</h3>

      <p>
        The site&apos;s typeface is self-hosted and served from our own domain. No fonts,
        stylesheets or scripts are loaded from third-party CDNs, so no third party sees your
        visit.
      </p>

      <h2>Clipboard and the contact form</h2>

      <p>
        The &ldquo;Copy link&rdquo; button writes the current page URL to your clipboard
        locally; nothing is transmitted.
      </p>

      <p>
        The <Link href="/contact">contact form</Link> has no backend. Submitting it builds a
        pre-filled draft and hands it to your own email client — what you typed never
        reaches our server. Once you send that email, we hold it as we would any
        correspondence, and use it only to reply.
      </p>

      <h2>Your rights</h2>

      <p>
        Depending on where you live you may have rights to access, correct or delete
        personal data held about you, or to object to its processing. Since the only
        personal data we might hold is an email you chose to send us, such a request is
        usually a matter of asking us to delete that correspondence — write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will action it.
      </p>

      <h2>Children</h2>

      <p>
        The site is not directed at children, and we do not knowingly collect information
        from them.
      </p>

      <h2>Changes to this policy</h2>

      <p>
        If the site ever starts collecting something — analytics, for example — this page
        will be updated before that happens, and the &ldquo;last updated&rdquo; date above
        will change.
      </p>

      <h2>Contact</h2>

      <p>
        Privacy questions can go to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </>
  );
}
