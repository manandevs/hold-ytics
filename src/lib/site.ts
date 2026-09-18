/** Site-wide constants: identity, contact details and header navigation. */

export const SITE_NAME = "Holdytic";

/**
 * Where the contact form sends mail.
 *
 * NOTE: this is a placeholder. Point it at a real inbox before going live —
 * it's the only place the address is defined.
 */
export const CONTACT_EMAIL = "contact@holdytic.com";

/** Shown as "Last updated" on the Terms and Privacy pages. */
export const POLICY_UPDATED = "September 18, 2026";

/** Every page reachable from the header menu, in display order. */
export const NAV_LINKS = [
  { label: "Markets", href: "/markets" },
  { label: "Accuracy", href: "/accuracy" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] as const;

/**
 * Absolute base URL for metadata (Open Graph images, canonical links).
 *
 * Never throws: a malformed value such as `example.com` (no protocol) would
 * make `new URL()` throw while the root layout loads, and that takes down every
 * page with a bare 500. Falls back to Vercel's own deployment URLs, which are
 * set automatically, so production metadata never points at localhost.
 */
export function getSiteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    } catch {
      // Malformed — try the next candidate.
    }
  }

  return new URL("http://localhost:3000");
}
