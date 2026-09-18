/** Placeholder cards shown while a page of markets is being fetched. */
export default function MarketsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-56 rounded-2xl bg-white border border-zinc-200 animate-pulse"
        />
      ))}
    </div>
  );
}
