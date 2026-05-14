"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Tag,
  Sparkles,
  Gift,
  Truck,
  Rocket,
  Megaphone,
  Star,
  Heart,
  Copy,
  Check,
  Scissors,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const ICONS: Record<string, any> = {
  sparkles: Sparkles,
  truck: Truck,
  gift: Gift,
  tag: Tag,
  rocket: Rocket,
  megaphone: Megaphone,
  star: Star,
  heart: Heart,
};

const CLIP_STYLES = [
  { left: "20%", top: -14, rotate: -12 },
  { left: "75%", top: -10, rotate: 18 },
  { left: "50%", top: -16, rotate: 5 },
  { left: "30%", top: -12, rotate: 25 },
  { left: "80%", top: -18, rotate: -8 },
  { left: "60%", top: -12, rotate: -15 },
];

export default function OffersBoard({ offers = [] }: { offers: any[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  // Auto-sliding Carousel logic
  useEffect(() => {
    if (offers.length <= 1) return;

    const interval = setInterval(() => {
      if (isHovered.current) return;

      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // If all items fit on the screen perfectly, don't attempt to slide
        if (scrollWidth <= clientWidth) return;

        // Calculate the exact width of one card + the 24px gap (gap-6)
        const firstChild = scrollRef.current.firstElementChild as HTMLElement;
        const scrollStep = firstChild ? firstChild.offsetWidth + 24 : 264;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
        }
      }
    }, 3500); // Sped up slightly for a better carousel feel
    return () => clearInterval(interval);
  }, [offers.length]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleNext = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      const scrollStep = firstChild ? firstChild.offsetWidth + 24 : 264;
      scrollRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      const scrollStep = firstChild ? firstChild.offsetWidth + 24 : 264;
      scrollRef.current.scrollBy({ left: -scrollStep, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const firstChild = scrollRef.current.firstElementChild as HTMLElement;
    const itemWidth = firstChild ? firstChild.offsetWidth + 24 : 264;
    const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
    if (index >= 0 && index < offers.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollToOffer = (index: number) => {
    if (!scrollRef.current) return;
    const firstChild = scrollRef.current.firstElementChild as HTMLElement;
    const itemWidth = firstChild ? firstChild.offsetWidth + 24 : 264;
    scrollRef.current.scrollTo({ left: itemWidth * index, behavior: "smooth" });
  };

  if (offers.length === 0) return null;

  return (
    <section className="py-8 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-[#2a1310] dark:via-[#24120a] dark:to-[#1a1612] border-y border-dashed border-red-200/60 dark:border-red-900/30 overflow-hidden relative z-10">
      <style>{`
        @keyframes snip {
          0%, 100% { transform: rotate(-45deg) scaleY(1); }
          50% { transform: rotate(-45deg) scaleY(0.6); }
        }
        .scissor-icon {
          transform: rotate(-45deg);
        }
        .coupon-group:hover .scissor-icon {
          animation: snip 0.3s ease-in-out infinite;
        }
        .offers-no-scroll::-webkit-scrollbar {
          display: none;
        }
        .offers-no-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Subtle felt texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/felt.png')",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Text Content */}
          <div className="lg:w-1/3 text-center lg:text-left">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-700 dark:text-red-400 mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ✦ A little extra ✦
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-2">
              Current{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  className="text-coral-600 dark:text-amber-400"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "1.2em",
                  }}
                >
                  Offers
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
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-coral-600 dark:text-amber-400"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-brown-500 dark:text-amber-100/60 font-serif italic text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 mt-2">
              Because we love a good surprise. Grab these studio deals before
              they melt away.
            </p>
          </div>

          {/* Sticky Notes Strip */}
          <div className="lg:w-2/3 w-full relative group/carousel">
            {/* Crafty Carousel Navigation */}
            <button
              onClick={handlePrev}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/40 rounded-full text-brown-500 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-50 dark:hover:bg-[#242040] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(232,93,74,0.15)] opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 disabled:opacity-0"
              aria-label="Previous offer"
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>
            <button
              onClick={handleNext}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/40 rounded-full text-brown-500 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-50 dark:hover:bg-[#242040] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(232,93,74,0.15)] opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 disabled:opacity-0"
              aria-label="Next offer"
            >
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            <div
              ref={scrollRef}
              onMouseEnter={() => (isHovered.current = true)}
              onMouseLeave={() => (isHovered.current = false)}
              onTouchStart={() => (isHovered.current = true)}
              onTouchEnd={() =>
                setTimeout(() => (isHovered.current = false), 2000)
              }
              onScroll={handleScroll}
              className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-4 px-4 -mx-4 lg:mx-0 offers-no-scroll items-center scroll-smooth"
            >
              {offers.map((offer, i) => {
                const iconKey = (offer.icon || "").toLowerCase().trim();
                const Icon = ICONS[iconKey] || Sparkles;
                const rotateDeg =
                  i % 2 === 0 ? (i % 4 === 0 ? -3 : 2) : i % 3 === 0 ? 3 : -2;
                const clipStyle = CLIP_STYLES[i % CLIP_STYLES.length];

                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="snap-center shrink-0 w-[220px] sm:w-[240px] h-[220px] sm:h-[240px] flex flex-col relative group transition-transform hover:z-20"
                    style={{ transform: `rotate(${rotateDeg}deg)` }}
                  >
                    {/* Metallic Paperclip */}
                    <div
                      className="absolute z-30 transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-md"
                      style={{
                        top: clipStyle.top,
                        left: clipStyle.left,
                        transform: `translateX(-50%) rotate(${clipStyle.rotate}deg)`,
                      }}
                    >
                      <svg
                        width="24"
                        height="48"
                        viewBox="0 0 32 64"
                        fill="none"
                      >
                        <path
                          d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48 A 11 11 0 0 1 4 48 V 16"
                          stroke={offer.pin_color || "#d97706"}
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.45"
                        />
                      </svg>
                    </div>

                    {/* Clean Artisan Card */}
                    <div
                      className="w-full h-full rounded-xl shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
                      style={{
                        backgroundColor: offer.bg_color,
                        border: `1px solid ${offer.pin_color}30`,
                      }}
                    >
                      {/* Soft lighting & texture instead of harsh ledger lines */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 to-transparent mix-blend-overlay" />
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_24px_rgba(0,0,0,0.04)]" />

                      <div className="p-4 flex-1 relative z-10 flex flex-col">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3 shrink-0">
                          <div className="relative">
                            {/* Artistic background brush stroke effect */}
                            <div
                              className="absolute inset-0 opacity-20 rounded-lg transform -rotate-2"
                              style={{ backgroundColor: offer.pin_color }}
                            />
                            <h3
                              className="relative z-10 font-bold uppercase tracking-widest text-[11px] px-3 py-1.5"
                              style={{
                                color: offer.pin_color,
                                fontFamily: "var(--font-sans)",
                              }}
                            >
                              {offer.type}
                            </h3>
                          </div>

                          <div className="relative w-9 h-9 flex items-center justify-center">
                            {/* Stamp circle effect */}
                            <div
                              className="absolute inset-0 border-[1.5px] border-dashed rounded-full opacity-40"
                              style={{
                                borderColor: offer.pin_color,
                                transform: `rotate(${i * 15}deg)`,
                              }}
                            />
                            <div className="absolute inset-[3px] bg-white/50 rounded-full" />
                            <Icon
                              size={16}
                              strokeWidth={2}
                              style={{ color: offer.pin_color }}
                              className="relative z-10"
                            />
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide mb-1">
                          <p
                            className="font-serif italic leading-relaxed text-[13.5px] sm:text-[14px] drop-shadow-sm"
                            style={{ color: "#4a3320" }}
                          >
                            {offer.text}
                          </p>
                        </div>

                        {/* Tear-off Coupon Code */}
                        {offer.code && (
                          <div className="mt-auto shrink-0 relative pt-2 group/coupon coupon-group">
                            {/* Scissor and dashed cut line */}
                            <div
                              className="absolute left-0 top-0 flex items-center w-full opacity-60"
                              style={{ color: offer.pin_color }}
                            >
                              <div
                                className="absolute left-1 transition-all duration-[1500ms] ease-in-out group-hover/coupon:left-[calc(100%-24px)] z-10 px-1"
                                style={{ backgroundColor: offer.bg_color }}
                              >
                                <Scissors
                                  size={14}
                                  className="scissor-icon shrink-0"
                                />
                              </div>
                              <div
                                className="w-full border-t-2 border-dashed"
                                style={{ borderColor: offer.pin_color }}
                              />
                            </div>

                            <button
                              onClick={() => handleCopy(offer.code, offer.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 sm:py-2 rounded transition-all active:scale-95 group/btn"
                              style={{
                                backgroundColor: `${offer.pin_color}15`,
                                color: offer.pin_color,
                                border: `1px dashed ${offer.pin_color}40`,
                              }}
                            >
                              <span className="font-bold font-mono tracking-wider text-[13px]">
                                {copiedId === offer.id ? "COPIED!" : offer.code}
                              </span>
                              {copiedId === offer.id ? (
                                <Check size={15} />
                              ) : (
                                <Copy
                                  size={14}
                                  className="opacity-60 group-hover/btn:opacity-100 transition-opacity"
                                />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Indicator */}
            <div className="flex items-center justify-center gap-2 mt-2 pb-4 lg:pb-0">
              {offers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToOffer(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-coral-500 dark:bg-amber-400"
                      : "w-2 bg-cream-300 dark:bg-amber-900/50 hover:bg-brown-300 dark:hover:bg-amber-700"
                  }`}
                  aria-label={`Go to offer ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
