"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  ArrowRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Flame,
  Leaf,
  Droplet,
  Clock,
  Sparkles,
  Package,
  Wind,
  Sun,
  Moon,
  Home,
  PenLine,
  Palette,
  MousePointerClick,
  Cake,
  GraduationCap,
  Gift,
  ChevronDown,
  MessageSquare,
  Quote,
  PartyPopper,
  Smile,
} from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice, getVariantPrice } from "@/lib/utils";
import { useProductData } from "./ProductProvider";
import Tape, { tapeForIndex } from "@/components/craft/Tape";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StickyNote from "@/components/ui/StickyNote";
import PostageStamp from "@/components/craft/PostageStamp";
import ProductCard from "@/components/products/ProductCard";
import Testimonials from "@/components/home/Testimonials";
import HandDrawnStars from "@/components/ui/HandDrawnStars";

const ICONS: Record<string, React.ElementType> = {
  flame: Flame,
  leaf: Leaf,
  droplet: Droplet,
  clock: Clock,
  sparkles: Sparkles,
  package: Package,
  wind: Wind,
  sun: Sun,
  moon: Moon,
  home: Home,
  heart: Heart,
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();
  const { product, category, reviews } = useProductData();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!product?.customizationOptions) return;
    setCustomizations((prev) => {
      const defaults: Record<string, string> = {};
      for (const opt of product.customizationOptions!) {
        if (opt.type === "select" && opt.options?.length && !prev[opt.label]) {
          defaults[opt.label] = opt.options[0];
        }
      }
      return Object.keys(defaults).length ? { ...defaults, ...prev } : prev;
    });
  }, [product]);
  const [addedToCart, setAddedToCart] = useState(false);

  // SVG highlighter with zigzag left/right edges — mimics a real marker stroke
  const markerHighlight =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 32' preserveAspectRatio='none'%3E%3Cpath d='M7,0 L0,4 L6,8 L0,13 L6,18 L0,23 L6,28 L7,32 L93,32 L94,28 L100,23 L94,18 L100,13 L94,8 L100,4 L93,0 Z' fill='rgba(255,221,0,0.58)'/%3E%3C/svg%3E\")";

  const handleAddToCart = () => {
    if (!product) return;
    const final = { ...customizations };
    if (product.customizable && product.customizationOptions) {
      product.customizationOptions.forEach((opt) => {
        if (!final[opt.label]) {
          if (opt.type === "color") final[opt.label] = "#d97706";
          else if (opt.type === "select" && opt.options?.length)
            final[opt.label] = opt.options[0];
          else if (opt.type === "text") final[opt.label] = "";
        }
      });
    }
    setCustomizations(final);
    addToCart(product, quantity, final);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleFavorite = () => {
    if (!product) return;
    if (isFavorite(product.id)) removeFromFavorites(product.id);
    else addToFavorites(product);
  };

  if (!product) {
    return (
      <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] max-w-[1440px] mx-auto px-4 py-20 text-center min-h-screen">
        <p className="text-brown-500 dark:text-amber-100/60 text-lg">
          Product not found.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-xl text-sm font-semibold text-brown-900 dark:text-amber-100 hover:border-amber-400"
        >
          Back to products
        </button>
      </div>
    );
  }

  const effectivePrice = getVariantPrice(product, customizations);
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null;
  const favorite = isFavorite(product.id);
  const chars = product.characteristics ?? [];
  const sections = product.additionalSections ?? [];
  const extras = product.extraButtons ?? [];

  return (
    <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/products" },
              ...(category
                ? [
                    {
                      label: category.name,
                      href: `/categories/${category.slug}`,
                    },
                  ]
                : []),
              { label: product.name },
            ]}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
          {/* ── Image column ── */}
          <div className="space-y-6 min-w-0 w-full lg:col-span-5">
            {/* Main polaroid frame */}
            <div className="relative mt-6">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="craft-polaroid mx-auto lg:mx-0"
                style={{ padding: "14px", maxWidth: 560 }}
              >
                {/* Top Right Diagonal Tape */}
                <Tape
                  color="amber"
                  width={140}
                  height={30}
                  rotate={45}
                  className="absolute -right-10 -top-0.5 z-20"
                />

                <div className="relative bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden w-full aspect-square group/main-img">
                  {product.images?.[selectedImage] ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[80px]">
                      🕯️
                    </div>
                  )}

                  {/* Image Navigation Buttons */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(
                            (prev) =>
                              (prev - 1 + product.images!.length) %
                              product.images!.length,
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-brown-900 rounded-full shadow-md backdrop-blur-sm transition-all z-20 opacity-0 group-hover/main-img:opacity-100"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(
                            (prev) => (prev + 1) % product.images!.length,
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-brown-900 rounded-full shadow-md backdrop-blur-sm transition-all z-20 opacity-0 group-hover/main-img:opacity-100"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Discount ribbon */}
                  {discount && (
                    <div className="absolute top-4 left-0 z-10">
                      <div
                        style={{
                          background: "#e85d4a",
                          color: "white",
                          fontFamily: "var(--font-hand)",
                          fontSize: 24,
                          letterSpacing: "0.08em",
                          fontWeight: 700,
                          padding: "6px 24px 6px 14px",
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                          lineHeight: 1.2,
                          boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        {discount}% off
                      </div>
                    </div>
                  )}

                  {/* Sold-out stamp */}
                  {!product.inStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/25 dark:bg-black/30 backdrop-blur-[1px]">
                      <div
                        style={{
                          border: "3px solid rgba(180,40,30,0.85)",
                          borderRadius: "50%",
                          padding: "10px 24px",
                          transform: "rotate(-15deg)",
                          color: "rgba(180,40,30,0.9)",
                          fontFamily: "var(--font-hand)",
                          fontSize: 24,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          background: "rgba(255,255,255,0.65)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Sold out
                      </div>
                    </div>
                  )}
                </div>
                {/* Polaroid caption */}
                <p
                  className="text-center text-brown-500 dark:text-amber-200/75 mt-3 px-2 leading-snug line-clamp-1"
                  style={{ fontFamily: "var(--font-hand)", fontSize: 32 }}
                >
                  {product.name}
                </p>
              </motion.div>
            </div>

            {/* Thumbnail strip — mini polaroids */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pt-4 pb-4 px-2 scrollbar-hide justify-center lg:justify-start">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="relative shrink-0 craft-polaroid transition-all duration-200 hover:-translate-y-1"
                    style={{
                      padding: "6px 6px 16px",
                      width: 80,
                      opacity: selectedImage === i ? 1 : 0.5,
                      transform:
                        selectedImage === i
                          ? `scale(1.1) rotate(${i % 2 === 0 ? -1 : 2}deg)`
                          : `rotate(${i % 2 === 0 ? -3 : 3}deg)`,
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    {/* Paperclip */}
                    <svg
                      width="14"
                      height="28"
                      viewBox="0 0 32 64"
                      fill="none"
                      className="absolute top-[-10px] left-3 z-10 drop-shadow-sm"
                      style={{
                        transform: `rotate(${[-12, 15, -8, 6, -15, 10][i % 6]}deg)`,
                      }}
                    >
                      <path
                        d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48 A 11 11 0 0 1 4 48 V 16"
                        stroke={
                          [
                            "#9ca3af",
                            "#d4b896",
                            "#e85d4a",
                            "#6b7280",
                            "#93c5fd",
                            "#a78bfa",
                          ][i % 6]
                        }
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="relative bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden"
                      style={{ width: 64, height: 64 }}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="66px"
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── Reviews — mobile only; tablet/desktop shown inline with price ── */}
            <div className="md:hidden mt-8 px-2 lg:px-4 xl:px-8">
              <div className="flex flex-col gap-2">
                {/* Stars row */}
                <div className="flex items-center gap-2.5">
                  <HandDrawnStars rating={4.0} size={22} />
                  <span
                    className="font-bold text-brown-700 dark:text-amber-200"
                    style={{ fontFamily: "var(--font-hand)", fontSize: 20 }}
                  >
                    4.0
                  </span>
                </div>
                {/* Count + link */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-brown-400 dark:text-amber-100/70"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 13,
                    }}
                  >
                    Based on 24 reviews
                  </span>
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-1 text-coral-600 dark:text-amber-400 hover:underline"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 12,
                    }}
                  >
                    Read all <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Left Column Fillers (Desktop only) ── */}
            <div className="hidden lg:flex flex-col gap-12 mt-16 px-4 xl:px-8">
              <StickyNote
                type="Maker's Note"
                text="Each piece is hand-poured and crafted in small batches in our Varanasi studio. We use 100% natural materials and premium phthalate-free fragrances for a clean, beautiful experience."
                isAbsolute={false}
                showPin={true}
                bgColor="#fef3c7"
                pinColor="#d97706"
                icon={
                  <Sparkles
                    size={16}
                    className="text-amber-600 drop-shadow-sm"
                  />
                }
                positionClass="w-full"
              />

              <StickyNote
                isAbsolute={false}
                showPin={true}
                bgColor="#f0fdf4"
                pinColor="#16a34a"
                positionClass="w-11/12 ml-auto"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Leaf
                    size={16}
                    className="text-green-600 shrink-0 drop-shadow-sm"
                  />
                  <div className="text-[10px] font-black tracking-[0.15em] uppercase text-green-900/60 dark:text-green-900/80 leading-tight">
                    Our Promise
                  </div>
                </div>
                <ul className="font-serif italic text-[14px] text-green-900 space-y-2 pl-4 list-disc marker:text-green-500">
                  <li>Sustainable materials sourced from local vendors.</li>
                  <li>Plastic-free packaging that's kind to the earth.</li>
                  <li>
                    Every purchase supports independent artisans in Varanasi.
                  </li>
                </ul>
              </StickyNote>
            </div>
          </div>

          {/* ── Details column ── */}
          <div className="lg:py-2 min-w-0 w-full lg:col-span-7">
            {/* ── Single Combined Notebook ── */}
            <div className="relative my-0 z-20">
              <div
                className="relative bg-[#fdfbf7] dark:bg-[#1c1710] rounded-lg shadow-lg border border-cream-200 dark:border-amber-900/30 overflow-hidden"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(147,197,253,0.18) 28px)",
                  backgroundSize: "100% 28px",
                }}
              >
                {/* Red margin line */}
                <div className="absolute top-0 left-10 bottom-0 w-px bg-red-200/70 dark:bg-red-500/20" />
                {/* Spiral holes */}
                <div
                  className="absolute top-0 left-4 bottom-0 w-2 bg-repeat-y"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px, transparent 3px)",
                    backgroundSize: "100% 28px",
                    backgroundPosition: "0px 14px",
                  }}
                />

                <style>{`
                  .craft-fav-btn { transition: all 0.2s ease; }
                  .craft-fav-btn:hover { transform: translateY(-3px) scale(1.08); box-shadow: 0 6px 16px rgba(232,93,74,0.28) !important; border-color: #e85d4a !important; border-style: solid !important; background: rgba(232,93,74,0.1) !important; color: #e85d4a !important; }
                  .craft-fav-btn:hover svg { transform: scale(1.15); }
                  .craft-fav-btn svg { transition: transform 0.2s ease; }
                  .craft-extra-btn { transition: all 0.2s ease; }
                  .craft-extra-btn:hover { transform: translateY(-3px); }
                  .craft-extra-btn.craft-extra-outline:hover { border-color: rgba(122,80,40,0.7) !important; border-style: solid !important; background: rgba(253,251,247,1) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                  .craft-extra-btn.craft-extra-ghost:hover { border-color: rgba(180,120,60,0.7) !important; border-style: solid !important; background: rgba(254,243,199,0.85) !important; box-shadow: 0 4px 12px rgba(180,120,60,0.2); }
                  .craft-extra-btn.craft-extra-primary:hover { filter: brightness(1.08); box-shadow: 0 10px 22px rgba(232,93,74,0.4), 2px 2px 0 rgba(0,0,0,0.12) !important; }
                  .dark .craft-fav-btn:hover { box-shadow: 0 6px 16px rgba(232,93,74,0.35) !important; }
                  .dark .craft-extra-btn.craft-extra-outline:hover { background: rgba(28,23,16,0.95) !important; }
                `}</style>
                <div className="relative z-10 p-8 pl-12 sm:p-10 sm:pl-16">
                  {/* ── Badges ── */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    {product.featured && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 rounded-md"
                        style={{ fontFamily: "var(--font-hand)", fontSize: 19 }}
                      >
                        <Sparkles
                          size={14}
                          className="text-amber-500 shrink-0"
                        />{" "}
                        Featured
                      </span>
                    )}
                    {product.customizable && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-coral-50 dark:bg-coral-900/20 border border-coral-300 dark:border-coral-700/50 text-coral-700 dark:text-coral-300 rounded-md"
                        style={{ fontFamily: "var(--font-hand)", fontSize: 19 }}
                      >
                        <Star size={14} className="text-coral-500 shrink-0" />{" "}
                        Customizable
                      </span>
                    )}
                    {!product.inStock && (
                      <span
                        className="inline-flex items-center px-3 py-1 border-2 border-red-500/60 text-red-700 dark:text-red-400 -rotate-1 bg-white/50 dark:bg-black/20 rounded-md uppercase tracking-widest"
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        sold out
                      </span>
                    )}
                  </div>

                  {/* ── Title ── */}
                  <h1
                    className="font-bold text-brown-900 dark:text-amber-100 leading-[1.15] mb-3"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(26px, 3.5vw, 42px)",
                    }}
                  >
                    {(() => {
                      const words = product.name.trim().split(/\s+/);
                      const last = words.pop();
                      return (
                        <>
                          {words.length > 0 && <>{words.join(" ")} </>}
                          <span
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <span
                              className="text-coral-600 dark:text-amber-400"
                              style={{
                                fontFamily: "var(--font-script)",
                                fontSize: "clamp(32px, 4.5vw, 52px)",
                              }}
                            >
                              {last}
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
                        </>
                      );
                    })()}
                  </h1>

                  {/* ── Price + inline reviews (tablet/desktop) ── */}
                  <div className="flex items-end justify-between gap-3 mb-7 flex-wrap">
                    {/* Price group */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span
                        className="font-black text-brown-900 dark:text-amber-100"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(30px,3.2vw,40px)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {formatPrice(effectivePrice)}
                      </span>
                      {effectivePrice !== product.price && (
                        <span
                          className="text-brown-400 dark:text-amber-100/65 line-through"
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: 17,
                          }}
                        >
                          {formatPrice(product.price)}
                        </span>
                      )}
                      {product.compareAtPrice &&
                        effectivePrice === product.price && (
                          <>
                            <span
                              className="text-brown-400 dark:text-amber-100/65 line-through"
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: 17,
                              }}
                            >
                              {formatPrice(product.compareAtPrice)}
                            </span>
                            <span
                              style={{
                                display: "inline-block",
                                background: "#e85d4a",
                                color: "white",
                                fontFamily: "var(--font-hand)",
                                fontSize: 18,
                                letterSpacing: "0.08em",
                                fontWeight: 700,
                                padding: "3px 16px 3px 8px",
                                clipPath:
                                  "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                                lineHeight: 1.3,
                              }}
                            >
                              {discount}% off
                            </span>
                          </>
                        )}
                    </div>

                    {/* Reviews — tablet/desktop only (hidden on mobile, shown md+) */}
                    <div className="hidden md:flex flex-col items-end gap-0.5 pb-0.5 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <HandDrawnStars rating={4.0} size={18} />
                        <span
                          className="font-bold text-brown-700 dark:text-amber-200"
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 18,
                          }}
                        >
                          4.0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-brown-400 dark:text-amber-100/70"
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: 11,
                          }}
                        >
                          24 reviews
                        </span>
                        <Link
                          href="/reviews"
                          className="inline-flex items-center gap-0.5 text-coral-600 dark:text-amber-400 hover:underline"
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: 11,
                          }}
                        >
                          Read all <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Divider between header and description */}
                  <div className="mb-7 relative">
                    <div className="h-px bg-red-300/50 dark:bg-red-700/30" />
                    <div className="h-px bg-red-200/30 dark:bg-red-600/15 mt-[3px]" />
                  </div>

                  {/* ── Description ── */}
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="prose dark:prose-invert max-w-none text-brown-800 dark:text-amber-100/90 [&>p]:mt-0 [&>p]:mb-[28px] [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:pl-5 [&>ol>li]:mb-1 [&>h2]:font-bold [&>h3]:font-semibold [&_strong]:bg-amber-100 [&_strong]:dark:bg-amber-800/30 [&_strong]:rounded-sm [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:text-brown-900 [&_strong]:dark:text-amber-100 [&_em]:text-coral-700 [&_em]:dark:text-amber-400 [&_em]:not-italic [&_em]:border-b [&_em]:border-dashed [&_em]:border-coral-400/60"
                    style={{
                      fontFamily: "var(--font-hand)",
                      fontSize: "24px",
                      lineHeight: "28px",
                      letterSpacing: "0.02em",
                    }}
                  />

                  {/* ── Perfect for — tag chips from product tags ── */}
                  {product.tags.length > 0 && (
                    <div className="mt-6 mb-2">
                      <p
                        className="text-[10px] font-black tracking-[0.18em] uppercase text-brown-400/80 dark:text-amber-100/65 mb-2.5"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Perfect for
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300/80 border border-amber-300/70 dark:border-amber-700/40"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 17,
                              padding: "3px 12px 3px 10px",
                              borderRadius: "9999px",
                            }}
                          >
                            <span className="text-amber-500/80">✦</span> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Characteristics */}
                  {chars.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-4 sm:gap-6 justify-start relative z-10">
                      {chars.map((c, idx) => {
                        const Icon =
                          (c.icon && ICONS[c.icon.toLowerCase()]) || Flame;
                        const noteStyles = [
                          { bg: "#fef3c7" },
                          { bg: "#e0f2fe" },
                          { bg: "#dcfce7" },
                          { bg: "#fee2e2" },
                          { bg: "#f3e8ff" },
                          { bg: "#ffedd5" },
                        ];
                        return (
                          <div
                            key={c.id}
                            className="w-[45%] sm:w-40 flex-shrink-0"
                          >
                            <StickyNote
                              type={c.label}
                              text={c.value}
                              isAbsolute={false}
                              showPin={false}
                              bgColor={noteStyles[idx % noteStyles.length].bg}
                              icon={
                                <Icon
                                  size={16}
                                  className="text-coral-600 shrink-0 drop-shadow-sm"
                                />
                              }
                              positionClass="w-full h-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Section divider ── */}
                  <div className="my-10 relative">
                    <div className="h-px bg-red-300/55 dark:bg-red-700/35" />
                    <div className="h-px bg-red-200/35 dark:bg-red-600/20 mt-[3px]" />
                    <span className="absolute -top-[11px] right-0 bg-[#fdfbf7] dark:bg-[#1c1710] pl-3 font-serif italic text-[11px] text-red-400/70 dark:text-red-400/75">
                      ✦ your order
                    </span>
                  </div>

                  {/* ── Order section heading ── */}
                  <div className="flex items-start gap-3 mb-8">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md mt-1"
                      style={{
                        background:
                          "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
                      }}
                    >
                      {product.customizable &&
                      product.customizationOptions?.length ? (
                        <Sparkles size={14} />
                      ) : (
                        <Package size={14} />
                      )}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 30,
                          lineHeight: 1.1,
                          color: "var(--home-text)",
                        }}
                      >
                        {product.customizable &&
                        product.customizationOptions?.length
                          ? "Make it Yours"
                          : "Your Order"}
                      </h3>
                      <p
                        className="mt-1 text-brown-500 dark:text-amber-100/70"
                        style={{ fontFamily: "var(--font-hand)", fontSize: 19 }}
                      >
                        {product.customizable &&
                        product.customizationOptions?.length
                          ? `Complete ${product.customizationOptions.length + 1} quick step${product.customizationOptions.length > 0 ? "s" : ""} below to personalise your piece, then add to basket.`
                          : "Select how many you'd like and add to your basket."}
                      </p>
                    </div>
                  </div>

                  {/* ── Customization options ── */}
                  {product.customizable &&
                    product.customizationOptions?.map((opt, stepIdx) => (
                      <div key={opt.label} className="mb-10">
                        {/* Step header row */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow"
                            style={{
                              background:
                                "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
                            }}
                          >
                            {stepIdx + 1}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded text-white text-[13px] font-bold uppercase tracking-wider"
                            style={{
                              background: "#e85d4a",
                              fontFamily: "var(--font-serif)",
                            }}
                          >
                            {opt.label}
                          </span>
                        </div>
                        {/* Instruction line */}
                        <div className="mb-4 pl-10">
                          <span
                            className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-dashed border-amber-300/70 dark:border-amber-700/40 rounded-lg px-3 py-1.5 text-amber-800 dark:text-amber-300/80"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 17,
                              lineHeight: 1.5,
                            }}
                          >
                            {opt.type === "text" ? (
                              <>
                                <PenLine
                                  size={14}
                                  className="shrink-0 text-amber-600"
                                />{" "}
                                Jot your {opt.label.toLowerCase()} below —
                                we&apos;ll inscribe it by hand
                              </>
                            ) : opt.type === "color" ? (
                              <>
                                <Palette
                                  size={14}
                                  className="shrink-0 text-amber-600"
                                />{" "}
                                Tap the swatch and pick your perfect shade
                              </>
                            ) : (
                              <>
                                <MousePointerClick
                                  size={14}
                                  className="shrink-0 text-amber-600"
                                />{" "}
                                Tap the one that feels right — it&apos;ll get a
                                highlight
                              </>
                            )}
                          </span>
                        </div>

                        {opt.type === "select" && opt.options ? (
                          <div className="flex flex-wrap gap-x-3 gap-y-2 pl-1">
                            {opt.options.map((o) => {
                              const sel = customizations[opt.label] === o;
                              return (
                                <button
                                  key={o}
                                  type="button"
                                  onClick={() =>
                                    setCustomizations((p) => ({
                                      ...p,
                                      [opt.label]: o,
                                    }))
                                  }
                                  style={{
                                    fontFamily: "var(--font-hand)",
                                    fontSize: 26,
                                    lineHeight: 1.5,
                                    padding: "0 5px",
                                    borderRadius: 1,
                                    color: sel
                                      ? "#78350f"
                                      : "rgba(92,64,40,0.48)",
                                    fontWeight: sel ? 700 : 400,
                                    background: sel
                                      ? markerHighlight
                                      : "transparent",
                                    backgroundSize: "100% 100%",
                                    transition: "all 0.14s ease",
                                  }}
                                >
                                  {o}
                                </button>
                              );
                            })}
                          </div>
                        ) : opt.type === "text" ? (
                          <textarea
                            placeholder="Scribble your message here..."
                            rows={2}
                            className="w-full bg-transparent border-b-2 border-dashed border-amber-200 dark:border-amber-900/40 focus:outline-none focus:border-coral-400 dark:focus:border-amber-500 text-brown-900 dark:text-amber-100 placeholder:text-brown-300/50 dark:placeholder:text-amber-100/25 placeholder:italic placeholder:font-serif resize-none overflow-hidden"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 26,
                              paddingBottom: 4,
                              lineHeight: "32px",
                            }}
                            value={customizations[opt.label] || ""}
                            onChange={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                e.target.scrollHeight + "px";
                              setCustomizations((p) => ({
                                ...p,
                                [opt.label]: e.target.value,
                              }));
                            }}
                          />
                        ) : (
                          <div className="flex items-center gap-3 pl-1">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-amber-200 dark:border-amber-900/40 shadow-inner shrink-0">
                              <input
                                type="color"
                                className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                                value={customizations[opt.label] || "#d97706"}
                                onChange={(e) =>
                                  setCustomizations((p) => ({
                                    ...p,
                                    [opt.label]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <span
                              style={{
                                fontFamily: "var(--font-hand)",
                                fontSize: 24,
                                color: "#78350f",
                                background: customizations[opt.label]
                                  ? markerHighlight
                                  : "transparent",
                                backgroundSize: "100% 100%",
                                padding: "0 5px",
                              }}
                            >
                              {customizations[opt.label] ||
                                "tap swatch to pick"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                  {/* ── Quantity stepper ── */}
                  <div className="mt-2 pt-6 border-t border-dashed border-red-200/50 dark:border-red-700/20">
                    <div className="flex items-center gap-2.5 mb-2">
                      {product.customizable &&
                      product.customizationOptions?.length ? (
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow"
                          style={{
                            background:
                              "linear-gradient(135deg,#16a34a 0%,#15803d 100%)",
                          }}
                        >
                          {(product.customizationOptions?.length ?? 0) + 1}
                        </span>
                      ) : null}
                      <span
                        className="inline-block px-2.5 py-0.5 rounded text-white text-[13px] font-bold uppercase tracking-wider"
                        style={{
                          background: "#16a34a",
                          fontFamily: "var(--font-serif)",
                        }}
                      >
                        Quantity
                      </span>
                    </div>
                    <div className="mb-4 pl-10">
                      <span
                        className="inline-block bg-amber-50 dark:bg-amber-950/40 border border-dashed border-amber-300/70 dark:border-amber-700/40 rounded-lg px-3 py-1.5 text-amber-800 dark:text-amber-300/80"
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 17,
                          lineHeight: 1.5,
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <ShoppingCart
                            size={14}
                            className="shrink-0 text-amber-600"
                          />
                          How many would you like? Tap + or −
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 pl-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-full border-2 border-brown-300/50 dark:border-amber-900/60 flex items-center justify-center text-brown-600 dark:text-amber-100/60 hover:border-coral-400 hover:text-coral-600 dark:hover:text-amber-400 transition-all"
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 22,
                          lineHeight: 1,
                        }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 34,
                          lineHeight: 1.5,
                          color: "#78350f",
                          background: markerHighlight,
                          backgroundSize: "100% 100%",
                          padding: "0 14px",
                          borderRadius: 1,
                          minWidth: 56,
                          textAlign: "center",
                          display: "inline-block",
                        }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stockCount, quantity + 1),
                          )
                        }
                        className="w-9 h-9 rounded-full border-2 border-brown-300/50 dark:border-amber-900/60 flex items-center justify-center text-brown-600 dark:text-amber-100/60 hover:border-coral-400 hover:text-coral-600 dark:hover:text-amber-400 transition-all"
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 22,
                          lineHeight: 1,
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      {product.stockCount < 10 && product.inStock && (
                        <span
                          className="text-amber-700 dark:text-amber-400"
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 20,
                          }}
                        >
                          only {product.stockCount} left!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Order Summary ── */}
                  <div className="mt-8 pt-6 border-t border-dashed border-amber-200/50 dark:border-amber-900/20">
                    {/* Paper-tear top edge */}
                    <div
                      className="h-5 w-full"
                      style={{
                        background: "#fef3c7",
                        clipPath:
                          "polygon(0% 100%,3% 25%,5% 60%,9% 40%,11% 75%,14% 20%,17% 55%,19% 35%,22% 70%,25% 30%,27% 65%,31% 45%,33% 70%,36% 25%,40% 60%,42% 35%,45% 75%,47% 20%,50% 55%,53% 40%,55% 70%,58% 25%,61% 60%,63% 30%,67% 70%,69% 35%,72% 65%,74% 25%,77% 55%,80% 40%,83% 70%,85% 30%,88% 65%,91% 20%,93% 55%,96% 35%,98% 65%,100% 100%)",
                      }}
                    />
                    <div
                      style={{
                        background: "#fef3c7",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div className="px-5 pt-3 pb-4">
                        {/* Header row: label + product name */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <p
                            className="text-amber-700/80 shrink-0 mt-0.5"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 19,
                            }}
                          >
                            ✦ your order
                          </p>
                          <p
                            className="text-amber-900 font-bold text-right leading-snug"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 24,
                            }}
                          >
                            {product.name}
                          </p>
                        </div>

                        {/* Customization rows — only if present */}
                        {product.customizable &&
                          product.customizationOptions?.some(
                            (opt) => !!customizations[opt.label],
                          ) && (
                            <div className="mb-2.5 pl-3 border-l-2 border-amber-300/70 space-y-1.5">
                              {product.customizationOptions?.map((opt) => {
                                const val = customizations[opt.label];
                                if (!val) return null;
                                return (
                                  <div
                                    key={opt.label}
                                    className="flex items-center gap-2"
                                  >
                                    <span
                                      className="text-amber-800/70 shrink-0"
                                      style={{
                                        fontFamily: "var(--font-serif)",
                                        fontStyle: "italic",
                                        fontSize: 16,
                                      }}
                                    >
                                      {opt.label}:
                                    </span>
                                    {opt.type === "color" ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <span
                                          className="inline-block w-3.5 h-3.5 rounded-sm border border-amber-400/60 shadow-sm"
                                          style={{ background: val }}
                                        />
                                        <span
                                          className="font-bold text-amber-900"
                                          style={{
                                            fontFamily: "var(--font-hand)",
                                            fontSize: 20,
                                          }}
                                        >
                                          {val}
                                        </span>
                                      </span>
                                    ) : (
                                      <span
                                        className="font-bold text-amber-900"
                                        style={{
                                          fontFamily: "var(--font-hand)",
                                          fontSize: 20,
                                        }}
                                      >
                                        {val}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        {/* Total line */}
                        <div className="mt-2.5 pt-2.5  flex items-baseline justify-between gap-2">
                          <span
                            className="text-amber-800/80 shrink-0"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 18,
                            }}
                          >
                            {formatPrice(effectivePrice)} × {quantity}
                          </span>
                          <span
                            className="font-black text-coral-600 tabular-nums"
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "clamp(24px,2.5vw,30px)",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {formatPrice(effectivePrice * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Paper-tear bottom edge */}
                    <div
                      className="h-5 w-full"
                      style={{
                        background: "#fef3c7",
                        clipPath:
                          "polygon(0% 0%,3% 75%,5% 40%,9% 60%,11% 25%,14% 80%,17% 45%,19% 65%,22% 30%,25% 70%,27% 35%,31% 55%,33% 80%,36% 30%,40% 60%,42% 75%,45% 25%,47% 80%,50% 45%,53% 60%,55% 30%,58% 75%,61% 40%,63% 70%,67% 30%,69% 65%,72% 35%,74% 75%,77% 45%,80% 60%,83% 30%,85% 70%,88% 80%,91% 25%,93% 55%,96% 65%,98% 35%,100% 0%)",
                      }}
                    />
                  </div>

                  {/* ── Primary actions (inside notebook) ── */}
                  <div className="mt-8 flex gap-3 items-stretch">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                      style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: 24,
                        background: addedToCart
                          ? "linear-gradient(135deg,#16a34a 0%,#15803d 100%)"
                          : "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
                        borderRadius: "14px 10px 13px 11px",
                        boxShadow: addedToCart
                          ? "0 8px 20px rgba(22,163,74,0.32), inset 0 1px 0 rgba(255,255,255,0.18), 3px 3px 0 rgba(0,0,0,0.12)"
                          : "0 8px 20px rgba(232,93,74,0.32), inset 0 1px 0 rgba(255,255,255,0.18), 3px 3px 0 rgba(0,0,0,0.12)",
                        letterSpacing: "0.01em",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <ShoppingCart size={18} />
                      {addedToCart
                        ? "Added to basket!"
                        : !product.inStock
                          ? "Out of stock"
                          : "Add to basket"}
                    </button>
                    <button
                      onClick={toggleFavorite}
                      className="craft-fav-btn flex items-center justify-center px-3.5"
                      style={{
                        borderRadius: "11px 14px 10px 13px",
                        border: favorite
                          ? "2px solid #e85d4a"
                          : "2px dashed rgba(122,80,40,0.35)",
                        background: favorite
                          ? "rgba(232,93,74,0.08)"
                          : "transparent",
                        color: favorite ? "#e85d4a" : "rgba(92,64,40,0.5)",
                      }}
                      aria-label={
                        favorite ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <Heart
                        size={20}
                        className={favorite ? "fill-current" : ""}
                      />
                    </button>
                  </div>

                  {/* Extra buttons (inside notebook) */}
                  {extras.length > 0 && (
                    <div className="flex flex-col gap-2.5 mt-3">
                      {extras.map((b) => {
                        const internal = b.href.startsWith("/");
                        const sharedStyle: React.CSSProperties = {
                          fontFamily: "var(--font-hand)",
                          fontSize: 21,
                          borderRadius: "10px 14px 11px 13px",
                          letterSpacing: "0.01em",
                          transition: "all 0.18s ease",
                        };
                        const primaryStyle: React.CSSProperties = {
                          ...sharedStyle,
                          background:
                            "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
                          color: "white",
                          boxShadow:
                            "0 6px 16px rgba(232,93,74,0.28), 2px 2px 0 rgba(0,0,0,0.1)",
                        };
                        const outlineStyle: React.CSSProperties = {
                          ...sharedStyle,
                          border: "2px dashed rgba(122,80,40,0.4)",
                          background: "rgba(253,251,247,0.7)",
                          color: "rgba(92,64,40,0.85)",
                        };
                        const ghostStyle: React.CSSProperties = {
                          ...sharedStyle,
                          border: "2px dashed rgba(180,120,60,0.4)",
                          background: "rgba(254,243,199,0.5)",
                          color: "#92400e",
                        };
                        const btnStyle =
                          b.variant === "primary"
                            ? primaryStyle
                            : b.variant === "outline"
                              ? outlineStyle
                              : ghostStyle;
                        const variantClass =
                          b.variant === "primary"
                            ? "craft-extra-btn craft-extra-primary"
                            : b.variant === "outline"
                              ? "craft-extra-btn craft-extra-outline"
                              : "craft-extra-btn craft-extra-ghost";
                        const children = (
                          <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 w-full">
                            {b.label}
                            <ArrowRight size={14} />
                          </span>
                        );
                        return internal ? (
                          <Link
                            key={b.id}
                            href={b.href}
                            style={btnStyle}
                            className={`block ${variantClass}`}
                          >
                            {children}
                          </Link>
                        ) : (
                          <a
                            key={b.id}
                            href={b.href}
                            target="_blank"
                            rel="noreferrer"
                            style={btnStyle}
                            className={`block ${variantClass}`}
                          >
                            {children}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Trust stamps (inside notebook) ── */}
                  <div className="flex flex-wrap justify-center gap-5 mt-6 pt-6 border-t border-dashed border-red-200/40 dark:border-red-700/20">
                    <PostageStamp
                      label="Shipping"
                      denom={
                        <span className="flex items-center justify-center gap-1.5 mt-0.5">
                          <Truck
                            size={14}
                            strokeWidth={2}
                            className="opacity-80"
                          />
                          Free &gt; ₹999
                        </span>
                      }
                      kind="cream"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                    <PostageStamp
                      label="Secure Pay"
                      denom={
                        <span className="flex items-center justify-center gap-1.5 mt-0.5">
                          <Shield
                            size={14}
                            strokeWidth={2}
                            className="opacity-80"
                          />
                          256-bit SSL
                        </span>
                      }
                      kind="mint"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                    <PostageStamp
                      label="Returns"
                      denom={
                        <span className="flex items-center justify-center gap-1.5 mt-0.5">
                          <RotateCcw
                            size={14}
                            strokeWidth={2}
                            className="opacity-80"
                          />
                          30 Days
                        </span>
                      }
                      kind="gold"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tags — arrow-shaped manila tags ── */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-[#f5ecda] dark:bg-amber-950/40 text-brown-700 dark:text-amber-100/60 border border-[rgba(122,80,40,0.22)] dark:border-amber-900/25"
                    style={{
                      clipPath:
                        "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)",
                      padding: "3px 10px 3px 16px",
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 11,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional sections */}
        {sections.length > 0 && (
          <ProductTabs
            sections={sections}
            productImages={product.images}
            productCharacteristics={chars}
          />
        )}

        {/* Category-specific care guide */}
        {category?.slug === "scented-candles" && <BurnGuideSection />}
        {category?.slug === "key-chain" && <KeyChainGuideSection />}
        {category?.slug === "fridge-magnets" && <MagnetGuideSection />}

        {/* Gifting section */}
        <GiftingSection />

        {/* Bespoke / craft story */}
        <BespokeSection />

        {/* FAQ */}
        <FAQSection categorySlug={category?.slug} />

        {/* Reviews */}
        {(() => {
          const productReviews = reviews?.filter(
            (r) =>
              r.product_name === product.name || r.product_id === product.id,
          );
          const displayReviews = productReviews?.length
            ? productReviews
            : reviews;

          return (
            <Testimonials
              reviews={displayReviews}
              limit={4}
              titlePrefix="Customer"
              titleHighlighted="Stories"
              eyebrow="What people are saying"
              className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20"
              style={{}}
              showHeaderDetails={true}
            />
          );
        })()}

        {/* Featured products */}
        <FeaturedProductsSection
          currentProductId={product.id}
          categoryId={product.categoryId}
        />
      </div>
    </div>
  );
}

const TAB_TILTS = [-2.5, 1.8, -1.2, 2.2, -0.8, 1.5, -2, 1];
const NOTE_COLORS = [
  "#fef3c7",
  "#e0f2fe",
  "#dcfce7",
  "#fee2e2",
  "#f3e8ff",
  "#ffedd5",
];
const NOTE_ROTATIONS = [-4, 3, -2, 5, -1, 4, -3, 2, -5, 1];

function ProductTabs({
  sections,
  productImages,
  productCharacteristics,
}: {
  sections: NonNullable<Product["additionalSections"]>;
  productImages?: string[];
  productCharacteristics?: NonNullable<Product["characteristics"]>;
}) {
  const [active, setActive] = useState(0);
  const section = sections[active] ?? sections[0];
  const sectionImage =
    section?.image ||
    productImages?.[active % (productImages?.length || 1)] ||
    productImages?.[0];
  const hasImage = !!sectionImage;
  const tilt = TAB_TILTS[active % TAB_TILTS.length];

  return (
    <section className="py-12 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      {/* Notebook tab strip */}
      <div
        role="tablist"
        className="flex items-end flex-wrap mb-0 pl-4 sm:pl-8 relative z-10"
      >
        {sections.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`relative px-6 border transition-all ${
                isActive
                  ? "bg-[#fdfbf7] dark:bg-[#1c1710] border-cream-200 dark:border-amber-900/30 border-b-transparent text-coral-600 dark:text-amber-400 z-20 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.05)]"
                  : "bg-[#f5ecda] dark:bg-amber-950/40 border-cream-200 dark:border-amber-900/30 text-brown-600 dark:text-amber-200/75 hover:bg-[#eaddc1] dark:hover:bg-amber-900/60 z-0"
              }`}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 20,
                borderRadius: "12px 12px 0 0",
                marginBottom: isActive ? "-1px" : "0",
                marginLeft: i > 0 ? "-12px" : "0",
                paddingTop: isActive ? "14px" : "10px",
                paddingBottom: isActive ? "14px" : "10px",
              }}
            >
              {(() => {
                const words = (s.heading || `Section ${i + 1}`)
                  .trim()
                  .split(/\s+/);
                const last = words.pop();
                return (
                  <>
                    {words.length > 0 && <>{words.join(" ")} </>}
                    <span
                      className="text-coral-600 dark:text-amber-400"
                      style={{
                        fontFamily: "var(--font-script)",
                        fontSize: 26,
                      }}
                    >
                      {last}
                    </span>
                  </>
                );
              })()}
            </button>
          );
        })}
      </div>

      {/* Notebook panel */}
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="tabpanel"
        className="relative bg-[#fdfbf7] dark:bg-[#1c1710] rounded-lg shadow-lg border border-cream-200 dark:border-amber-900/30 overflow-hidden"
      >
        <div
          className="notebook-page-tabs relative p-8 pl-12 sm:p-10 sm:pl-16"
          style={
            {
              // Ruled lines scaled to match 32px line-height
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(147, 197, 253, 0.2) 32px)",
              backgroundSize: "100% 32px",
              "--notebook-hole-color": "rgba(0,0,0,0.08)",
            } as React.CSSProperties
          }
        >
          {/* Dark mode adjustments for hole color */}
          <style>{`.dark .notebook-page-tabs { --notebook-hole-color: rgba(255,255,255,0.08); }`}</style>

          {/* Red margin line */}
          <div className="absolute top-0 left-10 bottom-0 w-px bg-red-200/70 dark:bg-red-500/20" />

          {/* Spiral holes */}
          <div
            className="absolute top-0 left-4 bottom-0 w-2 bg-repeat-y"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, transparent 2px, var(--notebook-hole-color) 2px, var(--notebook-hole-color) 3px, transparent 3px)",
              backgroundSize: "100% 32px",
              backgroundPosition: "0px 16px",
            }}
          />

          <div
            className={`grid gap-10 md:gap-14 items-start relative z-10 ${hasImage ? "md:grid-cols-[5fr_6fr]" : ""}`}
          >
            {hasImage && (
              <div className="flex flex-col gap-6">
                {/* Polaroid — bigger, tilted */}
                <motion.div
                  key={active}
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: tilt }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative craft-polaroid"
                  style={{
                    padding: "14px 14px 38px",
                    transformOrigin: "center top",
                    maxWidth: 520,
                  }}
                >
                  <div className="relative w-full aspect-[4/3] bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden">
                    <Image
                      src={sectionImage || ""}
                      alt={section.heading}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Tape after image in DOM so it always paints on top */}
                  <Tape
                    color="amber"
                    width={130}
                    height={32}
                    rotate={tilt > 0 ? -6 : 6}
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                  />
                  <p
                    className="text-center text-brown-500 dark:text-amber-200/70 mt-2 leading-snug line-clamp-1 px-1"
                    style={{ fontFamily: "var(--font-hand)", fontSize: 32 }}
                  >
                    {section.heading}
                  </p>
                </motion.div>

                {/* Characteristics sticky notes below polaroid */}
                {productCharacteristics &&
                  productCharacteristics.length > 0 && (
                    <div className="flex flex-wrap gap-5 px-2 pt-4">
                      {productCharacteristics.map((c, idx) => {
                        const Icon =
                          (c.icon && ICONS[c.icon.toLowerCase()]) || Flame;
                        const rot = NOTE_ROTATIONS[idx % NOTE_ROTATIONS.length];
                        return (
                          <div
                            key={c.id}
                            style={{
                              transform: `rotate(${rot}deg)`,
                              width: 140,
                              flexShrink: 0,
                            }}
                          >
                            <StickyNote
                              type={c.label}
                              text={c.value}
                              isAbsolute={false}
                              showPin={true}
                              bgColor={NOTE_COLORS[idx % NOTE_COLORS.length]}
                              icon={
                                <Icon
                                  size={14}
                                  className="text-coral-600 shrink-0"
                                />
                              }
                              positionClass="w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}
            <div
              className="prose dark:prose-invert max-w-none text-brown-800 dark:text-amber-100/90 [&>p]:mt-0 [&>p]:mb-[32px] [&_strong]:bg-amber-100 [&_strong]:dark:bg-amber-800/30 [&_strong]:rounded-sm [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:text-brown-900 [&_strong]:dark:text-amber-100 [&_em]:text-coral-700 [&_em]:dark:text-amber-400 [&_em]:not-italic [&_em]:border-b [&_em]:border-dashed [&_em]:border-coral-400/60"
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "0.02em",
              }}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Burn Guide & Care section ──────────────────────────────────────────── */
function BurnGuideSection() {
  const tips = [
    {
      icon: Clock,
      color: "#fef3c7",
      pinColor: "#d97706",
      heading: "First burn: 2–3 hrs",
      body: "Let the wax melt edge-to-edge on the first burn to prevent tunnelling. This sets the memory of the candle.",
    },
    {
      icon: Flame,
      color: "#fee2e2",
      pinColor: "#e85d4a",
      heading: "Trim the wick",
      body: "Before every burn, trim the wick to 5mm. A long wick smokes and shortens the life of your candle.",
    },
    {
      icon: Wind,
      color: "#e0f2fe",
      pinColor: "#0284c7",
      heading: "Extinguish gently",
      body: "Use a snuffer or dip the wick — never blow it out. This prevents hot wax from splattering.",
    },
    {
      icon: Droplet,
      color: "#dcfce7",
      pinColor: "#16a34a",
      heading: "Max 4 hrs at a time",
      body: "Burning longer overheats the vessel. Let it cool completely (at least 2 hours) before relighting.",
    },
    {
      icon: Home,
      color: "#f3e8ff",
      pinColor: "#7c3aed",
      heading: "Store with care",
      body: "Keep away from direct sunlight and heat. Replace the lid when not in use to preserve the fragrance.",
    },
  ];

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Get the most from your candle
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Burn{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Better
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
        </div>
        <p
          className="text-brown-500 dark:text-amber-100/70 sm:ml-auto max-w-xs text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          Five simple habits that make your candle last longer and burn cleaner.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-start">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          const rot = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length];
          return (
            <motion.div
              key={tip.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                width: 176,
                flexShrink: 0,
                transform: `rotate(${rot}deg)`,
                transformOrigin: "center top",
              }}
            >
              <StickyNote
                isAbsolute={false}
                showPin={true}
                bgColor={tip.color}
                pinColor={tip.pinColor}
                positionClass="w-full"
              >
                <div className="flex items-center gap-1.5 mb-2 mt-1">
                  <Icon
                    size={14}
                    style={{ color: tip.pinColor, flexShrink: 0 }}
                  />
                  <span
                    className="text-[10px] font-black tracking-[0.15em] uppercase leading-tight"
                    style={{ color: tip.pinColor + "aa" }}
                  >
                    Tip {i + 1}
                  </span>
                </div>
                <p
                  className="font-bold mb-1.5"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 18,
                    color: "#451a03",
                    lineHeight: 1.2,
                  }}
                >
                  {tip.heading}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#78350f",
                    lineHeight: 1.5,
                  }}
                >
                  {tip.body}
                </p>
              </StickyNote>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Key-chain Care section ──────────────────────────────────────────────── */
function KeyChainGuideSection() {
  const tips = [
    {
      icon: Package,
      color: "#fef3c7",
      pinColor: "#d97706",
      heading: "Thread it right",
      body: "Loop the ring fully through before locking the clasp — a half-thread works loose over time.",
    },
    {
      icon: Droplet,
      color: "#e0f2fe",
      pinColor: "#0284c7",
      heading: "Keep it dry",
      body: "If it gets wet, pat dry straight away. Avoid submerging — moisture dulls the finish and weakens scent.",
    },
    {
      icon: Wind,
      color: "#dcfce7",
      pinColor: "#16a34a",
      heading: "Preserve the scent",
      body: "Store in the cloth pouch when not in use. Heat and direct sunlight fade the fragrance faster.",
    },
    {
      icon: Sparkles,
      color: "#fee2e2",
      pinColor: "#e85d4a",
      heading: "Gentle cleaning",
      body: "A soft dry brush is all you need. Avoid chemicals — they strip the glaze and dull the colors.",
    },
    {
      icon: Shield,
      color: "#f3e8ff",
      pinColor: "#7c3aed",
      heading: "Check the clasp",
      body: "Give it a quick squeeze monthly. A loose clasp is easy to close before things go missing.",
    },
  ];

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Keep it looking beautiful
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Carry with{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Love
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
        </div>
        <p
          className="text-brown-500 dark:text-amber-100/70 sm:ml-auto max-w-xs text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          Five simple habits to keep your keychain looking and smelling its
          best.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-start">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          const rot = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length];
          return (
            <motion.div
              key={tip.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                width: 176,
                flexShrink: 0,
                transform: `rotate(${rot}deg)`,
                transformOrigin: "center top",
              }}
            >
              <StickyNote
                isAbsolute={false}
                showPin={true}
                bgColor={tip.color}
                pinColor={tip.pinColor}
                positionClass="w-full"
              >
                <div className="flex items-center gap-1.5 mb-2 mt-1">
                  <Icon
                    size={14}
                    style={{ color: tip.pinColor, flexShrink: 0 }}
                  />
                  <span
                    className="text-[10px] font-black tracking-[0.15em] uppercase leading-tight"
                    style={{ color: tip.pinColor + "aa" }}
                  >
                    Tip {i + 1}
                  </span>
                </div>
                <p
                  className="font-bold mb-1.5"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 18,
                    color: "#451a03",
                    lineHeight: 1.2,
                  }}
                >
                  {tip.heading}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#78350f",
                    lineHeight: 1.5,
                  }}
                >
                  {tip.body}
                </p>
              </StickyNote>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Fridge-magnet Care section ───────────────────────────────────────────── */
function MagnetGuideSection() {
  const tips = [
    {
      icon: Sparkles,
      color: "#fef3c7",
      pinColor: "#d97706",
      heading: "Clean the surface first",
      body: "Wipe the fridge or board with a dry cloth before placing — dust and grease weaken the hold.",
    },
    {
      icon: Shield,
      color: "#fee2e2",
      pinColor: "#e85d4a",
      heading: "Mind the electronics",
      body: "Keep away from laptops, bank cards, and phones. Strong magnets can erase magnetic strips.",
    },
    {
      icon: Home,
      color: "#e0f2fe",
      pinColor: "#0284c7",
      heading: "Flat surfaces only",
      body: "Works best on flat metal — fridges, whiteboards, lockers. Curved surfaces reduce grip.",
    },
    {
      icon: Droplet,
      color: "#dcfce7",
      pinColor: "#16a34a",
      heading: "Wipe gently",
      body: "Clean with a barely damp cloth and pat dry straight away. No soaking, no scrubbing.",
    },
    {
      icon: Package,
      color: "#f3e8ff",
      pinColor: "#7c3aed",
      heading: "Handle with care",
      body: "The ceramic glaze is delicate — avoid dropping on hard floors. The art lasts longest when treated gently.",
    },
  ];

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Make it last
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Stick it{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Right
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
        </div>
        <p
          className="text-brown-500 dark:text-amber-100/70 sm:ml-auto max-w-xs text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          Five tips to display and care for your magnet beautifully.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-start">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          const rot = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length];
          return (
            <motion.div
              key={tip.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                width: 176,
                flexShrink: 0,
                transform: `rotate(${rot}deg)`,
                transformOrigin: "center top",
              }}
            >
              <StickyNote
                isAbsolute={false}
                showPin={true}
                bgColor={tip.color}
                pinColor={tip.pinColor}
                positionClass="w-full"
              >
                <div className="flex items-center gap-1.5 mb-2 mt-1">
                  <Icon
                    size={14}
                    style={{ color: tip.pinColor, flexShrink: 0 }}
                  />
                  <span
                    className="text-[10px] font-black tracking-[0.15em] uppercase leading-tight"
                    style={{ color: tip.pinColor + "aa" }}
                  >
                    Tip {i + 1}
                  </span>
                </div>
                <p
                  className="font-bold mb-1.5"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 18,
                    color: "#451a03",
                    lineHeight: 1.2,
                  }}
                >
                  {tip.heading}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#78350f",
                    lineHeight: 1.5,
                  }}
                >
                  {tip.body}
                </p>
              </StickyNote>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Gifting section ──────────────────────────────────────────────────────── */
function GiftingSection() {
  const occasions: { icon: React.ElementType; label: string }[] = [
    { icon: Cake, label: "Birthdays" },
    { icon: Heart, label: "Anniversaries" },
    { icon: Home, label: "Housewarming" },
    { icon: Sparkles, label: "Festive" },
    { icon: Smile, label: "Just because" },
    { icon: GraduationCap, label: "Graduation" },
  ];

  const perks = [
    {
      icon: Package,
      color: "#fef3c7",
      pinColor: "#d97706",
      heading: "Arrives gift-ready",
      body: "Every piece is wrapped in tissue, sealed with our wax stamp, and packed in a kraft gift box.",
    },
    {
      icon: PenLine,
      color: "#e0f2fe",
      pinColor: "#0284c7",
      heading: "Add a personal note",
      body: "Use the customization options above to include a handwritten-style message with your order.",
    },
    {
      icon: Truck,
      color: "#dcfce7",
      pinColor: "#16a34a",
      heading: "Ship direct to them",
      body: "Enter the recipient's address at checkout — we'll deliver straight to their door, no middleman.",
    },
    {
      icon: Leaf,
      color: "#f3e8ff",
      pinColor: "#7c3aed",
      heading: "Eco packaging",
      body: "Plastic-free, recyclable materials only. Because a beautiful gift shouldn't cost the earth.",
    },
  ];

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Someone special in mind?
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Gift it with{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Joy
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
        </div>
        <p
          className="text-brown-500 dark:text-amber-100/70 sm:ml-auto max-w-xs text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          Every order arrives wrapped and ready — no extra steps needed.
        </p>
      </div>

      {/* Perks row */}
      <div className="flex flex-wrap gap-8 justify-start mb-12">
        {perks.map((perk, i) => {
          const Icon = perk.icon;
          const rot = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length];
          return (
            <motion.div
              key={perk.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                width: 176,
                flexShrink: 0,
                transform: `rotate(${rot}deg)`,
                transformOrigin: "center top",
              }}
            >
              <StickyNote
                isAbsolute={false}
                showPin={true}
                bgColor={perk.color}
                pinColor={perk.pinColor}
                positionClass="w-full"
              >
                <div className="flex items-center gap-1.5 mb-2 mt-1">
                  <Icon
                    size={14}
                    style={{ color: perk.pinColor, flexShrink: 0 }}
                  />
                </div>
                <p
                  className="font-bold mb-1.5"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 18,
                    color: "#451a03",
                    lineHeight: 1.2,
                  }}
                >
                  {perk.heading}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#78350f",
                    lineHeight: 1.5,
                  }}
                >
                  {perk.body}
                </p>
              </StickyNote>
            </motion.div>
          );
        })}
      </div>

      {/* Occasions */}
      <div className="mb-10">
        <p
          className="text-[10px] font-black tracking-[0.18em] uppercase text-brown-400/80 dark:text-amber-100/65 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Perfect for
        </p>
        <div className="flex flex-wrap gap-2.5">
          {occasions.map((o) => {
            const OccIcon = o.icon;
            return (
              <span
                key={o.label}
                className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300/80 border border-amber-300/70 dark:border-amber-700/40"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 17,
                  padding: "4px 14px 4px 10px",
                  borderRadius: "9999px",
                }}
              >
                <OccIcon size={13} className="text-amber-500/80 shrink-0" />
                {o.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Free wrapping callout */}
      <div className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 w-fit">
        <Gift
          size={18}
          className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        />
        <p
          className="text-amber-900 dark:text-amber-200/90"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Every gift set comes with{" "}
          <strong className="not-italic font-bold">free gift wrapping</strong>{" "}
          and a{" "}
          <strong className="not-italic font-bold">
            handwritten greeting card
          </strong>{" "}
          — just add your message at checkout.
        </p>
      </div>

      {/* Gift set CTAs */}
      <div className="flex flex-wrap gap-3 items-center">
        <Link
          href="/gift-sets"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-lg hover:-translate-y-0.5 transition-all"
          style={{
            background: "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            letterSpacing: "0.03em",
            boxShadow: "0 8px 20px rgba(232,93,74,0.35)",
          }}
        >
          <Sparkles size={16} />
          Browse gift sets
        </Link>
        <Link
          href="/custom/gift-set"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border border-brown-300 dark:border-amber-800/50 text-brown-800 dark:text-amber-100 hover:border-coral-400 dark:hover:border-amber-500 hover:-translate-y-0.5 transition-all"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            letterSpacing: "0.03em",
          }}
        >
          <PenLine size={16} />
          Build your own
        </Link>
      </div>
    </section>
  );
}

