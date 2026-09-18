import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";

const openSauceSans = localFont({
  src: "../public/fonts/OpenSauceSans-Regular.ttf",
  variable: "--font-open-sauce",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Holdytic — Live prediction market signals",
    template: "%s | Holdytic",
  },
  description:
    "Track live prediction market odds, volume and price movement across the most active markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSauceSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        {children}
      </body>
    </html>
  );
}
