"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Check, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import ManilaTag from "@/components/craft/ManilaTag";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  viewMode = "grid",
}: ProductCardProps) {
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
      <div
        className={`group relative craft-polaroid hover:bg-amber-50/60 dark:hover:bg-amber-900/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex ${viewMode === "list" ? "flex-col sm:flex-row gap-4" : "flex-col"}`}
        style={{ padding: viewMode === "list" ? "14px" : "14px 14px 20px" }}
      >
        {/* Image container */}
        <div
          className={`relative overflow-hidden bg-cream-100 dark:bg-amber-900/20 ${viewMode === "list" ? "w-full sm:w-64 shrink-0 aspect-[4/3] sm:aspect-square" : "aspect-square w-full"}`}
        >
          {product.images?.[0] ? (
            product.images[0].match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
              <video
                src={product.images[0]}
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🕯️
            </div>
          )}
          {/* Discount ribbon — banner shape pointing right */}
          {discount && (
            <div className="absolute top-3 left-0 z-10">
              <div
                style={{
                  background: "var(--home-coral, #e85d4a)",
                  color: "white",
                  fontFamily: "var(--font-hand)",
                  fontSize: 18,
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                  padding: "0px 12px 0px 8px",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {discount}% off
              </div>
            </div>
          )}

          {/* Sold-out stamp overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/25 dark:bg-black/30 backdrop-blur-[1px]">
              <div
                style={{
                  border: "2.5px solid rgba(180,40,30,0.85)",
                  borderRadius: "50%",
                  padding: "6px 14px",
                  transform: "rotate(-18deg)",
                  color: "rgba(180,40,30,0.9)",
                  fontFamily: "var(--font-hand)",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                Sold out
              </div>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all duration-200 ${
              favorite
                ? "bg-red-500 text-white scale-110"
                : "bg-white dark:bg-[#0f0e1c] text-brown-500 dark:text-amber-100/70 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100"
            }`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={15} className={favorite ? "fill-current" : ""} />
          </button>
        </div>

        {/* Content */}
        <div
          className={`flex flex-col ${viewMode === "list" ? "justify-center flex-1 py-2 pr-2" : "px-1 mt-3 h-auto min-h-[110px] sm:min-h-[130px]"}`}
        >
          <p className="text-[10px] sm:text-xs lg:text-sm text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wide mb-1.5 truncate">
            {product.customizable ? "Customizable" : "Ready to Ship"}
          </p>
          <h3
            className={`font-bold text-brown-900 dark:text-amber-50 leading-tight mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 ${viewMode === "list" ? "text-lg sm:text-xl lg:text-2xl font-serif" : "text-sm sm:text-base lg:text-lg font-serif"}`}
          >
            {product.name}
          </h3>

          {/* Short description for list view */}
          {viewMode === "list" && product.description && (
            <div
              className="hidden sm:block mt-2 mb-4 text-sm lg:text-base text-brown-500 dark:text-amber-100/60 line-clamp-2 font-serif italic"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <div
            className={`flex items-end justify-between gap-2 ${viewMode === "list" ? "mt-auto pt-2" : "mt-auto pt-4"}`}
          >
            <div className="flex flex-col gap-2">
              {viewMode === "list" ? (
                <ManilaTag
                  value={formatPrice(product.price)}
                  label={product.compareAtPrice ? "Now" : "Price"}
                  strikethrough={
                    product.compareAtPrice
                      ? formatPrice(product.compareAtPrice)
                      : undefined
                  }
                />
              ) : (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-brown-900 dark:text-amber-100 font-serif">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-[10px] sm:text-xs lg:text-sm text-brown-400 dark:text-amber-100/50 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              )}
              {product.stockCount < 20 && product.inStock && (
                <span
                  className="hidden md:inline-block self-start text-amber-800 dark:text-amber-400 border border-dashed border-amber-400/60 dark:border-amber-600/50 px-2 py-0.5 rounded-sm"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 15,
                    transform: "rotate(-1.5deg)",
                    display: "inline-block",
                    background: "rgba(251,191,36,0.08)",
                    letterSpacing: "0.02em",
                  }}
                >
                  only {product.stockCount} left!
                </span>
              )}
            </div>
            <button
              onClick={handleAction}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-semibold transition-colors shrink-0 shadow-sm text-white ${
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
