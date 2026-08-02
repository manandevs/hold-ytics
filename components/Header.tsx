"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";

import { Button } from "./Button";
import { SearchInput } from "./SearchInput";
import { cn } from "@/lib/cn";

// Extracted outside the component to prevent unnecessary re-allocations on render
const NAV_ITEMS = [
  { label: "Markets", href: "#" },
  { label: "Positions", href: "#" },
  { label: "Activity", href: "#" },
  { label: "Leaderboard", href: "#" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Refs for targeting elements with GSAP safely
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const loginWrapperRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Ref to track initial render for the toggle animation
  const isInitialRender = useRef(true);

  // --- INITIAL LOAD ANIMATIONS ---
  useEffect(() => {
    // gsap.context ensures proper cleanup and prevents React 18 strict mode double-firing
    const ctx = gsap.context(() => {
      
      // 1. Logo & Brand Name: Fade in and scale up with elastic bounce
      // Why: Draws immediate primary attention to the brand identity.
      if (logoRef.current) {
        gsap.from(logoRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.4)",
        });
      }

      // 2. Search Input: Slide in from the right with opacity fade
      // Why: Smoothly introduces the most frequently used interactive element.
      if (searchWrapperRef.current) {
        gsap.from(searchWrapperRef.current, {
          x: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
        });
      }

      // 3. Desktop Navigation Items: Staggered slide up
      // Why: Sequentially establishes the navigation structure naturally.
      if (desktopNavRef.current && desktopNavRef.current.children.length > 0) {
        gsap.from(desktopNavRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        });
      }

      // 4. Login Button: Pop-in with a back-out bounce
      // Why: Strongly emphasizes the primary call-to-action for conversions.
      if (loginWrapperRef.current) {
        gsap.from(loginWrapperRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          delay: 0.8,
          ease: "back.out(1.7)",
        });
      }

      // 5. Hamburger Menu: Fade in with rotation
      // Why: Introduces the mobile navigation toggle playfully.
      if (hamburgerRef.current) {
        gsap.from(hamburgerRef.current, {
          opacity: 0,
          rotation: -90,
          duration: 0.6,
          delay: 1,
          ease: "power2.out",
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // --- MOBILE MENU ENTRANCE ANIMATION ---
  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      const ctx = gsap.context(() => {
        // 6. Mobile Menu Items: Staggered slide-in from the left
        // Why: Creates a cascading visual flow guiding the user's eye down the list.
        if (mobileMenuRef.current && mobileMenuRef.current.children.length > 0) {
          gsap.from(mobileMenuRef.current.children, {
            x: -30,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          });
        }
      }, mobileMenuRef);

      return () => ctx.revert();
    }
  }, [isOpen]);

  // --- INTERACTIVE ANIMATIONS ---

  // Hamburger Toggle Rotation Animation
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (hamburgerRef.current) {
      gsap.fromTo(
        hamburgerRef.current,
        { rotation: isOpen ? -90 : 90, scale: 0.8 },
        { rotation: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  // Search Focus Handlers
  const handleSearchFocus = useCallback(() => {
    if (searchWrapperRef.current) {
      gsap.to(searchWrapperRef.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
    }
  }, []);

  const handleSearchBlur = useCallback(() => {
    if (searchWrapperRef.current) {
      gsap.to(searchWrapperRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
  }, []);

  // Desktop Nav Hover Handlers
  const handleNavEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: "power1.out" });
  }, []);

  const handleNavLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.in" });
  }, []);

  // Login Button Hover Handlers (Pulse effect)
  const handleLoginEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.08,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    });
  }, []);

  const handleLoginLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.in" });
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "w-full fixed top-0 left-0 right-0 z-40 p-4 transition-colors duration-300",
        isOpen && "bg-black/80 backdrop-blur-md h-screen"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo + Search */}
        <div className="flex items-center gap-4">
          <Link
            ref={logoRef}
            href="/"
            className="font-bold text-2xl tracking-tight text-white flex items-center gap-2 block origin-left"
            aria-label="Holdytic Home"
          >
            <Image
              src="/images/_Image.png"
              alt="Holdytic Logo"
              width={125}
              height={125}
              className="size-12"
              priority
            />
            Holdytic
          </Link>

          {/* Search input wrapped for GSAP Focus events */}
          <div
            ref={searchWrapperRef}
            className="hidden sm:block origin-left"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          >
            <SearchInput />
          </div>
        </div>

        {/* Navigation + Login */}
        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <nav ref={desktopNavRef} className="hidden lg:flex items-center gap-3" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block origin-center"
                onMouseEnter={handleNavEnter}
                onMouseLeave={handleNavLeave}
              >
                <Button variant="raspberry">{item.label}</Button>
              </Link>
            ))}
          </nav>

          {/* Hamburger for mobile */}
          <button
            ref={hamburgerRef}
            className="lg:hidden text-white flex items-center justify-center p-1 origin-center"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <MdClose size={32} /> : <HiMenuAlt3 size={32} />}
          </button>

          {/* Login Button wrapped for GSAP Pulse events */}
          <div
            ref={loginWrapperRef}
            className="inline-block origin-center"
            onMouseEnter={handleLoginEnter}
            onMouseLeave={handleLoginLeave}
          >
            <Button variant="outline">Login</Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden mt-6 space-y-3 flex flex-col items-start px-4 overflow-hidden"
        >
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="block w-full">
              <Button variant="raspberry" className="w-full justify-start text-lg py-6">
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}