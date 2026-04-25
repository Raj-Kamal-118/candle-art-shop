"use client";

import Link from "next/link";
import Image from "next/image";
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
import StickyNote from "@/components/ui/StickyNote";

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

const POLAROID_LAYOUTS = [
  {
    className: "-top-[42px] -left-[10px] w-[360px] z-10",
    rotate: "-rotate-2",
    tapeRotate: -8,
    small: false,
  },
  {
    className: "-top-[26px] right-[6px] w-[280px] z-10",
    rotate: "rotate-3",
    tapeRotate: 6,
    small: true,
  },
  {
    className: "-bottom-[50px] left-[38px] w-[270px] z-10",
    rotate: "-rotate-6",
    tapeRotate: -12,
    small: true,
  },
  {
    className: "-bottom-[34px] -right-[10px] w-[310px] z-10",
    rotate: "rotate-2",
    tapeRotate: 4,
    small: false,
  },
];

const STICKY_LAYOUTS = [
  {
    className: "top-[300px] -left-[26px] w-[170px] rotate-12",
    color: "#fef3c7",
    pin: "#ef4444",
  },
  {
    className: "top-[100px] -right-[42px] w-[160px] -rotate-12",
    color: "#e0f2fe",
    pin: "#3b82f6",
  },
  {
    className: "-bottom-[20px] left-0 w-[160px] rotate-3",
    color: "#dcfce7",
    pin: "#10b981",
  },
  {
    className: "bottom-[190px] -right-[26px] w-[160px] -rotate-3",
    color: "#f3e8ff",
    pin: "#a855f7",
  },
];

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
  const normalizedImages = images.map((img: any) => {
    if (typeof img === "string") return { url: img };
    return img;
  });
  const imageSlots = [...normalizedImages, null, null, null, null].slice(0, 4);

  const HeroCardInner = ({
    slot,
    isPriority = false,
    small = false,
  }: {
    slot: any;
    isPriority?: boolean;
    small?: boolean;
  }) => (
    <div className="flex flex-col h-full w-full pointer-events-none">
      <div
        className="relative w-full rounded-xl overflow-hidden bg-cream-100 dark:bg-amber-900/20 shadow-inner"
        style={{ aspectRatio: small ? "1/1" : "4/4.4" }}
      >
        <Image
          src={slot.url}
          alt={slot.name || "Hero image"}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          priority={isPriority}
          className="w-full h-full object-cover pointer-events-auto group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      {slot.name && (
        <div className="mt-3 text-center shrink-0 px-1">
          <span
            className={`font-script font-medium text-brown-800 dark:text-amber-200 tracking-wide drop-shadow-sm leading-tight ${small ? "text-[22px]" : "text-[26px]"}`}
          >
            {slot.name}
          </span>
        </div>
      )}
    </div>
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
      className={`relative min-h-[860px] flex items-center overflow-hidden ${
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
            className="relative hidden lg:block h-[700px] w-full"
          >
            {imageSlots.map((slot: any, idx) => {
              if (!slot || !slot.url) return null;
              const layout = POLAROID_LAYOUTS[idx];
              const sticky = STICKY_LAYOUTS[idx];

              return (
                <div key={idx}>
                  <div
                    className={`group absolute bg-white dark:bg-[#1a1830] rounded-2xl shadow-[0_18px_40px_-16px_rgba(45,31,20,0.4),0_4px_8px_-2px_rgba(45,31,20,0.15)] dark:shadow-amber-900/20 transform ${layout.rotate} transition-transform duration-500 dark:candle-glow ${layout.className}`}
                    style={{
                      padding: layout.small
                        ? "10px 10px 14px"
                        : "14px 14px 18px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: `translateX(-50%) rotate(${layout.tapeRotate}deg)`,
                        width: layout.small ? 90 : 110,
                        height: 28,
                        background: "rgba(253, 230, 138, 0.6)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                        clipPath: TAPE_CLIP_PATH,
                      }}
                    />
                    {renderCardContainer(
                      slot,
                      <HeroCardInner
                        slot={slot}
                        isPriority={idx === 0}
                        small={layout.small}
                      />,
                    )}
                  </div>
                  {slot.offerText && (
                    <StickyNote
                      type={slot.offerType || "Special Offer"}
                      text={slot.offerText}
                      pinColor={sticky.pin}
                      bgColor={sticky.color}
                      positionClass={sticky.className}
                    />
                  )}
                </div>
              );
            })}

            {/* Floating Site Wide Badge */}
            {floatingBadgeText && (
              <StickyNote
                type="Special Offer"
                text={floatingBadgeText}
                pinColor="#f97316"
                bgColor="#fee2e2"
                positionClass="absolute top-[430px] left-[300px] w-[150px] -rotate-3 z-30"
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
