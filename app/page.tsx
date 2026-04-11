import { getProducts, getCategories, getHeroSettings } from "@/lib/data";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import CategoryBannerSection from "@/components/home/CategoryBannerSection";
import Testimonials from "@/components/home/Testimonials";

export default async function HomePage() {
  const [products, categories, heroSettings] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSettings(),
  ]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  // Build a map of categoryId → products for the carousel sections
  const productsByCategory = Object.fromEntries(
    categories.map((cat) => [
      cat.id,
      products.filter((p) => p.categoryId === cat.id && p.inStock),
    ])
  );

  return (
    <>
      <HeroSection settings={heroSettings} />

      <CategoryGrid categories={categories} />

      {/* Category banner + product carousel sections */}
      <section className="py-8 bg-cream-50 dark:bg-[#0f0e1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 divide-y divide-cream-200 dark:divide-amber-900/20">
          {categories
            .filter((cat) => cat.showInHomepage !== false)
            .map((cat) => (
              <CategoryBannerSection
                key={cat.id}
                category={cat}
                products={productsByCategory[cat.id] || []}
              />
            ))}
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} />
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-forest-900 dark:bg-[#0f0e1c] dark:border-t dark:border-amber-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-4xl font-bold text-white dark:text-amber-100 dark:candle-text-glow mb-4">
            Something Truly Yours
          </h2>
          <p className="text-forest-200 dark:text-amber-100/50 text-lg mb-8 leading-relaxed">
            Every piece can be personalized. Work with our artisans to create a
            candle or artwork that tells your unique story.
          </p>
          <a
            href="/products?customizable=true"
            className="inline-flex items-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-900/30 dark:shadow-amber-900/40"
          >
            Explore Custom Options
          </a>
        </div>
      </section>
    </>
  );
}
