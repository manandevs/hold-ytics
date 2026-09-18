import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shell for /sign-in and /sign-up. The back link sits in normal flow below the
 * fixed header rather than absolutely positioned, where it would be hidden.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex-1 bg-zinc-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-5"
        >
          <ArrowLeft size={16} aria-hidden /> Back to markets
        </Link>

        {children}
      </div>
    </main>
  );
}
