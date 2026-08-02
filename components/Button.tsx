import React from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "cherry"
  | "strawberry"
  | "raspberry"
  | "lemon"
  | "outline"
  | "default";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  cherry: "bg-[#f46] border-[#a24]",
  strawberry: "bg-[#fad] border-[#d7b]",
  raspberry: "bg-[#3df] border-[#57c]",
  lemon: "bg-[#ff0] border-[#b90]",
  outline: "text-white border-gray-950 bg-linear-to-b from-[#161329] via-black to-[#1d1b4b] shrink-0 before:hidden after:hidden",
  default: "bg-[#4f5] border-[#6a7282]",
};

export function Button({
  variant = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative px-3 py-1.5 text-black border-[3px] font-bold text-base group cursor-pointer",
        "transition-all duration-200 ease-out",
        "scale-100 rounded-2xl",
        "hover:scale-105 hover:rounded-xl",
        "active:scale-90 active:rounded-3xl active:duration-100",
        "before:content-[''] before:absolute before:bottom-1 before:right-1/2 before:translate-x-1/2 before:w-[55%] before:h-0.75 before:bg-white/50 before:rounded-lg",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}