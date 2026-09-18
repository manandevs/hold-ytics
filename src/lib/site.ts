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
export const POLICY_UPDATED = "September 17, 2026";

/** Every page reachable from the header menu, in display order. */
export const NAV_LINKS = [
  { label: "Markets", href: "/markets" },
  { label: "Accuracy", href: "/accuracy" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
] as const;
