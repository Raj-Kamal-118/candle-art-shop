export default function ProductDetailLoading() {
  return (
    <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] min-h-screen pt-10 lg:pt-16 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb Mimic */}
        <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-48 mb-14 animate-pulse" />

        <div className="animate-pulse grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Image Skeleton */}
          <div className="aspect-square bg-cream-200 dark:bg-amber-900/20 rounded-3xl" />

          {/* Right Column: Detail Skeletons */}
          <div className="space-y-6 pt-4">
            <div className="h-6 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
            <div className="h-12 bg-cream-200 dark:bg-amber-900/20 rounded w-3/4" />
            <div className="h-8 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
            <div className="space-y-3 pt-6">
              <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-full" />
              <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-5/6" />
              <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-4/6" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6">
              <div className="h-16 bg-cream-200 dark:bg-amber-900/20 rounded-xl" />
              <div className="h-16 bg-cream-200 dark:bg-amber-900/20 rounded-xl" />
              <div className="h-16 bg-cream-200 dark:bg-amber-900/20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
