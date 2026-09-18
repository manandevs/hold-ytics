import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared shell for the static content pages (About, Contact, Terms, Privacy).
 *
 * Typography is styled once here with descendant selectors so each page can be
 * plain semantic markup instead of repeating the same class strings.
 */
export default function ContentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex-1 bg-zinc-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-5"
        >
          <ArrowLeft size={16} aria-hidden /> Back to markets
        </Link>

        <article
          className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-8
            [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-extrabold [&_h1]:text-zinc-900 [&_h1]:tracking-tight [&_h1]:text-balance
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h2]:mt-8 [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-zinc-900 [&_h3]:mt-5 [&_h3]:mb-1.5
            [&_p]:text-zinc-600 [&_p]:leading-relaxed [&_p]:mt-3
            [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:text-zinc-600 [&_ul]:list-disc [&_ul]:pl-5
            [&_ol]:mt-3 [&_ol]:space-y-2 [&_ol]:text-zinc-600 [&_ol]:list-decimal [&_ol]:pl-5
            [&_li]:leading-relaxed
            [&_a:not(.no-prose)]:text-blue-600 [&_a:not(.no-prose)]:font-medium
            [&_a:not(.no-prose)]:underline [&_a:not(.no-prose)]:decoration-blue-600/30
            [&_a:not(.no-prose)]:underline-offset-2 [&_a:not(.no-prose)]:hover:decoration-blue-600
            [&_strong]:font-semibold [&_strong]:text-zinc-900"
        >
          {children}
        </article>
      </div>
    </main>
  );
}
