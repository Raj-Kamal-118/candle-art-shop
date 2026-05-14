import { getProducts, getCategories, getHeroSettings } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { unstable_cache } from "next/cache";
import { getApprovedReviews } from "@/lib/reviews";
import HeroSection from "@/components/home/HeroSection";
import CategoryZigZag from "@/components/home/CategoryZigZag";
import CustomTrio from "@/components/home/CustomTrio";
import OffersBoard from "@/components/home/OffersBoard";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import StoryTeaser from "@/components/home/StoryTeaser";

export const revalidate = 60;

// Heavily cache offers fetching directly from Supabase
const getStoreOffers = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("store_offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    return data || [];
  },
  ["store-offers"],
  { revalidate: 3600, tags: ["offers"] },
);

export default async function HomePage() {
  const [products, categories, heroSettings, reviews, offers] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getHeroSettings(),
      getApprovedReviews(),
      getStoreOffers(),
    ]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 10);

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
      <OffersBoard offers={offers} />
      <CategoryZigZag
        categories={categories}
        productsByCategory={productsByCategory}
      />
      <FeaturedProducts products={featuredProducts} />
      <CustomTrio />
      <StoryTeaser />
      <Testimonials reviews={reviews} />
    </>
  );
}
