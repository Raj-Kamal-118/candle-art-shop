"use client";

import { useRef, useState, useEffect } from "react";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const showRightFade = canScroll && scrollProgress < 98;
  const showLeftFade = canScroll && scrollProgress > 2;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setCanScroll(scrollWidth > clientWidth);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll > 0) {
        const progress = (scrollLeft / maxScroll) * 100;
        setScrollProgress(progress);
      }
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [products]);

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
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-5 z-20 w-10 h-10 bg-white dark:bg-[#1a1830] rounded-full shadow-lg border border-cream-200 dark:border-amber-900/30 flex items-center justify-center text-brown-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Left fade overlay */}
        <div
          className={`absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#fdf8ef] to-transparent pointer-events-none transition-opacity duration-300 z-10 dark:from-[#1a1612] ${
            showLeftFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Right fade overlay */}
        <div
          className={`absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fdf8ef] to-transparent pointer-events-none transition-opacity duration-300 z-10 dark:from-[#1a1612] ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1 sm:px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[200px] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Scroll right button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-5 z-20 w-10 h-10 bg-white dark:bg-[#1a1830] rounded-full shadow-lg border border-cream-200 dark:border-amber-900/30 flex items-center justify-center text-brown-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Visual Scroll Indicator */}
      {canScroll && (
        <div className="mt-4 h-1.5 w-32 sm:w-48 mx-auto bg-cream-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 dark:bg-amber-600 rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${Math.max(15, scrollProgress)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
