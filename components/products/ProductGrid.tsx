import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  customCard?: React.ReactNode;
  customCardEnd?: React.ReactNode;
  viewMode?: "grid" | "list";
  columns?: 3 | 4;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found.",
  customCard,
  viewMode = "grid",
  customCardEnd,
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0 && !customCard && !customCardEnd) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🕯️</div>
        <p className="text-brown-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "list"
          ? "grid grid-cols-1 gap-6"
          : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${columns === 4 ? "xl:grid-cols-4" : ""} gap-6`
      }
    >
      {customCard}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
      {customCardEnd}
    </div>
  );
}
