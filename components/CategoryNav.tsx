import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/api";
import { cn } from "@/lib/cn";

interface CategoryNavProps {
  /** Slug of the active category. */
  active: string;
  /** Preserved so switching category keeps an in-flight search. */
  query?: string;
}

export default function CategoryNav({ active, query }: CategoryNavProps) {
  return (
    <nav
      aria-label="Market categories"
      className="border-b border-zinc-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex items-center gap-1 min-w-max px-0.5">
        {CATEGORIES.map((category) => {
          const isActive = category.slug === active;
          const params = new URLSearchParams();
          if (category.tagId !== null) params.set("category", category.slug);
          if (query) params.set("q", query);
          const href = params.size ? `/?${params}` : "/";

          return (
            <li key={category.slug}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-block px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                )}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
