"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  text: string;
  product_name: string;
  image_url: string | null;
}

export default function Testimonials({ reviews = [] }: { reviews?: Review[] }) {
  const displayReviews = reviews.slice(0, 3);

  if (displayReviews.length === 0) return null;

  return (
    <section className="relative py-20 bg-cream-50 dark:bg-[#0f0e1c] border-t border-cream-200 dark:border-amber-900/20 transition-colors duration-300 overflow-hidden">
      {/* Central candle light glow effect */}
      <div className="absolute pointer-events-none inset-0 z-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 dark:text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              What Our Customers Say
            </p>
            <h2 className="font-serif text-4xl font-bold text-brown-900 dark:text-white">
              Stories of Warmth
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {displayReviews.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col h-full bg-white dark:bg-[#1a1830] shadow-sm dark:shadow-none rounded-2xl p-7 relative border border-cream-200 dark:border-amber-900/30 transition-colors duration-300"
            >
              <Quote
                className="text-amber-100 dark:text-amber-900/40 absolute top-6 right-6"
                size={32}
                aria-hidden="true"
              />
              <div
                className="flex items-center gap-1 mb-4"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-brown-600 dark:text-amber-100/70 text-sm leading-relaxed mb-5 relative z-10">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto relative z-10">
                {t.image_url ? (
                  <img
                    src={t.image_url}
                    alt={`Photo by ${t.customer_name}`}
                    className="w-10 h-10 rounded-xl object-cover border border-cream-200 dark:border-amber-900/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-800 dark:text-amber-200 font-bold">
                    {t.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-brown-900 dark:text-white font-semibold text-sm">
                    {t.customer_name}
                  </p>
                  <p className="text-brown-500 dark:text-amber-100/50 text-xs">
                    {t.location || "Verified Buyer"}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-cream-100 dark:border-amber-900/30">
                <p className="text-amber-700 dark:text-amber-400 font-medium text-xs">
                  Purchased:{" "}
                  <span className="font-semibold">{t.product_name}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center px-6 py-3 border border-amber-200 dark:border-amber-800 rounded-full text-sm font-medium text-brown-900 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300"
            >
              Read All Reviews
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
