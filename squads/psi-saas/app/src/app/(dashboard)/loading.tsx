export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto animate-pulse">
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-vinculo p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-neutral-border rounded" />
                <div className="h-6 w-12 bg-neutral-border rounded" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-neutral-border" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-vinculo p-6 space-y-4">
          <div className="h-4 w-32 bg-neutral-border rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-neutral-border last:border-0">
              <div className="w-10 h-10 rounded-full bg-neutral-border flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-neutral-border rounded" />
                <div className="h-2.5 w-24 bg-neutral-border rounded" />
              </div>
              <div className="h-5 w-16 bg-neutral-border rounded-badge" />
            </div>
          ))}
        </div>

        <div className="card-vinculo p-6 space-y-4">
          <div className="h-4 w-28 bg-neutral-border rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-border flex-shrink-0" />
              <div className="h-3 w-24 bg-neutral-border rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
