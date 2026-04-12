"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "New York, NY",
    rating: 5,
    text: "The Amber Rose candle is absolutely divine. The scent fills my entire apartment without being overwhelming, and it burns so evenly. I've already ordered three more as gifts!",
    product: "Amber Rose Soy Candle",
    avatar: "https://picsum.photos/seed/avatar1/80/80",
    productLink: "/products/amber-rose-soy-candle",
  },
  {
    id: 2,
    name: "James L.",
    location: "San Francisco, CA",
    rating: 5,
    text: "I ordered the Botanical Press Candle Art as a birthday gift and the recipient was speechless. The craftsmanship is extraordinary — it's truly a work of art that also functions as a candle.",
    product: "Botanical Press Candle Art",
    avatar: "https://picsum.photos/seed/avatar2/80/80",
    productLink: "/products/botanical-press-candle-art",
  },
  {
    id: 3,
    name: "Emma T.",
    location: "London, UK",
    rating: 5,
    text: "The Solstice Gift Collection was the perfect Christmas gift for my mother. Beautiful packaging, gorgeous scents, and the wooden box is something she's kept on display. Worth every penny.",
    product: "The Solstice Gift Collection",
    avatar: "https://picsum.photos/seed/avatar3/80/80",
    productLink: "/products/the-solstice-gift-collection",
  },
];

export default function Testimonials() {
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
          {testimonials.map((t, i) => (
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
              <div className="flex items-center gap-3 mt-auto">
                <Image
                  src={t.avatar}
                  alt={`Avatar of ${t.name}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-brown-900 dark:text-white font-semibold text-sm">
                    {t.name}
                  </p>
                  <p className="text-brown-500 dark:text-amber-100/50 text-xs">
                    {t.location}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-cream-100 dark:border-amber-900/30">
                <p className="text-amber-700 dark:text-amber-400 font-medium text-xs">
                  Purchased:{" "}
                  <Link
                    href={t.productLink}
                    className="hover:underline hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                  >
                    {t.product}
                  </Link>
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
