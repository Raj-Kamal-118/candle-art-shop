export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Mimic the Secondary Header */}
      <div className="h-[250px] md:h-[300px] w-full bg-cream-100 dark:bg-[#0a0a16] animate-pulse border-b border-cream-200 dark:border-amber-900/20" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        {/* Mimic the Filter Bar */}
        <div className="h-10 bg-cream-200 dark:bg-amber-900/20 rounded-lg w-full max-w-sm mb-10 animate-pulse" />

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
