"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(activeQuery);
  const [syncedQuery, setSyncedQuery] = useState(activeQuery);

  // Keep the field in step with the URL (back/forward, or a link with ?q=).
  if (activeQuery !== syncedQuery) {
    setSyncedQuery(activeQuery);
    setQuery(activeQuery);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  };

  const handleClear = () => {
    setQuery("");
    if (activeQuery) router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "flex items-center bg-zinc-100 border border-zinc-200 rounded-lg py-1.5 px-2.5 gap-2",
        "transition-colors focus-within:bg-white focus-within:border-zinc-400",
        className
      )}
    >
      <Search size={16} className="text-zinc-500 shrink-0" aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search markets..."
        aria-label="Search markets"
        className="flex-1 min-w-0 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="flex items-center justify-center size-5 rounded text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
