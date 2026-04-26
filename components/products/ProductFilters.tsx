"use client";
import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

import { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === ""
              ? "bg-amber-700 text-white shadow-sm dark:bg-amber-600"
              : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80 border border-brown-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-500"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-amber-700 text-white shadow-sm dark:bg-amber-600"
                : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80 border border-brown-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-500"
            }`}
          >
            {cat.name}
          </button>
        ))}
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm bg-white dark:bg-[#1a1830] text-coral-600 dark:text-amber-400 border border-cream-200 dark:border-amber-900/40 hover:bg-coral-50 dark:hover:bg-amber-900/30"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm text-brown-500 dark:text-amber-100/50 hidden sm:block">
          {totalCount} products
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[160px] flex items-center justify-between px-3 py-2 border border-brown-200 dark:border-amber-900/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80"
          >
            <span>
              {sortOptions.find((o) => o.value === sortBy)?.label || "Sort"}
            </span>
            <ChevronDown
              size={16}
              className={`text-brown-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 z-50 w-full min-w-[180px] mt-2 py-1 bg-white dark:bg-[#1a1830] border border-brown-200 dark:border-amber-900/30 rounded-xl shadow-xl">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === opt.value
                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 font-medium"
                        : "text-brown-700 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
