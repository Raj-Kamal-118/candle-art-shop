"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

export default function FavoritesPage() {
  const { favoriteItems } = useStore();

  if (favoriteItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="text-red-400" size={40} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brown-900 mb-4">
          No favorites yet
        </h1>
        <p className="text-brown-500 mb-8">
          Save products you love to find them easily later.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-800 transition-colors shadow-sm"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-sm text-amber-700 font-medium uppercase tracking-widest mb-2">
          Your Wishlist
        </p>
        <h1 className="font-serif text-3xl font-bold text-brown-900">
          Favorites
          <span className="text-brown-400 font-sans font-normal text-base ml-3">
            ({favoriteItems.length} items)
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
