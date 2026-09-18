import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/layout/Header";
import { clerkAppearance } from "@/lib/clerkAppearance";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const openSauceSans = localFont({
  src: "../../public/fonts/OpenSauceSans-Regular.ttf",
  variable: "--font-open-sauce",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),

  title: {
    default: "Holdytic — Live Prediction Market Signals",
    template: "%s | Holdytic",
  },

  description:
    "Track live prediction market odds, volume, and price movement across the most active markets.",

  applicationName: "Holdytic",

  keywords: [
    "prediction markets",
    "prediction market signals",
    "market odds",
    "live market data",
    "market volume",
    "price movement",
  ],

  authors: [{ name: "Holdytic" }],
  creator: "Holdytic",
  publisher: "Holdytic",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Holdytic",
    title: "Holdytic — Live Prediction Market Signals",
    description:
      "Track live prediction market odds, volume, and price movement across the most active markets.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Holdytic — Live Prediction Market Signals",
    description:
      "Track live prediction market odds, volume, and price movement across the most active markets.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSauceSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignOutUrl="/"
          appearance={clerkAppearance}
        >
          <Header />
          {/* Each route renders its own <main>; wrapping here would nest them. */}
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
