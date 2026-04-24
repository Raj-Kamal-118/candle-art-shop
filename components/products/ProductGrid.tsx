import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  customCard?: React.ReactNode;
  customCardEnd?: React.ReactNode;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found.",
  customCard,
  customCardEnd,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {customCard}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {customCardEnd}
    </div>
  );
}
