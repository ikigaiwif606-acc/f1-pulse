export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Hero skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-3 w-20 rounded bg-[#1c1c1c] mb-2" />
          <div className="h-10 w-48 rounded bg-[#131313] mb-1" />
          <div className="h-3 w-64 rounded bg-[#0a0a0a]" />
        </div>

        {/* Card skeleton */}
        <div className="f1-surface p-6 animate-pulse mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#1c1c1c]" />
            <div className="h-3 w-16 rounded bg-[#1c1c1c]" />
          </div>
          <div className="h-8 w-64 rounded bg-[#131313] mb-2" />
          <div className="h-3 w-40 rounded bg-[#0a0a0a] mb-6" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 rounded border border-[#1c1c1c] bg-[#0f0f0f]" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="f1-surface p-5 lg:col-span-2 animate-pulse">
            <div className="h-4 w-32 rounded bg-[#1c1c1c] mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-[#0a0a0a]" />
              ))}
            </div>
          </div>
          <div className="f1-surface p-5 animate-pulse">
            <div className="h-4 w-24 rounded bg-[#1c1c1c] mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-[#0a0a0a]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
