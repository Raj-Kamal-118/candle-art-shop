"use client";

import { useState, useMemo } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import PrimarySectionHeader from "@/components/ui/PrimarySectionHeader";
import Tape from "@/components/craft/Tape";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Gift,
  HandHeart,
  Leaf,
  PackageOpen,
  Palette,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { useCategoryData } from "./CategoryProvider";

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

const TRUST_PILLARS = [
  {
    icon: HandHeart,
    title: "Hand-crafted every piece",
    body: "Each item is made in small batches in our studio — never mass-produced.",
  },
  {
    icon: Leaf,
    title: "Natural materials only",
    body: "Soy wax, cotton wicks, certified fragrance oils. We read every label.",
  },
  {
    icon: PackageOpen,
    title: "Gift-ready packaging",
    body: "Tissue, twine, and a handwritten note — ready to give the moment it arrives.",
  },
];

type CategorySlide = { url: string; name?: string; link?: string };

const POLAROID_TAPE_COLORS: import("@/components/craft/Tape").TapeColor[] = [
  "mint",
  "pink",
  "blue",
  "lavender",
  "kraft",
];

function PolaroidCategoryCard({
  category,
  rotate,
  delay,
  index,
}: {
  category: import("@/lib/types").Category;
  rotate: number;
  delay: number;
  index: number;
}) {
  const slides: CategorySlide[] = category.magazineItems?.filter((m) => m.url)
    .length
    ? category
        .magazineItems!.filter((m) => m.url)
        .map((m) => ({ url: m.url, name: m.name, link: m.link }))
    : [{ url: category.image, name: category.name }];

  const [idx, setIdx] = useState(0);
  const current = slides[idx];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + slides.length) % slides.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % slides.length);
  };

  const shopHref = current.link || `/categories/${category.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, rotate: rotate * 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className="relative flex flex-col items-center"
      style={{ transformOrigin: "center bottom" }}
    >
      {/* Tape */}
      <Tape
        color={POLAROID_TAPE_COLORS[index % POLAROID_TAPE_COLORS.length]}
        width={120}
        height={30}
        rotate={rotate > 0 ? 3 : -3}
        className="left-1/2 -translate-x-1/2 -top-4 z-10"
      />

      {/* Polaroid frame */}
      <div
        className="bg-white dark:bg-[#f5efe3] w-full flex flex-col"
        style={{
          padding: "10px 10px 0",
          boxShadow:
            "0 8px 32px rgba(28,18,9,0.18), 0 2px 6px rgba(28,18,9,0.1)",
          borderRadius: 2,
        }}
      >
        {/* Image area */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4" }}
        >
          {current.url && (
            <Image
              src={current.url}
              alt={current.name || category.name}
              fill
              sizes="(max-width:768px) 90vw, 33vw"
              className="object-cover transition-all duration-500"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Prev / Next — only when multiple slides */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  boxShadow: "0 2px 8px rgba(28,18,9,0.18)",
                  border: "1px solid rgba(28,18,9,0.08)",
                }}
              >
                <ChevronLeft size={15} style={{ color: "var(--home-text)" }} />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  boxShadow: "0 2px 8px rgba(28,18,9,0.18)",
                  border: "1px solid rgba(28,18,9,0.08)",
                }}
              >
                <ChevronRight size={15} style={{ color: "var(--home-text)" }} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === idx ? 14 : 5,
                      height: 5,
                      background:
                        i === idx
                          ? "var(--home-coral)"
                          : "rgba(255,255,255,0.65)",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Caption strip */}
        <div className="py-3 px-1 flex flex-col items-center gap-0.5 min-h-[64px] justify-center">
          <p
            className="text-brown-900 text-center leading-tight"
            style={{ fontFamily: "var(--font-script)", fontSize: 22 }}
          >
            {category.name}
          </p>
          {current.name && current.name !== category.name && (
            <p className="font-serif italic text-[11px] text-brown-500 text-center truncate max-w-full px-1">
              {current.name}
            </p>
          )}
          {category.productCount > 0 && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brown-400 mt-0.5">
              {category.productCount} pieces
            </p>
          )}
        </div>
      </div>

      {/* CTA row */}
      <div className="flex gap-2 mt-3 w-full">
        <Link
          href={`/categories/${category.slug}`}
          className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 font-serif italic"
          style={{
            border: "1.5px solid var(--home-coral)",
            color: "var(--home-coral)",
            background: "transparent",
          }}
        >
          Browse Collection
        </Link>
        <Link
          href={shopHref}
          className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-200"
          style={{
            background: "var(--home-coral)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(196,86,74,0.30)",
          }}
        >
          Shop this piece →
        </Link>
      </div>
    </motion.div>
  );
}

function StudioCarousel({
  relatedCategories,
}: {
  relatedCategories: import("@/lib/types").Category[];
}) {
  const rotations = [-2, 1.5, -1];

  return (
    <section
      className="bg-[var(--home-bg)] dark:bg-[#100e0a]"
      style={{ borderTop: "1px solid var(--home-border)", padding: "80px 0" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <PrimarySectionHeader
            eyebrow="✦ Keep exploring ✦"
            titlePrefix="More from"
            titleHighlighted="our studio"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12 items-end">
          {relatedCategories.slice(0, 3).map((cat, i) => (
            <PolaroidCategoryCard
              key={cat.slug}
              category={cat}
              rotate={rotations[i % rotations.length]}
              delay={i * 0.12}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CategoryPage() {
  const { category, products, allCategories } = useCategoryData();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-40 text-center">
        <p className="text-brown-500 text-lg">Category not found.</p>
      </div>
    );
  }

  const slug = category.slug;

  const displayTitle = category.bannerTitle || category.name || "";
  const titleWords = displayTitle.trim().split(" ");
  const lastWord = titleWords.pop();
  const firstPart = titleWords.length > 0 ? titleWords.join(" ") + " " : "";

  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let list = activeTag
      ? products.filter((p) => p.tags?.includes(activeTag))
      : [...products];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [products, activeTag, sort]);

  const relatedCategories = allCategories
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  const isCustomSlug = slug === "scented-candles" || slug === "fridge-magnets";
  const customCardHref =
    slug === "scented-candles" ? "/custom/candle" : "/custom/magnet";
  const customCardTitle =
    slug === "scented-candles"
      ? "Want something truly yours?"
      : "Have a design in mind?";
  const customCardDesc =
    slug === "scented-candles"
      ? "Design a custom candle — pick your wax, wick, vessel, and signature scent."
      : "Submit your sketch or photo, and we'll hand-paint a custom magnet.";
  const customCardCta =
    slug === "scented-candles"
      ? "Design Custom Candle"
      : "Create Custom Magnet";
  const customCardCaption =
    slug === "scented-candles" ? "make it yours" : "your design";

  const customCard = isCustomSlug ? (
    viewMode === "list" ? (
      /* ── List variant ── */
      <Link href={customCardHref} className="group cursor-pointer">
        <div
          className="craft-polaroid hover:bg-amber-50/60 dark:hover:bg-amber-900/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-4"
          style={{ padding: 14 }}
        >
          <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden bg-amber-50 dark:bg-amber-900/20">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                <Sparkles size={22} />
              </div>
              <p
                className="text-brown-600"
                style={{ fontFamily: "var(--font-script)", fontSize: 18 }}
              >
                {customCardCaption}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 py-2 pr-2">
            <p className="text-xs text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wide mb-1.5">
              Customizable
            </p>
            <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-brown-900 dark:text-amber-50 leading-tight mb-2">
              {customCardTitle}
            </h3>
            <p className="hidden sm:block text-sm text-brown-500 dark:text-amber-100/60 font-serif italic mb-4">
              {customCardDesc}
            </p>
            <div className="mt-auto pt-2">
              <span className="inline-flex items-center gap-1.5 bg-coral-600 group-hover:bg-coral-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                <Sparkles size={13} />
                {customCardCta}
              </span>
            </div>
          </div>
        </div>
      </Link>
    ) : (
      /* ── Grid variant (original polaroid) ── */
      <Link
        href={customCardHref}
        className="group relative flex flex-col cursor-pointer overflow-visible"
      >
        <Tape
          color="amber"
          width={90}
          height={22}
          rotate={-3}
          className="left-1/2 -translate-x-1/2 -top-3 z-10"
        />
        <div
          className="bg-white dark:bg-[#f5f0e8] rounded-sm shadow-[0_6px_24px_rgba(28,18,9,0.14)] hover:shadow-[0_12px_40px_rgba(28,18,9,0.22)] transition-all duration-300 group-hover:-translate-y-1 flex flex-col"
          style={{ padding: "10px 10px 0" }}
        >
          <div className="relative aspect-square flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-amber-50">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2 leading-tight">
                {customCardTitle}
              </h3>
              <p className="text-xs sm:text-sm text-brown-600">
                {customCardDesc}
              </p>
            </div>
          </div>
          <div className="py-3 flex items-center justify-center gap-1.5">
            <Sparkles size={13} className="text-amber-500 shrink-0" />
            <p
              className="text-brown-700 text-center"
              style={{
                fontFamily: "var(--font-script)",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              {customCardCaption}
            </p>
            <Sparkles size={13} className="text-amber-500 shrink-0" />
          </div>
        </div>
        <div className="mt-2 mx-1 bg-coral-600 group-hover:bg-coral-700 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm gap-2">
          <Sparkles size={14} />
          {customCardCta}
        </div>
      </Link>
    )
  ) : null;

  const giftSetCard =
    viewMode === "list" ? (
      /* ── List variant ── */
      <Link href="/custom/gift-set" className="group cursor-pointer">
        <div
          className="craft-polaroid hover:bg-forest-50/40 dark:hover:bg-forest-900/20 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-4"
          style={{ padding: 14 }}
        >
          <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden bg-forest-50/60 dark:bg-forest-50/30">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-100/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-forest-600 shadow-sm group-hover:scale-110 transition-transform">
                <Gift size={22} />
              </div>
              <p
                className="text-brown-600"
                style={{ fontFamily: "var(--font-script)", fontSize: 18 }}
              >
                make it a gift
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 py-2 pr-2">
            <p className="text-xs text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wide mb-1.5">
              Gift Wrapping
            </p>
            <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-brown-900 dark:text-amber-50 leading-tight mb-2">
              Make it a Gift
            </h3>
            <p className="hidden sm:block text-sm text-brown-500 dark:text-amber-100/60 font-serif italic mb-4">
              Send items beautifully gift-wrapped to someone special with a
              personalised handwritten note.
            </p>
            <div className="mt-auto pt-2">
              <span className="inline-flex items-center gap-1.5 bg-coral-600 group-hover:bg-coral-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                <Gift size={13} />
                Build a Gift Set
              </span>
            </div>
          </div>
        </div>
      </Link>
    ) : (
      /* ── Grid variant (original polaroid) ── */
      <Link
        href="/custom/gift-set"
        className="group relative flex flex-col cursor-pointer overflow-visible"
      >
        {/* Tape */}
        <Tape
          color="mint"
          width={90}
          height={22}
          rotate={4}
          className="left-1/2 -translate-x-1/2 -top-3 z-10"
        />
        {/* Polaroid frame */}
        <div
          className="bg-white dark:bg-[#f5f0e8] rounded-sm shadow-[0_6px_24px_rgba(28,18,9,0.14)] hover:shadow-[0_12px_40px_rgba(28,18,9,0.22)] transition-all duration-300 group-hover:-translate-y-1 flex flex-col"
          style={{ padding: "10px 10px 0" }}
        >
          {/* Photo area */}
          <div className="relative aspect-square flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-forest-50/60 dark:bg-forest-50/40">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-100/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-forest-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Gift size={24} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2 leading-tight">
                Make it a Gift
              </h3>
              <p className="text-xs sm:text-sm text-brown-600">
                Send items beautifully gift-wrapped to someone special with a
                personalised handwritten note.
              </p>
            </div>
          </div>
          {/* Caption strip */}
          <div className="py-3 flex items-center justify-center gap-1.5">
            <Gift size={13} className="text-forest-600 shrink-0" />
            <p
              className="text-brown-700 text-center"
              style={{
                fontFamily: "var(--font-script)",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              make it a gift
            </p>
            <Gift size={13} className="text-forest-600 shrink-0" />
          </div>
        </div>
        {/* CTA */}
        <div className="mt-2 mx-1 bg-coral-600 group-hover:bg-coral-700 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm gap-2">
          <Gift size={14} />
          Build a Gift Set
        </div>
      </Link>
    );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: `https://www.artisanhouse.in/categories/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.artisanhouse.in/products/${p.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative p-8 border-b border-cream-200 dark:border-amber-900/20 overflow-hidden flex items-center justify-center">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            quality={80}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 w-full text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl flex flex-col items-start"
          >
            <p className="text-[14px] font-semibold text-amber-400 uppercase tracking-[0.24em] mb-5 drop-shadow-sm">
              ✦ {category.name} Collection ✦
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 drop-shadow-md">
              {firstPart}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  className="dark:candle-text-glow"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontStyle: "normal",
                    color: "var(--home-coral)",
                    fontWeight: 700,
                    fontSize: "1.08em",
                  }}
                >
                  {lastWord}
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
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.65,
                maxWidth: 520,
              }}
              className="drop-shadow-sm"
            >
              {category.bannerDescription || category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Crafty Filter + Sort Bar ─────────────────────────── */}
      <section
        className="sticky top-0 z-20 overflow-hidden"
        style={{
          background: "var(--home-bg)",
          borderBottom: "1px solid var(--home-border)",
        }}
      >
        {/* Kraft paper grain */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(120,80,40,0.3) 3px, rgba(120,80,40,0.3) 4px)",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-3">
          {/* ── Top row: Filter label & Tags ── */}
          <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1 overflow-hidden">
            {/* ── Filter label ── */}
            <span
              className="hidden lg:block text-xs font-bold uppercase tracking-[0.22em] shrink-0 pr-3"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--home-amber)",
                borderRight: "1.5px dashed var(--home-border)",
              }}
            >
              Filter
            </span>

            {/* ── Tag chips ── */}
            <div className="flex items-center gap-2 flex-nowrap lg:flex-wrap overflow-x-auto scrollbar-hide py-2 lg:py-0 w-full px-1 -mx-1 lg:px-0 lg:mx-0">
              {["All", ...allTags].map((tag, i) => {
                const isActive =
                  tag === "All" ? activeTag === null : activeTag === tag;
                const chipBg =
                  i % 3 === 0
                    ? "rgba(167,243,208,0.45)"
                    : i % 3 === 1
                      ? "rgba(221,214,254,0.5)"
                      : "rgba(186,230,253,0.45)";
                return (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTag(
                        tag === "All" ? null : activeTag === tag ? null : tag,
                      )
                    }
                    className="relative px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-200 whitespace-nowrap shrink-0"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      background: isActive ? "var(--home-coral)" : chipBg,
                      color: isActive ? "#fff" : "var(--home-text)",
                      borderRadius: 4,
                      boxShadow: isActive
                        ? "0 2px 10px rgba(196,86,74,0.35)"
                        : "1px 2px 4px rgba(28,18,9,0.09)",
                      transform: isActive
                        ? "scale(1.07) rotate(0deg)"
                        : `rotate(${i % 2 === 0 ? -0.7 : 0.7}deg)`,
                      border: isActive
                        ? "1px solid rgba(196,86,74,0.4)"
                        : "1px solid rgba(28,18,9,0.07)",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom row: Sort & View Mode ── */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            {/* ── Sort pills ── */}
            <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-hide py-2 lg:py-0 lg:px-3 lg:border-l-[1.5px] border-dashed border-[color:var(--home-border)]">
              <span
                className="hidden lg:block text-xs font-bold uppercase tracking-[0.22em] mr-2"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--home-amber)",
                }}
              >
                Sort
              </span>
              {(
                [
                  { value: "featured", label: "Featured" },
                  { value: "price-asc", label: "Price ↑" },
                  { value: "price-desc", label: "Price ↓" },
                  { value: "name", label: "A–Z" },
                ] as { value: SortOption; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className="px-3 py-1.5 text-sm font-semibold rounded transition-all duration-150 whitespace-nowrap shrink-0"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    background:
                      sort === opt.value ? "var(--home-text)" : "transparent",
                    color:
                      sort === opt.value
                        ? "var(--home-bg)"
                        : "var(--home-muted)",
                    border:
                      sort === opt.value
                        ? "1px solid var(--home-text)"
                        : "1px dashed var(--home-border)",
                    transform: `rotate(${opt.value === "name" ? 0.5 : -0.5}deg)`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* ── View mode toggle ── */}
            <div className="flex items-center gap-1 shrink-0 pl-3 border-l-[1.5px] border-dashed border-[color:var(--home-border)]">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className="p-2 rounded transition-all duration-150"
                style={{
                  background:
                    viewMode === "grid" ? "var(--home-coral)" : "transparent",
                  color: viewMode === "grid" ? "#fff" : "var(--home-muted)",
                  border:
                    viewMode === "grid"
                      ? "1px solid var(--home-coral)"
                      : "1px dashed var(--home-border)",
                }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="Detail view"
                className="p-2 rounded transition-all duration-150"
                style={{
                  background:
                    viewMode === "list" ? "var(--home-coral)" : "transparent",
                  color: viewMode === "list" ? "#fff" : "var(--home-muted)",
                  border:
                    viewMode === "list"
                      ? "1px solid var(--home-coral)"
                      : "1px dashed var(--home-border)",
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ─────────────────────────────────────── */}
      <section className="py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--home-muted)",
              }}
            >
              {filteredAndSorted.length} crafted piece
              {filteredAndSorted.length !== 1 ? "s" : ""}
              {activeTag && (
                <span className="ml-1 text-coral-600 dark:text-coral-500">
                  · {activeTag}
                </span>
              )}
            </p>
          </div>

          <ProductGrid
            products={filteredAndSorted}
            emptyMessage={`No products in ${category.name} yet.`}
            customCard={customCard}
            customCardEnd={giftSetCard}
            viewMode={viewMode}
          />
        </div>
      </section>

      {/* ── About This Collection ─────────────────────────────── */}
      {category.description && (
        <section
          className="bg-[var(--home-bg)] dark:bg-[#100e0a]"
          style={{
            borderTop: "1px solid var(--home-border)",
            padding: "80px 0",
          }}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <PrimarySectionHeader
                eyebrow="✦ About this collection ✦"
                titlePrefix="What makes"
                titleHighlighted={category.name}
                titleSuffix="special"
                align="left"
                className="mb-8"
              />
              <div
                className="prose prose-brown dark:prose-invert prose-lg font-serif leading-relaxed max-w-none"
                style={{ color: "var(--home-muted)" }}
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Why Artisan House ─────────────────────────────────── */}
      <section
        className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612]"
        style={{
          borderTop: "1px solid var(--home-border)",
          padding: "80px 0",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <PrimarySectionHeader
              eyebrow="✦ Why Artisan House ✦"
              titlePrefix="Made with"
              titleHighlighted="intention"
              description="Everything we put out reflects what we believe in. No shortcuts."
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TRUST_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl"
                  style={{
                    background: "var(--home-card)",
                    border: "1px solid var(--home-border)",
                    boxShadow: "0 4px 16px rgba(28,18,9,0.05)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: "var(--home-accent)",
                      border: "1px solid var(--home-border)",
                    }}
                  >
                    <Icon size={22} style={{ color: "var(--home-coral)" }} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-50 mb-2">
                    {pillar.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed font-serif italic"
                    style={{ color: "var(--home-muted)" }}
                  >
                    {pillar.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Explore More Categories ───────────────────────────── */}
      {relatedCategories.length > 0 && (
        <StudioCarousel relatedCategories={relatedCategories} />
      )}
    </div>
  );
}
