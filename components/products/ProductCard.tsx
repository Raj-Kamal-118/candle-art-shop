"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);
  const favorite = isFavorite(product.id);

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return; // Prevent adding out-of-stock items

    if (product.customizable) {
      router.push(`/products/${product.slug}`);
      return;
    }

    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30 hover:shadow-[0_12px_32px_rgba(28,18,9,0.08)] dark:hover:border-amber-700/50 transition-all duration-300 cursor-pointer">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-amber-900/20">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <Badge variant="danger" className="text-xs">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="warning" className="text-xs">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all duration-200 ${
              favorite
                ? "bg-red-500 text-white scale-110"
                : "bg-white dark:bg-[#0f0e1c] text-brown-500 dark:text-amber-100/70 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart size={15} className={favorite ? "fill-current" : ""} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col h-auto min-h-[110px] sm:min-h-[130px]">
          <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-500 font-medium uppercase tracking-wide mb-1 truncate">
            {product.customizable ? "Customizable" : "Ready to Ship"}
          </p>
          <h3 className="font-semibold text-brown-900 dark:text-amber-50 text-xs sm:text-sm leading-tight mb-auto group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-end justify-between mt-3 gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-brown-900 dark:text-amber-100">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[10px] sm:text-xs text-brown-400 dark:text-amber-100/50 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.stockCount < 10 && product.inStock && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium hidden md:block">
                  Only {product.stockCount} left
                </span>
              )}
            </div>
            <button
              onClick={handleAction}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors shrink-0 shadow-sm text-white ${
                !product.inStock
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400 shadow-none"
                  : addedToCart && !product.customizable
                    ? "bg-green-600"
                    : "bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700"
              }`}
              aria-label={
                !product.inStock
                  ? "Sold Out"
                  : product.customizable
                    ? "Customize Product"
                    : addedToCart
                      ? "Added to Cart"
                      : "Add to Cart"
              }
            >
              {!product.inStock ? null : product.customizable ? (
                <Sparkles size={14} />
              ) : addedToCart ? (
                <Check size={14} />
              ) : (
                <ShoppingCart size={14} />
              )}
              <span className="hidden sm:inline-block">
                {!product.inStock
                  ? "Sold Out"
                  : product.customizable
                    ? "Customize"
                    : addedToCart
                      ? "Added"
                      : "Add to Cart"}
              </span>
              <span className="sm:hidden">
                {!product.inStock
                  ? "Sold Out"
                  : product.customizable
                    ? "Customize"
                    : addedToCart
                      ? "Added"
                      : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
