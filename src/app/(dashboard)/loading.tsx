// Dashboard route loading skeleton — shows immediately while data loads
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-900" />
        <div className="h-8 w-24 animate-pulse rounded bg-zinc-900" />
      </div>

      {/* Stats grid skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded border border-zinc-900 bg-zinc-950" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded border border-zinc-900 bg-zinc-950" />
        <div className="h-64 animate-pulse rounded border border-zinc-900 bg-zinc-950" />
      </div>
    </div>
  );
}
