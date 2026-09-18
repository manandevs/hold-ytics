"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

import { SearchInput } from "@/components/layout/SearchInput";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Placeholder matching the search field's footprint while it hydrates. */
function SearchFallback() {
  return <div className="h-9 w-full rounded-md bg-zinc-100 border border-zinc-200" />;
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncedPathname, setSyncedPathname] = useState(pathname);

  // Close the menu on navigation so it never outlives the route.
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setMenuOpen(false);
  }

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Dismiss the compact menu on Escape or a click outside it.
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

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

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="flex items-center justify-center size-9 rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:text-zinc-900 hover:border-zinc-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57c]"
          >
            {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>

          {/* Rendered even while closed so the links stay in the HTML for
              crawlers and no-JS readers; `hidden` keeps them out of the tab
              order and the accessibility tree until the menu opens. */}
          <nav
            id="site-menu"
            aria-label="Site pages"
            hidden={!menuOpen}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200 bg-white shadow-lg p-1.5 flex flex-col"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  pathname === link.href
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
