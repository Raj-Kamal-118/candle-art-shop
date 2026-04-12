import { getProducts, getCategories, getHeroSettings } from "@/lib/data";
import { Flame, Image as ImageIcon } from "lucide-react";
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
    ]),
  );

  return (
    <>
      <HeroSection settings={heroSettings} />

      {/* <CategoryGrid categories={categories} /> */}

      {/* Category banner + product carousel sections */}
      <section className="relative py-8 bg-cream-50 dark:bg-[#0f0e1c] overflow-hidden transition-colors duration-300">
        {/* Ambient candle light glow effect for dark mode */}
        <div className="absolute pointer-events-none inset-0 z-0">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700 translate-x-1/4" />
          <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-coral-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700 -translate-x-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 divide-y divide-cream-200 dark:divide-amber-900/20">
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

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="relative py-24 bg-cream-50 dark:bg-[#0a0a16] overflow-hidden border-t border-cream-200 dark:border-amber-900/20 transition-colors duration-300">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-coral-300 dark:bg-amber-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-30 dark:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-amber-300 dark:bg-amber-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-30 dark:opacity-100 transition-opacity duration-700" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-amber-700 dark:text-gold-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
            Bespoke Creations
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brown-900 dark:text-amber-100 dark:candle-text-glow mb-6 leading-tight">
            Something Truly{" "}
            <span className="text-amber-600 dark:text-gold-400 italic">
              Yours
            </span>
          </h2>
          <p className="text-brown-700 dark:text-amber-100/60 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            Turn your memories and ideas into beautifully crafted pieces.
            Whether it’s a bespoke fragrance blend for a custom candle or a
            hand-drawn illustration on a fridge magnet, our artisans are here to
            bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="/custom-candle"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-coral-600 dark:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-300 shadow-lg hover:-translate-y-1"
            >
              <Flame size={20} />
              Design a Custom Candle
            </a>
            <a
              href="/custom-magnet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white dark:bg-transparent border-2 border-amber-600 dark:border-gold-400 text-amber-700 dark:text-gold-400 px-8 py-4 rounded-xl font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/40 dark:hover:text-amber-100 transition-all duration-300 shadow-sm dark:shadow-lg hover:-translate-y-1"
            >
              <ImageIcon size={20} />
              Design a Custom Magnet
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
