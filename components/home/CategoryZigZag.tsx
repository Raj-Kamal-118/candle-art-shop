"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Category, Product, MagazineItem } from "@/lib/types";

// Dynamically import react-pageflip to avoid SSR 'window is not defined' errors
const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as any;

interface CategoryZigZagProps {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}

export default function CategoryZigZag({
  categories,
  productsByCategory,
}: CategoryZigZagProps) {
  const visible = categories.filter((c) => c.showInHomepage !== false);
  if (visible.length === 0) return null;

  return (
    <section
      className="bg-[var(--home-bg)] dark:bg-[#100e0a] overflow-hidden"
      style={{
        borderTop: "1px solid var(--home-border)",
        padding: "80px 0 40px",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: "var(--home-amber)",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            ✦ What we make ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 60px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 16px",
              lineHeight: 1.0,
            }}
          >
            Everything we{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow leading"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.08em",
                }}
              >
                love making
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
                  stroke="var(--home-coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--home-muted)",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Each made in small batches. When a batch sells out, we make another.
          </p>
        </motion.div>

        {/* Zig-zag rows */}
        <div>
          {visible.map((cat, idx) => {
            const catProducts = productsByCategory[cat.id] || [];
            const imageLeft = idx % 2 === 0;
            const ghostNum = String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                style={{
                  borderBottom:
                    idx < visible.length - 1
                      ? "1px dashed var(--home-border)"
                      : "none",
                  padding: "64px 0",
                }}
              >
                <div
                  className={`flex flex-col gap-10 items-center ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Image Stack */}
                  <div className="w-full lg:w-3/5 flex justify-center">
                    <PhotoStack
                      items={
                        cat.magazineItems?.length
                          ? cat.magazineItems
                          : (cat.bannerImage || cat.image || "")
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((url) => ({ url, name: "", link: "" }))
                      }
                      alt={cat.name}
                    />
                  </div>

                  {/* Text */}
                  <div
                    className="w-full lg:w-2/5"
                    style={{ position: "relative" }}
                  >
                    {/* Ghost number */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: imageLeft ? -48 : -32,
                        right: imageLeft ? 0 : -32,
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(80px, 14vw, 120px)",
                        fontWeight: 900,
                        color: "var(--home-ghost)",
                        lineHeight: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    >
                      {ghostNum}
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p
                        style={{
                          fontSize: 11,
                          letterSpacing: ".24em",
                          textTransform: "uppercase",
                          color: "var(--home-amber)",
                          fontWeight: 600,
                          marginBottom: 12,
                        }}
                      >
                        {cat.name}
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(32px, 4vw, 48px)",
                          fontWeight: 800,
                          color: "var(--home-text)",
                          lineHeight: 1.1,
                          marginBottom: 16,
                          letterSpacing: "normal",
                        }}
                      >
                        {cat.bannerTitle || cat.name}
                      </h3>
                      {cat.description && (
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
                          {cat.description}
                        </p>
                      )}

                      <div className="flex flex-col items-start gap-5">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "var(--home-accent)",
                            color: "var(--home-muted)",
                            borderRadius: 999,
                            padding: "7px 16px",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {catProducts.length} product
                          {catProducts.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {(cat.bannerButtons || []).length > 0 ? (
                            cat.bannerButtons!.map((btn, bi) => (
                              <Link
                                key={bi}
                                href={btn.link}
                                className={
                                  btn.variant === "primary"
                                    ? "inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
                                    : "inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
                                }
                              >
                                {btn.text}
                              </Link>
                            ))
                          ) : (
                            <Link
                              href={`/categories/${cat.slug}`}
                              className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
                            >
                              Shop {cat.name} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const AlbumPage = React.forwardRef<
  HTMLDivElement,
  { item: MagazineItem; alt: string; index: number; totalPages: number }
>(({ item, alt, index, totalPages }, ref) => {
  // In a 2-page spread, even indexes are left pages, odd are right pages
  const isLeft = index % 2 === 0;
  const isLastPage = index === totalPages - 1;

  // 6 Distinct Layouts & Dynamic Badges
  const layoutType = index % 6;
  const showBadge10 = index % 6 === 1;
  const showBadgeShipping = index % 6 === 3;
  const showBadgeLimited = index % 6 === 5;

  // Dynamic labels for layout 3
  const editorialLabels = [
    "Exclusive",
    "Trending Now",
    "Editor's Pick",
    "Just Arrived",
  ];
  const dynamicEditorialLabel = editorialLabels[index % editorialLabels.length];

  return (
    <div
      ref={ref}
      className={`w-full h-full overflow-hidden border border-cream-300 dark:border-amber-900/40 shadow-sm relative bg-[#faf6eb] dark:bg-[#2e2823] ${isLeft ? "rounded-l-md" : "rounded-r-md"}`}
      style={{
        backgroundImage: isLeft
          ? "linear-gradient(to right, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 10%, rgba(255,255,255,0.25) 80%, rgba(0,0,0,0.25) 100%), url('https://www.transparenttextures.com/patterns/cream-paper.png')"
          : "linear-gradient(to left, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 10%, rgba(255,255,255,0.25) 80%, rgba(0,0,0,0.25) 100%), url('https://www.transparenttextures.com/patterns/cream-paper.png')",
      }}
    >
      {/* Spine shadow for realistic open book look */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          boxShadow: isLeft
            ? "inset -40px 0 50px -20px rgba(0,0,0,0.45), inset 3px 0 10px -5px rgba(255,255,255,0.6)"
            : "inset 40px 0 50px -20px rgba(0,0,0,0.45), inset -3px 0 10px -5px rgba(255,255,255,0.6)",
        }}
      />

      {/* Badges Overlay */}
      {showBadge10 && (
        <div
          className={`absolute top-8 ${isLeft ? "left-0 rounded-r-md" : "right-0 rounded-l-md"} bg-coral-600 text-white text-[10px] font-bold px-3 py-1.5 shadow-md z-30 uppercase tracking-wider pointer-events-none`}
        >
          10% OFF
        </div>
      )}
      {showBadgeShipping && (
        <div
          className={`absolute top-8 ${isLeft ? "left-0 rounded-r-md" : "right-0 rounded-l-md"} bg-forest-800 text-amber-200 text-[10px] font-bold px-3 py-1.5 shadow-md z-30 uppercase tracking-wider pointer-events-none`}
        >
          Free Shipping
        </div>
      )}
      {showBadgeLimited && (
        <div
          className={`absolute top-8 ${isLeft ? "left-0 rounded-r-md" : "right-0 rounded-l-md"} bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 shadow-md z-30 uppercase tracking-wider pointer-events-none`}
        >
          Limited Edition
        </div>
      )}

      {/* Album Page Content */}
      <div className="absolute inset-0 flex flex-col z-20">
        {layoutType === 0 && (
          // LAYOUT 0 (Left): Editorial Framed Layout
          <div className="w-full h-full flex flex-col p-6 sm:p-8 pb-14">
            <div className="w-full flex-[1.4] relative overflow-hidden rounded-sm border border-cream-200 dark:border-amber-900/50 shadow-inner mb-6">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#fdfbf7] dark:bg-black/40">
                  <span style={{ fontSize: 40 }}>🕯️</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-brown-500 dark:text-amber-100/50 mb-3 font-semibold">
                Curated Piece
              </span>
              {item.name && (
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 dark:text-amber-100 line-clamp-2 mb-4 leading-tight">
                  {item.name}
                </h4>
              )}
              <div className="w-8 h-px bg-amber-600/30 dark:bg-amber-400/30 mb-5" />
              {item.link && (
                <Link
                  href={item.link}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-lg hover:-translate-y-0.5 z-20"
                >
                  View details <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
        {layoutType === 1 && (
          // LAYOUT 1 (Right): Full Bleed Editorial
          <div className="w-full h-full p-4 pb-14">
            <div className="relative w-full h-full overflow-hidden rounded-sm shadow-inner border border-cream-200 dark:border-amber-900/50">
              {item.url ? (
                <>
                  <Image
                    src={item.url}
                    alt={alt}
                    fill
                    sizes="(max-width: 650px) 100vw, 650px"
                    className="object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#fdfbf7] dark:bg-black/40">
                  <span style={{ fontSize: 60 }}>🕯️</span>
                </div>
              )}
              <div className="absolute bottom-8 left-6 right-6 z-20 flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-amber-200/90 mb-2 font-semibold">
                  Editorial Pick
                </span>
                {item.name && (
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white line-clamp-2 mb-5 leading-tight drop-shadow-md">
                    {item.name}
                  </h4>
                )}
                {item.link && (
                  <Link
                    href={item.link}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-lg hover:-translate-y-0.5 z-20"
                  >
                    Shop this piece <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        {layoutType === 2 && (
          // LAYOUT 2 (Left): Text Top, Arch Image Bottom
          <div className="w-full h-full flex flex-col p-6 sm:p-8 pb-14 bg-amber-50/40 dark:bg-amber-900/10">
            <div className="flex-[0.8] flex flex-col justify-start items-center text-center pt-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 mb-3 font-semibold">
                In Focus
              </span>
              {item.name && (
                <h4 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 line-clamp-3 mb-4 leading-tight italic">
                  {item.name}
                </h4>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-amber-800 dark:text-amber-300 font-semibold text-xs hover:text-coral-600 transition-all z-20 uppercase tracking-widest border-b border-amber-800 dark:border-amber-300 pb-0.5"
                >
                  Discover <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div className="w-full flex-[1.2] relative overflow-hidden rounded-t-full border-t-4 border-x-4 border-white dark:border-[#1a1830] shadow-xl mt-4 bg-cream-100 dark:bg-amber-900/20">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🕯️
                </div>
              )}
            </div>
          </div>
        )}
        {layoutType === 3 && (
          // LAYOUT 3 (Right): Split Editorial
          <div className="w-full h-full flex flex-col pb-14">
            <div className="w-full h-[65%] relative overflow-hidden border-b border-cream-200 dark:border-amber-900/50">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-cream-100 dark:bg-black/40">
                  🕯️
                </div>
              )}
            </div>
            <div className="w-full h-[35%] flex flex-col items-center justify-center px-8 text-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-brown-500 dark:text-amber-100/50 mb-3 font-semibold block">
                {dynamicEditorialLabel}
              </span>
              {item.name && (
                <h4 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 line-clamp-2 mb-4 leading-tight">
                  {item.name}
                </h4>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-lg hover:-translate-y-0.5 z-20"
                >
                  Explore <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
        {layoutType === 4 && (
          // LAYOUT 4 (Left): Image Top, Minimal Typography Bottom
          <div className="w-full h-full flex flex-col pb-14">
            <div className="w-full h-[60%] relative overflow-hidden shadow-sm border-b border-cream-200 dark:border-amber-900/50">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-cream-100 dark:bg-black/40">
                  🕯️
                </div>
              )}
            </div>
            <div className="w-full h-[40%] flex flex-col justify-center px-8 text-left">
              <div className="w-10 h-1 bg-amber-300 dark:bg-amber-600 mb-4" />
              {item.name && (
                <h4 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 line-clamp-2 mb-3 leading-snug">
                  {item.name}
                </h4>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-widest hover:text-amber-900 dark:hover:text-amber-100 transition-colors mt-2"
                >
                  Shop Collection <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
        {layoutType === 5 && (
          // LAYOUT 5 (Right): Center Circle Crop
          <div className="w-full h-full flex flex-col items-center justify-center p-8 pb-14 text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 relative overflow-hidden rounded-full shadow-lg border-4 border-white dark:border-[#1a1830] mb-8">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={alt}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  className="object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-cream-100 dark:bg-black/40">
                  🕯️
                </div>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-brown-500 dark:text-amber-100/50 mb-3 font-semibold border-y border-brown-300/40 dark:border-amber-900/40 py-1 px-4">
              Signature Edition
            </span>
            {item.name && (
              <h4 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 line-clamp-2 mb-5 leading-tight">
                {item.name}
              </h4>
            )}
            {item.link && (
              <Link
                href={item.link}
                onPointerDown={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-lg hover:-translate-y-0.5 z-20"
              >
                View Details <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Page number & Navigation Hints */}
      <div
        className={`absolute bottom-3 z-40 ${
          isLeft ? "left-5 flex-row" : "right-5 flex-row-reverse"
        } flex items-center gap-2 font-serif font-bold text-brown-400 dark:text-amber-100/50`}
      >
        <span
          className={index === 0 || isLastPage ? "text-[13px]" : "text-[11px]"}
        >
          {index + 1}
        </span>
        <span
          className={`opacity-60 uppercase tracking-widest flex items-center gap-1 font-sans ${index === 0 || isLastPage ? "text-[11px]" : "text-[9px]"}`}
        >
          {index === 0 ? (
            "— 1st Page"
          ) : index === totalPages - 1 ? (
            "Last Page —"
          ) : isLeft ? (
            <>
              <ArrowLeft size={10} /> Prev
            </>
          ) : (
            <>
              Next <ArrowRight size={10} />
            </>
          )}
        </span>
      </div>
    </div>
  );
});

AlbumPage.displayName = "AlbumPage";

function PhotoStack({ items, alt }: { items: MagazineItem[]; alt: string }) {
  const bookRef = React.useRef<any>(null);
  const [flipInstance, setFlipInstance] = React.useState<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const [hasInteracted, setHasInteracted] = React.useState(false);

  // Ensure we have an even number of pages for the flipbook, minimum 6
  const baseLength = Math.max(6, items.length);
  const totalPages = baseLength % 2 === 0 ? baseLength : baseLength + 1;

  const stack = Array.from(
    { length: totalPages },
    (_, i) => items[i % items.length] || { url: "", name: "", link: "" },
  );

  React.useEffect(() => {
    // Auto-play continuously until the user interacts
    if (!isInView || !flipInstance || hasInteracted) return;

    const timer = setTimeout(() => {
      if (typeof flipInstance.flipNext === "function") {
        if (currentPage >= totalPages - 2) {
          // Loop back to the beginning
          if (typeof flipInstance.turnToPage === "function") {
            flipInstance.turnToPage(0);
          }
        } else {
          flipInstance.flipNext();
        }
      }
    }, 3500); // 3.5 seconds per slide

    return () => clearTimeout(timer);
  }, [isInView, flipInstance, hasInteracted, currentPage, totalPages]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center group cursor-grab active:cursor-grabbing"
      onPointerDown={() => setHasInteracted(true)}
    >
      <div className="w-full max-w-[800px]">
        <HTMLFlipBook
          ref={bookRef}
          width={400}
          height={480}
          size="stretch"
          minWidth={300}
          maxWidth={400}
          minHeight={300}
          maxHeight={480}
          maxShadowOpacity={0.4}
          showCover={false}
          mobileScrollSupport={true}
          className="album-flipbook drop-shadow-2xl"
          onInit={(e: any) => {
            if (e && typeof e.flipNext === "function") {
              setFlipInstance(e);
            } else if (
              e &&
              e.object &&
              typeof e.object.flipNext === "function"
            ) {
              setFlipInstance(e.object);
            }
          }}
          onFlip={(e: any) => setCurrentPage(e.data)}
        >
          {stack.map((item, i) => (
            <AlbumPage
              key={i}
              item={item}
              alt={`${alt} ${i + 1}`}
              index={i}
              totalPages={totalPages}
            />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Navigation Pill */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md transition-all group-hover:bg-amber-50 dark:group-hover:bg-amber-900/40"
        style={{
          background: "var(--home-bg)",
          color: "var(--home-amber)",
          border: "1px solid var(--home-border)",
        }}
      >
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setHasInteracted(true);
            if (flipInstance && typeof flipInstance.flipPrev === "function") {
              flipInstance.flipPrev();
            } else if (
              bookRef.current &&
              typeof bookRef.current.pageFlip === "function"
            ) {
              const flip = bookRef.current.pageFlip();
              if (flip && typeof flip.flipPrev === "function") {
                flip.flipPrev();
              }
            }
          }}
          className="group/btn relative p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-full transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="text-xs font-semibold select-none">Flip pages</span>

        <button
          type="button"
          disabled={currentPage >= totalPages - 2}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setHasInteracted(true);
            if (flipInstance && typeof flipInstance.flipNext === "function") {
              flipInstance.flipNext();
            } else if (
              bookRef.current &&
              typeof bookRef.current.pageFlip === "function"
            ) {
              const flip = bookRef.current.pageFlip();
              if (flip && typeof flip.flipNext === "function") {
                flip.flipNext();
              }
            }
          }}
          className="group/btn relative p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-full transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
