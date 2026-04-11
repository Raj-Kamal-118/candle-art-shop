"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 font-medium text-sm uppercase tracking-widest mb-3">
              Browse By Category
            </p>
            <h2 className="font-serif text-4xl font-bold text-brown-900 mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-brown-500 max-w-xl mx-auto">
              Explore our curated categories, from fragrant soy candles to
              one-of-a-kind art pieces.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-lg font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-cream-200 text-xs mb-3">
                    {category.productCount} products
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Shop now
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
