"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { FaFilter } from "react-icons/fa";
import { VscSearchSparkle } from "react-icons/vsc";
import { gsap } from "gsap";

export function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) gsap.from(iconRef.current, { opacity: 0, scale: 0.8, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    if (inputRef.current) gsap.from(inputRef.current, { x: 50, opacity: 0, duration: 0.7, delay: 0.2, ease: "power3.out" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/markets?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/markets`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center bg-[#010201] rounded-md py-1.5 px-2 space-x-2", className)}>
      <div ref={iconRef}>
        <VscSearchSparkle size={18} className="text-white shrink-0" />
      </div>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search markets..."
        className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 text-sm"
        onFocus={() => gsap.to(inputRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" })}
        onBlur={() => gsap.to(inputRef.current, { scale: 1, duration: 0.2, ease: "power1.out" })}
      />
      <button type="button" className="flex items-center justify-center w-7 h-7 rounded-lg bg-linear-to-b from-[#161329] via-black to-[#1d1b4b] shrink-0">
        <FaFilter size={14} className="text-white" />
      </button>
    </form>
  );
}