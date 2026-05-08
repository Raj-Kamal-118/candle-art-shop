"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PrimarySectionHeader from "@/components/ui/PrimarySectionHeader";

const CARDS = [
  {
    title: "Custom Candles",
    href: "/custom/candle",
    desc: "Pick your wax, wick, vessel, and scent. A candle that carries your exact name.",
    badge: "Starting from ₹300",
    cta: "Design your personal candle",
    accent: "var(--home-coral)",
    image: "/images/custom/01-candle.png",
  },
  {
    title: "Custom Magnets",
    href: "/custom/magnet",
    desc: "Send us a photo, sketch, or idea. We hand-paint it onto ceramic.",
    badge: "Starting from ₹200",
    cta: "Submit idea for a Magnet",
    accent: "var(--home-coral)",
    elevated: true,
    image: "/images/custom/02-magnet.png",
  },
  {
    title: "Gift Sets",
    href: "/custom/gift-set",
    desc: "Build a box of anything for anyone. Ribbon, note card, wrapped by hand.",
    badge: "Starting from ₹1,200",
    cta: "Build a Gift set",
    accent: "var(--home-coral)",
    image: "/images/custom/03-gift.png",
  },
];

export default function CustomTrio() {
  return (
    <section
      className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] overflow-hidden"
      style={{
        position: "relative",
        padding: "96px 0",
        borderTop: "1px solid var(--home-border)",
      }}
    >
      {/* Radial ambient glows */}
      <div
        aria-hidden="true"
        className="hidden dark:block"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(217,119,6,.15), transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden dark:block"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 70%, rgba(194,82,42,.14), transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-6"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <PrimarySectionHeader
            eyebrow="✦ Made to order ✦"
            titlePrefix="We'll make it"
            titleHighlighted="just for you."
            description="Every piece begins with a conversation. Tell us what you need — we do the rest."
            className="mb-16"
          />
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ alignItems: "start" }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{
                transform: card.elevated ? "translateY(-12px)" : undefined,
              }}
            >
              <div
                className="group flex flex-col h-full"
                style={{
                  background: "var(--home-card)",
                  border: "1px solid var(--home-border)",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 12px 32px rgba(28,18,9,.06)",
                }}
              >
                {/* Image Header */}
                <div className="relative w-full h-48 overflow-hidden bg-cream-50 dark:bg-black/20">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      style={{
                        display: "inline-block",
                        background: "var(--home-bg)",
                        color: "var(--home-text)",
                        borderRadius: 999,
                        padding: "5px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: ".02em",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>
                </div>

                <div
                  style={{ padding: "24px 28px 28px" }}
                  className="flex flex-col flex-1"
                >
                  <h3 className="font-serif text-[26px] font-bold text-brown-900 dark:text-amber-50 mb-2.5 leading-[1.2]">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-brown-500 dark:text-amber-100/60 leading-[1.65] mb-7 flex-1">
                    {card.desc}
                  </p>
                  <Link
                    href={card.href}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-white bg-coral-600 hover:bg-coral-700 dark:bg-[#d97706] dark:hover:bg-amber-500"
                  >
                    {card.cta} →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
