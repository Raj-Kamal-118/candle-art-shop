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
  ChevronDown,
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
  const { product, category } = useProductData();

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

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

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
          {/* ── Image column ── */}
          <div className="space-y-6 min-w-0 w-full">
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
                className="craft-polaroid mx-auto"
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
                  className="text-center text-brown-500 dark:text-amber-100/50 mt-3 px-2 leading-snug line-clamp-1"
                  style={{ fontFamily: "var(--font-hand)", fontSize: 32 }}
                >
                  {product.name}
                </p>
              </motion.div>
            </div>

            {/* Thumbnail strip — mini polaroids */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pt-4 pb-4 px-2 scrollbar-hide justify-center">
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
                        transform: `rotate(${i % 2 === 0 ? -8 : 12}deg)`,
                      }}
                    >
                      <path
                        d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48 A 11 11 0 0 1 4 48 V 16"
                        stroke="#9ca3af"
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
          </div>

          {/* ── Details column ── */}
          <div className="lg:py-2 min-w-0 w-full">
            {/* label badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.featured && (
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 shadow-sm rounded-md font-semibold"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 22,
                    letterSpacing: "0.02em",
                  }}
                >
                  <Sparkles size={16} className="text-amber-500 shrink-0" />{" "}
                  Featured
                </span>
              )}
              {product.customizable && (
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-coral-50 dark:bg-coral-900/20 border border-coral-300 dark:border-coral-700/50 text-coral-700 dark:text-coral-300 shadow-sm rounded-md font-semibold"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 22,
                    letterSpacing: "0.02em",
                  }}
                >
                  <Star size={16} className="text-coral-500 shrink-0" />{" "}
                  Customizable
                </span>
              )}
              {!product.inStock && (
                <span
                  className="inline-flex items-center px-3 py-1 border-2 border-red-500/60 text-red-700 dark:text-red-400 transform -rotate-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-md uppercase tracking-widest shadow-sm"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  sold out
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-bold text-brown-900 dark:text-amber-100 leading-[1.08] mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 46px)",
              }}
            >
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < 4
                        ? "text-amber-400 fill-amber-400"
                        : "text-brown-200 dark:text-amber-900/40"
                    }
                  />
                ))}
              </div>
              <span
                className="text-brown-400 dark:text-amber-100/40"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 12,
                }}
              >
                4.0 · 24 reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="font-black text-brown-900 dark:text-amber-100"
                style={{ fontFamily: "var(--font-serif)", fontSize: 38 }}
              >
                {formatPrice(effectivePrice)}
              </span>
              {effectivePrice !== product.price && (
                <span
                  className="text-brown-400 dark:text-amber-100/40 line-through"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}
                >
                  {formatPrice(product.price)}
                </span>
              )}
              {product.compareAtPrice && effectivePrice === product.price && (
                <>
                  <span
                    className="text-brown-400 dark:text-amber-100/40 line-through"
                    style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}
                  >
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e85d4a",
                      color: "white",
                      fontFamily: "var(--font-hand)",
                      fontSize: 20,
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      padding: "4px 18px 4px 10px",
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

            {/* ── Notebook Page Description ── */}
            <div className="relative my-8 bg-[#fdfbf7] dark:bg-[#1c1710] rounded-lg shadow-lg border border-cream-200 dark:border-amber-900/30 overflow-hidden">
              <div
                className="notebook-page-container relative p-8 pl-12 sm:p-10 sm:pl-16"
                style={
                  {
                    // Ruled lines
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(147, 197, 253, 0.2) 28px)",
                    backgroundSize: "100% 28px",
                    "--notebook-hole-color": "rgba(0,0,0,0.08)",
                  } as React.CSSProperties
                }
              >
                {/* Dark mode adjustments for hole color */}
                <style>{`.dark .notebook-page-container { --notebook-hole-color: rgba(255,255,255,0.08); }`}</style>

                {/* Red margin line */}
                <div className="absolute top-0 left-10 bottom-0 w-px bg-red-200/70 dark:bg-red-500/20" />

                {/* Spiral holes */}
                <div
                  className="absolute top-0 left-4 bottom-0 w-2 bg-repeat-y"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, transparent 2px, var(--notebook-hole-color) 2px, var(--notebook-hole-color) 3px, transparent 3px)",
                    backgroundSize: "100% 28px",
                    backgroundPosition: "0px 14px",
                  }}
                />

                {/* Content */}
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="prose dark:prose-invert max-w-none text-brown-800 dark:text-amber-100/80 [&>p]:mt-0 [&>p]:mb-[28px]"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: "26px",
                    lineHeight: "32px", // Match the ruled lines
                  }}
                />

                {/* ── Characteristics — sticky notes on page ── */}
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
                      const { bg: bgColor } =
                        noteStyles[idx % noteStyles.length];

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
                            bgColor={bgColor}
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
              </div>
            </div>

            {/* ── Customization Options (Visible Elevated Card) ── */}
            {/* ── Order Configuration (Customizations + Qty) ── */}
            <div className="relative mb-10 mt-12 z-20">
              {/* Tape pinning the card */}
              <Tape
                color="coral"
                width={130}
                height={32}
                rotate={-4}
                className="absolute -top-4 left-8 z-20"
              />
              <Tape
                color="amber"
                width={110}
                height={30}
                rotate={3}
                className="absolute -top-4 right-10 z-20"
              />

              <div className="order-config-card relative rounded-2xl p-6 sm:p-8">
                {/* Inner stitch */}
                <div className="absolute inset-2.5 rounded-xl border border-dashed border-[rgba(232,93,74,0.15)] dark:border-amber-900/20 pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center gap-4 mb-7 pb-6 border-b border-dashed border-[rgba(232,93,74,0.2)] dark:border-amber-900/30">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #e85d4a 0%, #c94535 100%)",
                      boxShadow:
                        "0 6px 16px rgba(232,93,74,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    {product.customizable &&
                    product.customizationOptions &&
                    product.customizationOptions.length > 0 ? (
                      <Sparkles size={22} />
                    ) : (
                      <Package size={22} />
                    )}
                  </div>
                  <div>
                    <h3
                      className="text-brown-900 dark:text-amber-100 leading-tight"
                      style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: 34,
                        lineHeight: 1.1,
                      }}
                    >
                      {product.customizable &&
                      product.customizationOptions &&
                      product.customizationOptions.length > 0
                        ? "Make it Yours"
                        : "Your Order"}
                    </h3>
                    <p className="text-sm text-brown-500 dark:text-amber-100/60 font-serif italic mt-1">
                      {product.customizable &&
                      product.customizationOptions &&
                      product.customizationOptions.length > 0
                        ? "Select your preferences below before adding to basket."
                        : "Select your quantity below."}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-4">
                  {product.customizable &&
                    product.customizationOptions?.map((opt) => (
                      <div
                        key={opt.label}
                        className="order-config-row relative p-4 sm:p-5 rounded-xl border border-[rgba(232,93,74,0.15)] dark:border-amber-900/40 shadow-sm transition-all hover:border-coral-300 dark:hover:border-amber-800/60 hover:shadow-md"
                      >
                        <label className="block text-sm font-bold uppercase tracking-[0.15em] text-brown-800 dark:text-amber-100 mb-3 flex items-center gap-2.5 font-serif">
                          <span className="text-coral-500 dark:text-amber-400 text-[18px] leading-none -mt-0.5">
                            ✦
                          </span>
                          {opt.label}
                        </label>

                        {opt.type === "select" && opt.options ? (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === opt.label ? null : opt.label,
                                )
                              }
                              className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1612] border-2 ${customizations[opt.label] ? "border-coral-300 dark:border-amber-600/70 shadow-sm" : "border-cream-200 dark:border-amber-900/40"} rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-coral-200 dark:focus:ring-amber-900/50 group transition-all`}
                            >
                              <span
                                className={`${customizations[opt.label] ? "text-coral-700 dark:text-amber-400" : "text-brown-400 dark:text-amber-100/40 italic font-serif text-base"}`}
                                style={
                                  customizations[opt.label]
                                    ? {
                                        fontFamily: "var(--font-hand)",
                                        fontSize: 26,
                                        lineHeight: 1,
                                      }
                                    : {}
                                }
                              >
                                {customizations[opt.label] ||
                                  `Select an option...`}
                              </span>
                              <ChevronDown
                                size={18}
                                className={`text-brown-400 transition-transform duration-300 ${openDropdown === opt.label ? "rotate-180 text-coral-500" : "group-hover:text-coral-500"}`}
                              />
                            </button>
                            {openDropdown === opt.label && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-[#1a1830] border border-brown-200 dark:border-amber-900/40 shadow-xl rounded-xl max-h-60 overflow-y-auto">
                                  {opt.options.map((o) => (
                                    <button
                                      key={o}
                                      type="button"
                                      className="w-full text-left px-5 py-3 hover:bg-cream-50 dark:hover:bg-amber-900/30 text-brown-800 dark:text-amber-100 transition-colors font-serif text-base"
                                      onClick={() => {
                                        setCustomizations((p) => ({
                                          ...p,
                                          [opt.label]: o,
                                        }));
                                        setOpenDropdown(null);
                                      }}
                                    >
                                      {o}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ) : opt.type === "text" ? (
                          <input
                            type="text"
                            placeholder="Scribble your message here..."
                            className={`w-full px-4 py-3 bg-white dark:bg-[#1a1612] border-2 ${customizations[opt.label] ? "border-coral-300 dark:border-amber-600/70 shadow-sm text-coral-700 dark:text-amber-400" : "border-cream-200 dark:border-amber-900/40 text-brown-900 dark:text-amber-100"} rounded-xl font-serif text-base placeholder:text-brown-400 dark:placeholder:text-amber-100/40 placeholder:italic focus:outline-none focus:border-coral-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-coral-500/10 dark:focus:ring-amber-500/10 transition-all`}
                            style={
                              customizations[opt.label]
                                ? {
                                    fontFamily: "var(--font-hand)",
                                    fontSize: 24,
                                  }
                                : {}
                            }
                            value={customizations[opt.label] || ""}
                            onChange={(e) =>
                              setCustomizations((p) => ({
                                ...p,
                                [opt.label]: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <div className="flex items-center gap-4 bg-white dark:bg-[#1a1612] border-2 border-cream-200 dark:border-amber-900/40 rounded-xl p-2 pl-4 shadow-sm">
                            <span
                              className="text-coral-700 dark:text-amber-400 flex-1 truncate"
                              style={{
                                fontFamily: "var(--font-hand)",
                                fontSize: 24,
                                lineHeight: 1,
                              }}
                            >
                              {customizations[opt.label] || "Choose a color:"}
                            </span>
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-brown-200 dark:border-amber-900/40 shadow-inner shrink-0">
                              <input
                                type="color"
                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                value={customizations[opt.label] || "#d97706"}
                                onChange={(e) =>
                                  setCustomizations((p) => ({
                                    ...p,
                                    [opt.label]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Quantity */}
                  <div className="order-config-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-[rgba(232,93,74,0.15)] dark:border-amber-900/40 shadow-sm transition-all hover:border-coral-300 dark:hover:border-amber-800/60 hover:shadow-md">
                    <label className="block text-sm font-bold uppercase tracking-[0.15em] text-brown-800 dark:text-amber-100 flex items-center gap-2.5 font-serif">
                      <span className="text-forest-600 dark:text-amber-400 text-[18px] leading-none -mt-0.5">
                        ✦
                      </span>
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center border border-[rgba(122,80,40,0.25)] dark:border-amber-900/40 rounded-xl bg-white dark:bg-[#1a1612] shadow-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-11 h-11 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-100/50 dark:hover:bg-amber-900/20 rounded-l-xl transition-all"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span
                          className="w-12 text-center font-bold text-brown-900 dark:text-amber-100 select-none"
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 28,
                            marginTop: -4,
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
                          className="w-11 h-11 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-100/50 dark:hover:bg-amber-900/20 rounded-r-xl transition-all"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {product.stockCount < 10 && product.inStock && (
                        <span
                          className="text-amber-700 dark:text-amber-400 whitespace-nowrap"
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 16,
                          }}
                        >
                          only {product.stockCount} left!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Primary actions ── */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-coral-600 hover:bg-coral-700 text-white font-bold rounded-xl shadow-[0_10px_24px_rgba(232,93,74,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(232,93,74,0.45)] transition-all disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  letterSpacing: "0.03em",
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
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  favorite
                    ? "border-coral-400 bg-coral-50 dark:bg-coral-900/20 text-coral-600"
                    : "border-[rgba(122,80,40,0.25)] dark:border-amber-900/30 text-brown-500 dark:text-amber-100/50 hover:border-coral-400 hover:text-coral-500"
                }`}
                aria-label={
                  favorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart size={20} className={favorite ? "fill-current" : ""} />
              </button>
            </div>

            {/* Extra buttons */}
            {extras.length > 0 && (
              <div className="flex flex-col gap-2.5 mb-8">
                {extras.map((b) => {
                  const base =
                    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5";
                  const cls =
                    b.variant === "primary"
                      ? `${base} bg-coral-600 hover:bg-coral-700 text-white shadow-lg`
                      : b.variant === "outline"
                        ? `${base} bg-white dark:bg-[#14110e] border-2 border-cream-200 dark:border-amber-900/40 text-brown-900 dark:text-amber-100 hover:border-coral-300 dark:hover:border-amber-700/80 hover:bg-cream-50 dark:hover:bg-[#1a1612]`
                        : `${base} bg-amber-50 dark:bg-[#1a1612] border-2 border-dashed border-amber-300 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-[#241e18] hover:border-amber-400 dark:hover:border-amber-700/80`;
                  const internal = b.href.startsWith("/");
                  const children = (
                    <>
                      {b.label}
                      <ArrowRight size={14} />
                    </>
                  );
                  return internal ? (
                    <Link key={b.id} href={b.href} className={cls}>
                      {children}
                    </Link>
                  ) : (
                    <a
                      key={b.id}
                      href={b.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cls}
                    >
                      {children}
                    </a>
                  );
                })}
              </div>
            )}

            {/* ── Trust notes ── */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-8 mt-4 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20">
              <PostageStamp
                label="Shipping"
                denom={
                  <span className="flex items-center justify-center gap-1.5 mt-0.5">
                    <Truck size={14} strokeWidth={2} className="opacity-80" />
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
                    <Shield size={14} strokeWidth={2} className="opacity-80" />
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
        {sections.length > 0 && <ProductTabs sections={sections} />}
      </div>
    </div>
  );
}

function ProductTabs({
  sections,
}: {
  sections: NonNullable<Product["additionalSections"]>;
}) {
  const [active, setActive] = useState(0);
  const section = sections[active] ?? sections[0];
  const hasImage = !!section?.image;

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
                  : "bg-[#f5ecda] dark:bg-amber-950/40 border-cream-200 dark:border-amber-900/30 text-brown-600 dark:text-amber-100/60 hover:bg-[#eaddc1] dark:hover:bg-amber-900/60 z-0"
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
              {s.heading || `Section ${i + 1}`}
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
            className={`grid gap-8 md:gap-12 items-start relative z-10 ${hasImage ? "md:grid-cols-2" : "max-w-3xl"}`}
          >
            {hasImage && (
              <div
                className="relative craft-polaroid mx-auto w-full"
                style={{ padding: "10px 10px 40px", maxWidth: 380 }}
              >
                <Tape
                  color="amber"
                  width={60}
                  height={18}
                  rotate={-3}
                  className="absolute top-[-9px] left-1/2 -translate-x-1/2"
                />
                <div className="relative w-full aspect-[4/3] bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden">
                  <Image
                    src={section.image || ""}
                    alt={section.heading}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div
              className="prose dark:prose-invert max-w-none text-brown-800 dark:text-amber-100/80 [&>p]:mt-0 [&>p]:mb-[32px]"
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: "26px", // Increased text size
                lineHeight: "32px", // Matched to background ruled lines
              }}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
