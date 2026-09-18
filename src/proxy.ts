import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk session handling for every request.
 *
 * Lives in `src/` on purpose: with a `src/app` directory, Next.js only picks
 * up the proxy from `src/` and silently ignores one at the repo root.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
    // Clerk's auto-proxy path, after the API matcher.
    "/__clerk/:path*",
  ],
};
