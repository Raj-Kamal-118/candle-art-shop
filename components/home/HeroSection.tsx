"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Gift,
  Heart,
} from "lucide-react";
import { HeroSettings, HeroButtonIcon } from "@/lib/types";

const ICON_MAP: Record<HeroButtonIcon, React.ReactNode> = {
  "arrow-right": <ArrowRight size={18} />,
  "shopping-bag": <ShoppingBag size={18} />,
  sparkles: <Sparkles size={18} />,
  star: <Star size={18} />,
  gift: <Gift size={18} />,
  heart: <Heart size={18} />,
  "": null,
};

interface HeroSectionProps {
  settings: HeroSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const {
    badgeText,
    h1Text,
    h1HighlightedText,
    h1TextColor,
    description,
    buttons,
    backgroundType,
    backgroundValue,
    showImages,
    images,
    showStats,
    stats,
    floatingBadgeText,
  } = settings;

  // Ensure we always have 4 image slots (pad with empty strings)
  const imageSlots = [...images, "", "", "", ""].slice(0, 4);

  // Background style
  const sectionStyle: React.CSSProperties = {};
  if (backgroundType === "color" && backgroundValue) {
    sectionStyle.backgroundColor = backgroundValue;
  } else if (backgroundType === "image" && backgroundValue) {
    sectionStyle.backgroundImage = `url(${backgroundValue})`;
    sectionStyle.backgroundSize = "cover";
    sectionStyle.backgroundPosition = "center";
  }

  const isCustomBg = backgroundType !== "gradient";

  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden ${
        isCustomBg
          ? ""
          : "bg-gradient-to-br from-cream-100 via-cream-50 to-coral-50 dark:from-[#0a0a16] dark:via-[#0f0e1c] dark:to-[#12101e]"
      }`}
      style={sectionStyle}
    >
      {/* Video background */}
      {backgroundType === "video" && backgroundValue && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundValue}
        />
      )}

      {/* Overlay for image/video backgrounds */}
      {(backgroundType === "image" || backgroundType === "video") && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {/* Background decoration (only for gradient mode) */}
      {backgroundType === "gradient" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral-200/30 dark:bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-forest-100/40 dark:bg-amber-700/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gold-100/50 dark:bg-amber-400/5 rounded-full blur-2xl" />
          <div className="hidden dark:block absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/8 rounded-full blur-[100px]" />
        </div>
      )}

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
              {badgeText}
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 dark:text-amber-50 leading-tight mb-6">
              {h1Text}
              <span
                className="block dark:candle-text-glow"
                style={{ color: h1TextColor }}
              >
                {h1HighlightedText}
              </span>
            </h1>

            <p className="text-lg text-forest-700 dark:text-amber-100/60 leading-relaxed mb-8 max-w-lg">
              {description}
            </p>

            {/* Buttons — 2 per row */}
            {buttons.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {buttons.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.link}
                    className={
                      btn.variant === "primary"
                        ? "inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:shadow-xl hover:-translate-y-0.5 text-sm"
                        : "inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-6 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
                    }
                  >
                    {btn.text}
                    {ICON_MAP[btn.icon]}
                  </Link>
                ))}
              </div>
            )}

            {/* Stats */}
            {showStats && stats.length > 0 && (
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-cream-200 dark:border-amber-900/20">
                {stats.map((stat) => (
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
            )}
          </motion.div>
        </div>

        {/* Image grid */}
        {showImages && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {imageSlots[0] && (
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl dark:shadow-amber-900/20 dark:candle-glow">
                    <img
                      src={imageSlots[0]}
                      alt="Hero image 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                {imageSlots[1] && (
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl dark:shadow-amber-900/20">
                    <img
                      src={imageSlots[1]}
                      alt="Hero image 2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4 pt-10">
                {imageSlots[2] && (
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl dark:shadow-amber-900/20">
                    <img
                      src={imageSlots[2]}
                      alt="Hero image 3"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                {imageSlots[3] && (
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl dark:shadow-amber-900/20 dark:candle-glow">
                    <img
                      src={imageSlots[3]}
                      alt="Hero image 4"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Floating badge */}
            {floatingBadgeText && (
              <div className="absolute -left-6 top-1/3 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 rounded-2xl shadow-xl p-4 border border-cream-200">
                <p className="text-xs text-forest-500 dark:text-amber-100/50 mb-1">
                  Special offer
                </p>
                <p className="text-sm font-bold text-forest-900 dark:text-amber-200">
                  {floatingBadgeText}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
