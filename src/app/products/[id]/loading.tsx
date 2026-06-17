export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="h-16 bg-white border-b border-gray-100" />
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4 pt-2">
          <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-6 w-1/3 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-2xl animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}
