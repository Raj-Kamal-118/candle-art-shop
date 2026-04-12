"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="relative py-20 bg-white dark:bg-[#0a0a16] border-t border-cream-200 dark:border-amber-900/20 transition-colors duration-300 overflow-hidden">
      {/* Candle light glow effect */}
      <div className="absolute pointer-events-none inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-coral-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 dark:text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              Our Bestsellers
            </p>
            <h2 className="font-serif text-4xl font-bold text-brown-900 dark:text-white">
              Featured Collection
            </h2>
          </motion.div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
