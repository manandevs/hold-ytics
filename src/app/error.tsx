"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
      <p className="text-zinc-600 max-w-md">
        We couldn&apos;t load this page. This is usually temporary — try again in a moment.
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
