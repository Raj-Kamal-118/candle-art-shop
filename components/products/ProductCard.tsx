"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
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
  const [addedToCart, setAddedToCart] = useState(false);
  const favorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link href={`/products/${product.id}`}>
      <div className="group relative bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-sm dark:shadow-none dark:border dark:border-amber-900/30 hover:shadow-xl dark:hover:border-amber-700/50 transition-all duration-300 cursor-pointer">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-amber-900/20">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover overlay */}
          <div className="hidden md:flex absolute inset-0 bg-brown-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-[#0f0e1c] text-brown-900 dark:text-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900/50"
                }`}
              >
                {addedToCart ? <Check size={15} /> : <ShoppingCart size={15} />}
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <Link
                href={`/products/${product.id}`}
                className="p-2.5 bg-white dark:bg-[#0f0e1c] rounded-xl text-brown-900 dark:text-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900/50 transition-colors shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={15} />
              </Link>
            </div>
          </div>

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
        <div className="p-3 sm:p-4 flex flex-col h-[100px] sm:h-[120px]">
          <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-500 font-medium uppercase tracking-wide mb-1 truncate">
            {product.customizable ? "Customizable" : "Ready to Ship"}
          </p>
          <h3 className="font-semibold text-brown-900 dark:text-amber-50 text-xs sm:text-sm leading-tight mb-auto group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-end justify-between mt-2 gap-1">
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
              onClick={handleAddToCart}
              className={`md:hidden flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors shrink-0 shadow-sm text-white ${
                addedToCart ? "bg-green-600" : "bg-amber-500 dark:bg-amber-600"
              }`}
              aria-label={addedToCart ? "Added to Cart" : "Add to Cart"}
            >
              {addedToCart ? <Check size={13} /> : <ShoppingCart size={13} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
