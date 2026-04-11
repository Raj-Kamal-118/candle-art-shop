"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "New York, NY",
    rating: 5,
    text: "The Amber Rose candle is absolutely divine. The scent fills my entire apartment without being overwhelming, and it burns so evenly. I've already ordered three more as gifts!",
    product: "Amber Rose Soy Candle",
    avatar: "https://picsum.photos/seed/avatar1/80/80",
  },
  {
    id: 2,
    name: "James L.",
    location: "San Francisco, CA",
    rating: 5,
    text: "I ordered the Botanical Press Candle Art as a birthday gift and the recipient was speechless. The craftsmanship is extraordinary — it's truly a work of art that also functions as a candle.",
    product: "Botanical Press Candle Art",
    avatar: "https://picsum.photos/seed/avatar2/80/80",
  },
  {
    id: 3,
    name: "Emma T.",
    location: "London, UK",
    rating: 5,
    text: "The Solstice Gift Collection was the perfect Christmas gift for my mother. Beautiful packaging, gorgeous scents, and the wooden box is something she's kept on display. Worth every penny.",
    product: "The Solstice Gift Collection",
    avatar: "https://picsum.photos/seed/avatar3/80/80",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-brown-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
              What Our Customers Say
            </p>
            <h2 className="font-serif text-4xl font-bold text-white">
              Stories of Warmth
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-brown-800/60 backdrop-blur-sm rounded-2xl p-7 relative border border-brown-700/50"
            >
              <Quote
                className="text-amber-700/40 absolute top-6 right-6"
                size={32}
              />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-cream-200 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-cream-400 text-xs">{t.location}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-brown-700/50">
                <p className="text-amber-500 text-xs">Purchased: {t.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
