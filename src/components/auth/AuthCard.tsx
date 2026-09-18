import React from "react";
import Image from "next/image";
import { Activity, LineChart, ShieldCheck } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

/**
 * Only claims that are true for every visitor. Holdytic has no account-only
 * features yet, so the panel describes the product rather than promising perks.
 */
const HIGHLIGHTS = [
  { icon: Activity, text: "Live odds from Polymarket, refreshed every 30 seconds" },
  { icon: LineChart, text: "Accuracy measured against markets that already resolved" },
  { icon: ShieldCheck, text: "Read-only — Holdytic never places trades or holds funds" },
];

/**
 * Card shell for the sign-in and sign-up pages.
 *
 * The page heading is deliberately left to Clerk: its title changes with each
 * step of the flow ("Check your email", "Enter your password"…), so a fixed
 * heading here would repeat it on the first step and contradict it on later
 * ones. The side panel is branding only.
 */
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Brand panel — hidden on small screens so the form comes first. */}
      <div className="hidden lg:flex flex-col justify-between gap-10 bg-zinc-900 p-10 text-white">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt=""
            width={96}
            height={96}
            className="size-10"
          />
          <span className="text-xl font-bold tracking-tight">{SITE_NAME}</span>
        </div>

        <div>
          <p className="text-3xl font-extrabold tracking-tight text-balance">
            Live prediction markets, measured.
          </p>
          <p className="mt-3 text-zinc-300 leading-relaxed">
            Odds, order books and price history from Polymarket — and how accurate those
            markets turned out to be.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={15} aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-zinc-500">
          Market data stays free to browse — no account needed for that.
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
