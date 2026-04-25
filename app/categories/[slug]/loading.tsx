export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Mimic the Dark Image Banner Header */}
      <div className="h-[300px] md:h-[400px] w-full bg-forest-900 dark:bg-black/80 animate-pulse border-b border-cream-200 dark:border-amber-900/20" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-20 lg:py-24">
        {/* Mimic the count text */}
        <div className="h-6 bg-cream-200 dark:bg-amber-900/20 rounded-md w-32 mb-10 animate-pulse" />

        {/* Mimic the Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl overflow-hidden"
            >
              <div className="aspect-square bg-cream-100 dark:bg-amber-900/20" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-cream-100 dark:bg-amber-900/20 rounded w-1/3" />
                <div className="h-5 bg-cream-200 dark:bg-amber-900/40 rounded w-3/4" />
                <div className="h-4 bg-cream-100 dark:bg-amber-900/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
