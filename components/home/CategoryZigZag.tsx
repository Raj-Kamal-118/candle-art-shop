"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
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
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          boxShadow: isLeft
            ? "inset -40px 0 50px -20px rgba(0,0,0,0.45), inset 3px 0 10px -5px rgba(255,255,255,0.6)"
            : "inset 40px 0 50px -20px rgba(0,0,0,0.45), inset -3px 0 10px -5px rgba(255,255,255,0.6)",
        }}
      />

      {/* Album Page Content */}
      <div className="absolute inset-0 flex flex-col">
        {isLeft ? (
          // LEFT PAGE: Editorial Framed Layout
          <div className="w-full h-full flex flex-col p-6 sm:p-8 pb-14">
            <div className="w-full flex-[1.4] relative overflow-hidden rounded-sm border border-cream-200 dark:border-amber-900/50 shadow-inner mb-6">
              {item.url ? (
                <>
                  <Image
                    src={item.url}
                    alt={alt}
                    fill
                    sizes="(max-width: 650px) 100vw, 650px"
                    className="object-cover pointer-events-none"
                  />
                </>
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
                  className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-md shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 z-20"
                >
                  View details <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          // RIGHT PAGE: Full Bleed Editorial
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
      </div>

      {/* Page number & Navigation Hints */}
      <div
        className={`absolute bottom-3 ${
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
  // Ensure we have an even number of pages for the flipbook, minimum 6
  const baseLength = Math.max(6, items.length);
  const totalPages = baseLength % 2 === 0 ? baseLength : baseLength + 1;

  const stack = Array.from(
    { length: totalPages },
    (_, i) => items[i % items.length] || { url: "", name: "", link: "" },
  );

  return (
    <div className="relative w-full flex justify-center group cursor-grab active:cursor-grabbing">
      <div className="w-full max-w-[800px]">
        <HTMLFlipBook
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

      {/* Hint Badge */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md text-xs font-semibold px-4 py-2 rounded-full shadow-md transition-all group-hover:scale-105 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/40 pointer-events-none"
        style={{
          background: "var(--home-bg)",
          color: "var(--home-amber)",
          border: "1px solid var(--home-border)",
        }}
      >
        Drag to turn page
      </div>
    </div>
  );
}
