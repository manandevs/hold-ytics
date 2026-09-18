import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data: optional accounts, no analytics and no tracking cookies.`,
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="!mt-2 text-sm !text-zinc-500">Last updated {POLICY_UPDATED}</p>

      <p>
        Short version: browsing {SITE_NAME} needs no account. If you choose to create one,
        we keep only what signing in requires. We set no tracking cookies and run no
        analytics. This page describes the data that is involved.
      </p>

      <h2>What we do not collect</h2>

      <ul>
        <li>No wallet connection, trading history or financial information.</li>
        <li>No tracking or advertising cookies, and no third-party analytics scripts.</li>
        <li>No cross-site tracking, fingerprinting, profiling or ad targeting.</li>
        <li>We do not sell or rent personal information, or share it for advertising.</li>
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

      <h3>Accounts</h3>

      <p>
        Creating an account is optional. Sign-in is handled by our authentication provider,
        Clerk, which stores your email address, the sign-in method you choose, and any name
        or profile image you add. Passwords are processed by Clerk and never reach our
        servers. Clerk&apos;s own privacy policy applies to that data.
      </p>

      <p>
        Signing in sets strictly necessary session cookies so you stay signed in between
        pages. They are not used for tracking or advertising, and signing out clears them.
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
        fetch matching markets. They are not stored against your account.
      </p>

      <h3>Fonts and assets</h3>

      <p>
        The site&apos;s typeface and stylesheets are self-hosted and served from our own
        domain. The one third-party script is Clerk&apos;s sign-in library, which loads on
        every page so the account controls work; Clerk therefore receives standard request
        information, such as your IP address, when a page loads.
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
        personal data held about you, or to object to its processing. The personal data we
        hold is your account details, if you created an account, and any email you chose to
        send us. To access or delete either, write to{" "}
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
