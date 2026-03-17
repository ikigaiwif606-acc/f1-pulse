export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="f1-surface p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3.5 w-3.5 rounded-full bg-[#1c1c1c]" />
            <div className="h-3 w-24 rounded bg-[#1c1c1c]" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-[#131313]" />
            <div className="h-3 w-1/2 rounded bg-[#131313]" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-12 rounded bg-[#0a0a0a]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="f1-surface p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-0.5 rounded bg-[#1c1c1c]" />
            <div className="h-4 w-20 rounded bg-[#1c1c1c]" />
          </div>
          <div className="h-6 w-32 rounded bg-[#131313] mb-2" />
          <div className="h-3 w-24 rounded bg-[#0a0a0a]" />
          <div className="mt-3 h-[3px] w-full rounded-full bg-[#161616]" />
        </div>
      ))}
    </div>
  );
}
