import { getProducts, getCategories, getHeroSettings } from "@/lib/data";
import { getApprovedReviews } from "@/lib/reviews";
import HeroSection from "@/components/home/HeroSection";
import CategoryZigZag from "@/components/home/CategoryZigZag";
import CustomTrio from "@/components/home/CustomTrio";
import CraftProcess from "@/components/home/CraftProcess";
import MaterialsStrip from "@/components/home/MaterialsStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, heroSettings, reviews] = await Promise.all([
    getProducts(),
    getCategories(),
    getHeroSettings(),
    getApprovedReviews(),
  ]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  // Map categoryId → in-stock products for CategoryZigZag
  const productsByCategory = Object.fromEntries(
    categories.map((cat) => [
      cat.id,
      products.filter((p) => p.categoryId === cat.id && p.inStock),
    ]),
  );

  return (
    <>
      <HeroSection settings={heroSettings} />
      <CategoryZigZag
        categories={categories}
        productsByCategory={productsByCategory}
      />
      <FeaturedProducts products={featuredProducts} />
      <CustomTrio />
      <CraftProcess />
      <MaterialsStrip />
      <Testimonials reviews={reviews} />
    </>
  );
}
