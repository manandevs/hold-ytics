import type { NextConfig } from "next";

/**
 * Fail the build instead of shipping a broken site.
 *
 * Clerk's proxy runs on every request and throws when its keys are missing, so
 * a build without them deploys fine and then answers every route — static
 * pages and API routes included — with a bare 500. Checking here stops a
 * production build instead, which on Vercel leaves the previous deployment live.
 * Development is exempt: Clerk runs in keyless mode there.
 */
const REQUIRED_ENV = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"];

if (process.env.NODE_ENV === "production") {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(", ")}.
` +
        "Without them Clerk fails every request with a 500. Add them in Vercel → " +
        "Project → Settings → Environment Variables (or .env.local locally), then rebuild."
    );
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Market artwork is served from Polymarket's upload bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "polymarket-upload.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
