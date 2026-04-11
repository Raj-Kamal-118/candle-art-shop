import { getProducts, getCategories } from "@/lib/data";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-4xl font-bold text-brown-900 mb-4">
            Something Truly Yours
          </h2>
          <p className="text-brown-600 text-lg mb-8 leading-relaxed">
            Every piece can be personalized. Work with our artisans to create a
            candle or artwork that tells your unique story.
          </p>
          <a
            href="/products?customizable=true"
            className="inline-flex items-center gap-2 bg-amber-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-800 transition-all duration-200 shadow-lg shadow-amber-200"
          >
            Explore Custom Options
          </a>
        </div>
      </section>
    </>
  );
}
