import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <main className="flex-1 min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-black text-zinc-300">404</p>
      <h1 className="text-2xl font-bold text-zinc-900">This page doesn&apos;t exist</h1>
      <p className="text-zinc-600 max-w-md">
        The market you&apos;re looking for may have been resolved or removed.
      </p>
      <Link href="/" className={buttonStyles()}>
        Browse markets
      </Link>
    </main>
  );
}
