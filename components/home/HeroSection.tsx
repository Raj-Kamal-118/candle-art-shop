"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-coral-50 dark:from-[#0a0a16] dark:via-[#0f0e1c] dark:to-[#12101e]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral-200/30 dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-forest-100/40 dark:bg-amber-700/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gold-100/50 dark:bg-amber-400/5 rounded-full blur-2xl" />
        {/* Dark mode candle glow */}
        <div className="hidden dark:block absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-coral-100 dark:bg-amber-900/40 text-coral-800 dark:text-amber-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6 dark:border dark:border-amber-700/30">
              <Sparkles size={14} />
              Handcrafted with love
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 dark:text-amber-50 leading-tight mb-6">
              Light Your World
              <span className="block text-coral-600 dark:text-amber-400 dark:candle-text-glow">
                With Art
              </span>
            </h1>

            <p className="text-lg text-forest-700 dark:text-amber-100/60 leading-relaxed mb-8 max-w-lg">
              Discover our collection of handcrafted candles, clay art, and
              creative crafts. Each piece is made with intention, using the
              finest natural ingredients and artistic craftsmanship.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                Shop Collection
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/categories/custom-artwork"
                className="inline-flex items-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-4 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200"
              >
                Custom Orders
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-cream-200 dark:border-amber-900/20">
              {[
                { value: "500+", label: "Happy Customers" },
                { value: "100%", label: "Natural Ingredients" },
                { value: "11", label: "Signature Products" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-forest-900 dark:text-amber-300 font-serif dark:candle-text-glow">
                    {stat.value}
                  </p>
                  <p className="text-sm text-forest-500 dark:text-amber-100/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Image grid */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl dark:shadow-amber-900/20 dark:candle-glow">
                <img
                  src="https://picsum.photos/seed/hero1/400/550"
                  alt="Featured candle"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl dark:shadow-amber-900/20">
                <img
                  src="https://picsum.photos/seed/hero3/400/400"
                  alt="Artwork"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-10">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl dark:shadow-amber-900/20">
                <img
                  src="https://picsum.photos/seed/hero2/400/400"
                  alt="Gift set"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl dark:shadow-amber-900/20 dark:candle-glow">
                <img
                  src="https://picsum.photos/seed/hero4/400/550"
                  alt="Scented candle"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -left-6 top-1/3 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 rounded-2xl shadow-xl p-4 border border-cream-200">
            <p className="text-xs text-forest-500 dark:text-amber-100/50 mb-1">Free shipping on</p>
            <p className="text-sm font-bold text-forest-900 dark:text-amber-200">Orders over ₹999</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
