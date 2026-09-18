/**
 * Clerk components themed to the site's design tokens, so the sign-in, sign-up
 * and user menus read as part of Holdytic rather than a third-party widget.
 *
 * Primary actions use zinc-900, matching the site's own dark buttons and
 * active-tab underlines; white text on it clears WCAG AA comfortably.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#18181b",
    colorPrimaryForeground: "#ffffff",
    colorForeground: "#18181b",
    colorMutedForeground: "#52525b",
    colorBackground: "#ffffff",
    colorInput: "#fafafa",
    colorInputForeground: "#18181b",
    colorBorder: "#e4e4e7",
    colorRing: "#5577cc",
    fontFamily: "var(--font-open-sauce), ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
};

/**
 * For the embedded <SignIn> / <SignUp> only: the auth pages already draw the
 * card, so Clerk's own shadow and border would double it up.
 *
 * Style objects rather than Tailwind classes on purpose. Tailwind v4 emits
 * utilities inside `@layer utilities`, and Clerk's unlayered CSS-in-JS beats
 * any layered rule regardless of specificity, so class overrides never apply.
 * Style objects are merged into Clerk's own styles and win reliably.
 */
export const embeddedAuthAppearance = {
  elements: {
    rootBox: { width: "100%" },
    cardBox: { width: "100%", maxWidth: "100%", boxShadow: "none", border: "none" },
    card: { boxShadow: "none", border: "none", background: "transparent" },
    footer: { background: "transparent" },
  },
};
