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

const TAPE_CLIP_PATH =
  "polygon(0% 0%, 100% 0%, 95% 12.5%, 100% 25%, 95% 37.5%, 100% 50%, 95% 62.5%, 100% 75%, 95% 87.5%, 100% 100%, 0% 100%, 5% 87.5%, 0% 75%, 5% 62.5%, 0% 50%, 5% 37.5%, 0% 25%, 5% 12.5%)";

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

  // Ensure we always have 4 image slots (pad with null)
  const normalizedImages = images.map((img) => {
    if (typeof img === "string") return { url: img };
    return img;
  });
  const imageSlots = [...normalizedImages, null, null, null, null].slice(0, 4);

  const HeroCardInner = ({ slot }: { slot: any }) => (
    <>
      <img
        src={slot.url}
        alt={slot.name || "Hero image"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {slot.name && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center px-3 z-10 pointer-events-none">
          <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-forest-900 dark:text-amber-100 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/20 truncate max-w-full transition-transform group-hover:-translate-y-0.5">
            {slot.name}
          </span>
        </div>
      )}
    </>
  );

  const renderCardContainer = (slot: any, children: React.ReactNode) => {
    if (slot.link) {
      return (
        <Link
          href={slot.link}
          className="w-full h-full rounded-lg overflow-hidden block relative"
        >
          {children}
        </Link>
      );
    }
    return (
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        {children}
      </div>
    );
  };

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

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-16 items-center">
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
              {h1Text}{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  className="dark:candle-text-glow"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "1.08em",
                    color: h1TextColor || "var(--home-coral)",
                  }}
                >
                  {h1HighlightedText}
                </span>
                <svg
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: -4,
                    width: "100%",
                    height: 12,
                    overflow: "visible",
                  }}
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,6 C30,0 60,12 100,6 C140,0 170,12 200,6"
                    fill="none"
                    stroke={h1TextColor || "var(--home-coral)"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 17,
                color: "var(--home-muted)",
                marginBottom: 24,
                maxWidth: 420,
              }}
            >
              {description}
            </p>

            {/* Buttons — 2 per row */}
            {buttons.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-w-lg">
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
                {imageSlots[0] && imageSlots[0].url && (
                  <div className="relative group aspect-[3/4] rounded-xl shadow-[0_16px_40px_rgba(28,18,9,0.15)] dark:shadow-amber-900/20 bg-white dark:bg-[#1a1830] p-2.5 pb-12 border border-cream-200 dark:border-amber-900/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500 dark:candle-glow">
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%) rotate(-4deg)",
                        width: 100,
                        height: 28,
                        background: "rgba(253, 230, 138, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        clipPath: TAPE_CLIP_PATH,
                      }}
                    />
                    {renderCardContainer(
                      imageSlots[0],
                      <HeroCardInner slot={imageSlots[0]} />,
                    )}
                  </div>
                )}
                {imageSlots[1] && imageSlots[1].url && (
                  <div className="relative group aspect-square rounded-xl shadow-xl dark:shadow-amber-900/20 bg-white dark:bg-[#1a1830] p-2.5 pb-10 border border-cream-200 dark:border-amber-900/30 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%) rotate(3deg)",
                        width: 90,
                        height: 28,
                        background: "rgba(253, 230, 138, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        clipPath: TAPE_CLIP_PATH,
                      }}
                    />
                    {renderCardContainer(
                      imageSlots[1],
                      <HeroCardInner slot={imageSlots[1]} />,
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-4 pt-10">
                {imageSlots[2] && imageSlots[2].url && (
                  <div className="relative group aspect-square rounded-xl shadow-xl dark:shadow-amber-900/20 bg-white dark:bg-[#1a1830] p-2.5 pb-10 border border-cream-200 dark:border-amber-900/30 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%) rotate(-3deg)",
                        width: 90,
                        height: 28,
                        background: "rgba(253, 230, 138, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        clipPath: TAPE_CLIP_PATH,
                      }}
                    />
                    {renderCardContainer(
                      imageSlots[2],
                      <HeroCardInner slot={imageSlots[2]} />,
                    )}
                  </div>
                )}
                {imageSlots[3] && imageSlots[3].url && (
                  <div className="relative group aspect-[3/4] rounded-xl shadow-[0_16px_40px_rgba(28,18,9,0.15)] dark:shadow-amber-900/20 bg-white dark:bg-[#1a1830] p-2.5 pb-12 border border-cream-200 dark:border-amber-900/30 transform rotate-3 hover:rotate-0 transition-transform duration-500 dark:candle-glow">
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%) rotate(4deg)",
                        width: 100,
                        height: 28,
                        background: "rgba(253, 230, 138, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        clipPath: TAPE_CLIP_PATH,
                      }}
                    />
                    {renderCardContainer(
                      imageSlots[3],
                      <HeroCardInner slot={imageSlots[3]} />,
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Floating badge */}
            {floatingBadgeText && (
              <div className="absolute -left-8 top-1/3 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 rounded-xl shadow-xl pt-6 pb-4 px-5 border border-cream-200 transform -rotate-6 z-20">
                {/* Push Pin */}
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 20,
                    zIndex: 10,
                    filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 10,
                      width: 10,
                      height: 10,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: "50%",
                      transform: "translate(2px, 2px)",
                      filter: "blur(2px)",
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: "#e85d4a",
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#e85d4a",
                      backgroundImage:
                        "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                      boxShadow:
                        "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        width: 3,
                        height: 3,
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        filter: "blur(0.5px)",
                      }}
                    />
                  </div>
                </div>
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