/* ── Bespoke / Craft Story section ───────────────────────────────────────── */
function BespokeSection() {
  const steps = [
    {
      icon: "✏️",
      title: "You dream it",
      body: "Tell us the occasion, the scent, the colours, the words. No idea is too specific.",
    },
    {
      icon: "🕯️",
      title: "We hand-craft it",
      body: "Our artisans in Varanasi pour, set, and finish every piece by hand — in small batches.",
    },
    {
      icon: "📦",
      title: "We deliver it",
      body: "Wrapped in tissue and sealed with care, your piece arrives ready to gift or treasure.",
    },
  ];

  return (
    <section className="py-14 mt-4 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Want something truly one-of-a-kind?
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Order{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Bespoke
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
        </div>
        <p
          className="text-brown-500 dark:text-amber-100/70 sm:ml-auto max-w-xs text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 13,
          }}
        >
          Every bespoke piece is made to order — no two are ever alike.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative bg-[#fdfbf7] dark:bg-[#1c1710] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 shadow-sm"
          >
            <div
              className="absolute -top-4 -left-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-black shadow"
              style={{ background: "linear-gradient(135deg,#e85d4a,#c94535)" }}
            >
              {i + 1}
            </div>
            <div className="text-3xl mb-3 mt-1">{s.icon}</div>
            <h3
              className="text-brown-900 dark:text-amber-100 font-bold mb-1.5"
              style={{ fontFamily: "var(--font-hand)", fontSize: 22 }}
            >
              {s.title}
            </h3>
            <p
              className="text-brown-600 dark:text-amber-100/75 leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
            >
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href="/custom"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-lg hover:-translate-y-0.5 transition-all"
          style={{
            background: "linear-gradient(135deg,#e85d4a 0%,#c94535 100%)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            letterSpacing: "0.03em",
            boxShadow: "0 8px 20px rgba(232,93,74,0.35)",
          }}
        >
          <Sparkles size={16} />
          Start a bespoke order
        </Link>
        <span
          className="text-brown-500 dark:text-amber-100/70 font-serif italic"
          style={{ fontSize: 13 }}
        >
          We usually respond within 24 hours.
        </span>
      </div>
    </section>
  );
}

