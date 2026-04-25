import { getProducts, getCategories } from "@/lib/data";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const searchStr = searchParams?.search;
  const searchQuery = Array.isArray(searchStr) ? searchStr[0] : searchStr || "";

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow={searchQuery ? "✦ Search Results ✦" : "✦ Our Collection ✦"}
        titlePrefix={searchQuery ? "For" : "All"}
        titleHighlighted={searchQuery ? '"' + searchQuery + '"' : "products"}
        description={
          searchQuery
            ? `Here's what we found for your search.`
            : "Explore our complete range of handcrafted candles, clay art, and creative crafts."
        }
        backgroundImage="/images/misc/checkout.png"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <ProductsClient
          initialProducts={products}
          categories={categories}
          initialSearchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
