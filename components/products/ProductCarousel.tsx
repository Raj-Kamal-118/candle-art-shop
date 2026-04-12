"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export default function ProductCarousel({
  products,
  title,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {title && (
        <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          {title}
        </h3>
      )}

      <div className="relative group/carousel">
        {/* Scroll left button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-5 z-10 w-10 h-10 bg-white dark:bg-[#1a1830] rounded-full shadow-lg border border-cream-200 dark:border-amber-900/30 flex items-center justify-center text-brown-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1 sm:px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-44 sm:w-64 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Scroll right button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-5 z-10 w-10 h-10 bg-white dark:bg-[#1a1830] rounded-full shadow-lg border border-cream-200 dark:border-amber-900/30 flex items-center justify-center text-brown-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
