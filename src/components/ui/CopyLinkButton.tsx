"use client";

import React, { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Copies the current market URL to the clipboard. */
export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address bar remains the fallback.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:text-zinc-900 hover:border-zinc-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57c]"
    >
      {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