/* ── FAQ section ─────────────────────────────────────────────────────────── */
function FAQSection({ categorySlug }: { categorySlug?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const universal = [
    {
      q: "How long does delivery take?",
      a: "We dispatch within 1–2 business days. Standard delivery is 4–6 business days across India. Express options are available at checkout.",
    },
    {
      q: "Can I change or cancel my order?",
      a: "Yes — reach out within 2 hours of placing your order and we can make amendments. Once it's in production we're unable to make changes, but we'll always do our best.",
    },
    {
      q: "Do you ship internationally?",
      a: "Not yet, but we're working on it! Currently we ship across India only. Sign up to our newsletter to be the first to know when international shipping launches.",
    },
    {
      q: "Is the packaging eco-friendly?",
      a: "Completely. We use kraft paper, tissue, and recyclable card — no single-use plastics anywhere in our packaging.",
    },
  ];

  const candleFaqs = [
    {
      q: "What wax do you use?",
      a: "100% natural soy wax, sustainably sourced. It burns cleaner and longer than paraffin and carries fragrance beautifully.",
    },
    {
      q: "Are the fragrances safe?",
      a: "Yes — all our fragrance oils are phthalate-free and IFRA compliant. Safe for homes, around pets, and gentle enough for sensitive noses.",
    },
    {
      q: "How long will my candle burn?",
      a: "Burn time depends on size — our standard jars give 40–50 hours. Trim the wick to 5mm before each burn to get the most out of it.",
    },
  ];

  const keyChainFaqs = [
    {
      q: "Will the scent last?",
      a: "The fragrance is infused into the charm during making and typically lasts 3–6 months. Storing in the cloth pouch between uses helps preserve it.",
    },
    {
      q: "Is it suitable for everyday use?",
      a: "Absolutely — the clasp and ring are made to withstand daily use. Just avoid prolonged exposure to water.",
    },
  ];

  const magnetFaqs = [
    {
      q: "How strong is the magnet?",
      a: "Strong enough to hold several sheets of paper or light memos on a standard fridge or whiteboard.",
    },
    {
      q: "Will it damage my fridge?",
      a: "No — the base has a protective felt pad so it won't scratch the surface.",
    },
  ];

  const categoryFaqs =
    categorySlug === "scented-candles"
      ? candleFaqs
      : categorySlug === "key-chain"
        ? keyChainFaqs
        : categorySlug === "fridge-magnets"
          ? magnetFaqs
          : [];

  const faqs = [...categoryFaqs, ...universal];

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Got questions?
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px,3.5vw,42px)",
            }}
          >
            Quick{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(34px,4.5vw,52px)",
                }}
              >
                Answers
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
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-[#fdfbf7] dark:bg-[#1c1710] border border-cream-200 dark:border-amber-900/30 rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span
                className="text-brown-900 dark:text-amber-100 font-semibold"
                style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
              >
                {faq.q}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-brown-400 dark:text-amber-100/50 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p
                  className="text-brown-600 dark:text-amber-100/75 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 13,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Featured Products section ───────────────────────────────────────────── */
function FeaturedProductsSection({
  currentProductId,
  categoryId,
}: {
  currentProductId: string;
  categoryId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?featured=true`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (!Array.isArray(data)) return;
        const filtered = data
          .filter(
            (p) => p.id !== currentProductId && p.visibleOnStorefront !== false,
          )
          .slice(0, 8);
        setProducts(filtered);
      })
      .catch(() => {});
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="py-14 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
      {/* Heading */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p
            className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            You might also love
          </p>
          <h2
            className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px,3vw,38px)",
            }}
          >
            Featured{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(32px,4vw,48px)",
                }}
              >
                Pieces
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
        </div>
        <Link
          href="/products"
          className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-500 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-300 transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
