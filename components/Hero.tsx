"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "./Button";
import { useMarkets } from "@/hooks/useMarkets";
import Card from "./card";

export default function Hero() {
  const { markets, loading } = useMarkets([], 8);

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headlineRef.current) {
        tl.from(headlineRef.current, { y: 40, opacity: 0, duration: 1 });
      }

      if (subtextRef.current) {
        tl.from(subtextRef.current, { y: 20, opacity: 0, duration: 0.8 }, "-=0.7");
      }

      if (ctaWrapperRef.current && ctaWrapperRef.current.children.length > 0) {
        tl.from(
          ctaWrapperRef.current.children,
          { y: 20, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)" },
          "-=0.5"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full grid min-h-screen">
      <div className="col-start-1 row-start-1 w-full h-full absolute inset-0 z-10">
        <img
          src="/images/home-hero-section.jpg"
          alt="Holdytic Hero Background"
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="col-start-1 row-start-1 z-10 w-full h-full flex flex-col pt-32 pb-12 px-4">
        <div className="relative z-10 mx-auto flex flex-col items-center gap-6 text-center text-white max-w-4xl">
          <h1 ref={headlineRef} className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Decode the forces driving global markets.
          </h1>

          <p ref={subtextRef} className="text-lg sm:text-xl text-gray-200 font-medium leading-relaxed">
            Track narratives, uncover causal relationships, and identify market-moving signals with AI-powered intelligence. Stay ahead with real-time insights, smarter analysis, and a clearer view of what truly drives market movements.
          </p>

          <div ref={ctaWrapperRef} className="mt-4">
            <Link href="/markets">
              <Button variant="raspberry">Explore Market Signals</Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Markets Grid */}
        <div ref={gridRef} className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch justify-center gap-6 mt-24">
          {loading 
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-zinc-800/50 rounded-2xl animate-pulse backdrop-blur-sm border border-zinc-700/50" />
              ))
            : markets.map((market, index) => (
                <div key={market.id} className={index >= 4 ? "hidden md:block" : "block"}>
                  <Card market={market} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}