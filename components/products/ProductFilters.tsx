"use client";
import { useState } from "react";
import { Filter, X, Sparkles, Search, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalCount: number;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  maxPrice?: number;
  currentMaxPrice?: number;
  onMaxPriceChange?: (price: number) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const sortOptions = [
  { value: "featured", label: "Curated picks" },
  { value: "newest", label: "Just arrived" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function FilterContent({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  totalCount,
  hasActiveFilters,
  maxPrice,
  currentMaxPrice,
  onMaxPriceChange,
  onClearFilters,
  viewMode,
  onViewModeChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-8">
      {/* View Mode Toggle */}
      {viewMode && onViewModeChange && (
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-400 dark:bg-amber-600" />
            View
          </h4>
          <div className="flex bg-white dark:bg-[#1a1830] p-1 rounded-xl relative shadow-sm border border-[rgba(122,80,40,0.15)] dark:border-amber-900/30">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-cream-100 dark:bg-amber-900/40 rounded-lg shadow-sm border border-cream-200 dark:border-amber-700/50 z-0"
              initial={false}
              animate={{
                x: viewMode === "grid" ? 0 : "100%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => onViewModeChange("grid")}
              className={`relative z-10 w-1/2 h-8 flex items-center justify-center transition-colors ${
                viewMode === "grid"
                  ? "text-coral-600 dark:text-amber-400"
                  : "text-brown-400 dark:text-amber-100/40 hover:text-brown-600 dark:hover:text-amber-100"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`relative z-10 w-1/2 h-8 flex items-center justify-center transition-colors ${
                viewMode === "list"
                  ? "text-coral-600 dark:text-amber-400"
                  : "text-brown-400 dark:text-amber-100/40 hover:text-brown-600 dark:hover:text-amber-100"
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {searchQuery !== undefined && onSearchChange && (
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-400 dark:bg-amber-600" />
            Search
          </h4>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 dark:text-amber-100/40"
            />
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1a1830] border-2 border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 rounded-xl text-sm text-brown-900 dark:text-amber-100 focus:outline-none focus:border-coral-400 dark:focus:border-amber-700 transition-colors shadow-sm placeholder:text-brown-400 dark:placeholder:text-amber-100/40"
            />
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-400 dark:bg-amber-600" />
          Collection
        </h4>
        <div className="flex flex-wrap gap-2">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
            onClick={() => onCategoryChange("")}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border-2 ${
              selectedCategory === ""
                ? "border-coral-400 bg-coral-50 dark:bg-coral-900/30 text-coral-700 dark:text-coral-300 shadow-sm"
                : "border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 bg-white dark:bg-[#1a1830] text-brown-600 dark:text-amber-100/70 hover:border-coral-300 dark:hover:border-amber-700/50 hover:bg-cream-50 dark:hover:bg-amber-900/40 hover:-translate-y-0.5"
            }`}
          >
            {selectedCategory === "" && (
              <Sparkles
                size={14}
                className="text-coral-500 dark:text-amber-400"
              />
            )}
            Everything
          </motion.button>
          {categories.map((cat, index) => (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 border-2 ${
                selectedCategory === cat.id
                  ? "border-coral-400 bg-coral-50 dark:bg-coral-900/30 text-coral-700 dark:text-coral-300 shadow-sm"
                  : "border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 bg-white dark:bg-[#1a1830] text-brown-600 dark:text-amber-100/70 hover:border-coral-300 dark:hover:border-amber-700/50 hover:bg-cream-50 dark:hover:bg-amber-900/40 hover:-translate-y-0.5"
              }`}
            >
              {selectedCategory === cat.id && (
                <Sparkles
                  size={14}
                  className="text-coral-500 dark:text-amber-400"
                />
              )}
              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-400 dark:bg-amber-600" />
          Sort By
        </h4>
        <div className="flex flex-col gap-2">
          {sortOptions.map((opt, index) => (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between border-2 ${
                sortBy === opt.value
                  ? "border-coral-400 bg-coral-50 dark:bg-coral-900/30 text-coral-700 dark:text-coral-300 shadow-sm"
                  : "border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 bg-white dark:bg-[#1a1830] text-brown-600 dark:text-amber-100/70 hover:border-coral-300 dark:hover:border-amber-700/50 hover:bg-cream-50 dark:hover:bg-amber-900/40 hover:-translate-y-0.5"
              }`}
            >
              <span>{opt.label}</span>
              {sortBy === opt.value && (
                <Sparkles
                  size={14}
                  className="text-coral-500 dark:text-amber-400"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      {maxPrice !== undefined &&
        currentMaxPrice !== undefined &&
        onMaxPriceChange && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coral-400 dark:bg-amber-600" />
                Max Price
              </span>
              <span className="text-sm font-bold text-brown-900 dark:text-amber-100 normal-case tracking-normal">
                ₹{currentMaxPrice}
              </span>
            </h4>
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50}
              value={currentMaxPrice}
              onChange={(e) => onMaxPriceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-cream-200 dark:bg-amber-900/40 rounded-lg cursor-pointer accent-coral-500 dark:accent-amber-400 transition-all"
            />
          </div>
        )}

      {/* Count + clear */}
      <div className="pt-2 flex items-center justify-between">
        <span
          className="text-brown-400 dark:text-amber-100/40"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          {totalCount} pieces
        </span>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-[10px] font-bold uppercase tracking-widest text-coral-700 dark:text-amber-300 bg-coral-50 dark:bg-amber-900/30 hover:bg-coral-100 dark:hover:bg-amber-900/50 px-2.5 py-1.5 rounded-lg border border-coral-200 dark:border-amber-700/30 transition-all flex items-center gap-1 shadow-sm hover:-translate-y-0.5"
          >
            Clear <X size={12} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductFilters(props: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = [
    props.selectedCategory !== "",
    props.sortBy !== "featured",
    Boolean(props.searchQuery),
    props.currentMaxPrice !== undefined &&
      props.maxPrice !== undefined &&
      props.currentMaxPrice < props.maxPrice,
  ].filter(Boolean).length;

  return (
    <>
      {/* ── Mobile: toggle button + collapsible panel ── */}
      <div className="lg:hidden mb-6 relative">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={`flex items-center justify-between w-full px-5 py-3.5 bg-[#fdf8ef] dark:bg-[#1c1710] border border-solid border-[rgba(122,80,40,0.25)] dark:border-amber-900/30 rounded-xl shadow-sm transition-all ${mobileOpen ? "rounded-b-none border-b-0" : ""}`}
        >
          <span className="flex items-center gap-2 font-serif font-bold text-brown-900 dark:text-amber-100 text-lg">
            <Sparkles
              size={16}
              className="text-coral-500 dark:text-amber-400"
            />
            Filter & Sort
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-coral-600 dark:bg-amber-500 text-white flex items-center justify-center font-sans text-[10px] font-bold ml-1 shadow-sm">
                {activeCount}
              </span>
            )}
          </span>
          <span className="text-brown-500 dark:text-amber-100/60 font-serif italic text-sm">
            {props.totalCount} items {mobileOpen ? "↑" : "↓"}
          </span>
        </button>

        {mobileOpen && (
          <div className="relative px-5 pt-4 pb-6 bg-[#fdf8ef] dark:bg-[#1c1710] border border-solid border-[rgba(122,80,40,0.25)] dark:border-amber-900/30 border-t-0 rounded-b-xl shadow-sm z-10">
            <FilterContent {...props} />
          </div>
        )}
      </div>

      {/* ── Desktop: sticky notebook sidebar ── */}
      <div className="hidden lg:block w-full mt-12">
        <motion.div
          initial={{ opacity: 0, y: -150, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 12 }}
          className="relative bg-[#fdf8ef] dark:bg-[#1c1710] p-6 lg:p-8 pt-10 lg:pt-12 rounded-2xl shadow-[0_15px_40px_-10px_rgba(67,44,26,0.15)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-solid border-[rgba(122,80,40,0.25)] dark:border-amber-900/30 sticky top-28 origin-top transition-all"
        >
          {/* Hanging Mechanism */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
            {/* Thumb Pin */}
            <motion.div
              initial={{ scale: 1.5, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.4,
              }}
              className="relative w-5 h-5 z-30"
            >
              {/* Animated Shadow to simulate depth */}
              <motion.div
                initial={{ x: 12, y: 16, opacity: 0, filter: "blur(5px)" }}
                animate={{ x: 4, y: 6, opacity: 0.4, filter: "blur(2px)" }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.4,
                }}
                className="absolute inset-0 rounded-full bg-[#412e1f] dark:bg-black"
              />
              {/* Realistic Pin Body */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] border border-red-800/60">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-sm border border-gray-500/50" />
              </div>
            </motion.div>
            {/* Thread */}
            <svg
              className="w-10 h-[70px] -mt-2 drop-shadow-[0_2px_3px_rgba(67,44,26,0.3)] dark:drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
              viewBox="0 0 40 70"
              fill="none"
            >
              <path
                d="M20 0 Q 12 35 16 60"
                stroke="#a87954"
                strokeWidth="1.5"
              />
              <path
                d="M20 0 Q 28 35 24 60"
                stroke="#a87954"
                strokeWidth="1.5"
              />
              <path
                d="M16 60 C 16 68, 24 68, 24 60"
                stroke="#a87954"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Hole Punch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[var(--home-bg-alt)] dark:bg-[#1a1612] border border-solid border-[rgba(122,80,40,0.25)] shadow-inner flex items-center justify-center z-10">
            <div className="w-full h-full rounded-full border-2 border-[#d4b49c] dark:border-amber-900/50" />
          </div>

          {/* Heading */}
          <div className="flex items-center justify-between mb-8 mt-2">
            <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 flex items-center gap-2.5">
              <Filter
                size={18}
                className="text-coral-500 dark:text-amber-400"
              />
              Curate
            </h3>
          </div>

          <FilterContent {...props} />
        </motion.div>
      </div>
    </>
  );
}
