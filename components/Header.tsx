"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { SearchInput } from "./SearchInput";

/** Placeholder matching the search field's footprint while it hydrates. */
function SearchFallback() {
  return <div className="h-9 w-full rounded-md bg-zinc-100 border border-zinc-200" />;
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // --- Entrance animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.from(logoRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.4)",
        });
      }

      if (searchWrapperRef.current) {
        gsap.from(searchWrapperRef.current, {
          x: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
        });
      }

    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="w-full fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
        <Link
          ref={logoRef}
          href="/"
          className="font-bold text-xl sm:text-2xl tracking-tight text-zinc-900 flex items-center gap-2 origin-left shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#57c]"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={128}
            height={128}
            className="size-10 sm:size-12"
            priority
          />
          {/* The wordmark would crowd the search field on the narrowest screens. */}
          <span className="hidden sm:inline">Holdytic</span>
        </Link>

        <div ref={searchWrapperRef} className="flex-1 min-w-0 max-w-2xl origin-left">
          <Suspense fallback={<SearchFallback />}>
            <SearchInput />
          </Suspense>
        </div>

      </div>
    </header>
  );
}
