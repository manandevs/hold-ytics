import React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * The shared button look. Exported separately so links can adopt it without
 * nesting a `<button>` inside an `<a>`.
 */
export function buttonStyles(className?: string) {
  return cn(
    "relative inline-flex items-center justify-center px-4 py-1.5 border-[3px] font-bold text-base cursor-pointer",
    "bg-[#3df] border-[#57c] text-black",
    "transition-all duration-200 ease-out",
    "scale-100 rounded-2xl",
    "hover:scale-105 hover:rounded-xl",
    "active:scale-90 active:rounded-3xl active:duration-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57c]",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100",
    // Glossy highlight along the bottom edge.
    "before:content-[''] before:absolute before:bottom-1 before:right-1/2 before:translate-x-1/2 before:w-[55%] before:h-0.75 before:bg-white/50 before:rounded-lg",
    className
  );
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles(className)} {...props}>
      {children}
    </button>
  );
}
