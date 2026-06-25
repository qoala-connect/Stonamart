export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#FBF7F1]">
      {/* Skeleton header spacer */}
      <div className="h-16 bg-white border-b border-gray-100" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter + grid skeleton */}
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-56 flex-shrink-0 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ))}
          </div>

          {/* Card grid skeleton */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
