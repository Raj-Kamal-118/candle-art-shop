"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { Product, Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice, getVariantPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { useProductData } from "./ProductProvider";

// Minimal lucide name → icon lookup for characteristic chips.
const ICONS: Record<string, any> = {
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
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;

    const finalCustomizations = { ...customizations };
    if (product.customizable && product.customizationOptions) {
      product.customizationOptions.forEach((opt) => {
        if (!finalCustomizations[opt.label]) {
          if (opt.type === "color") {
            finalCustomizations[opt.label] = "#d97706";
          } else if (
            opt.type === "select" &&
            opt.options &&
            opt.options.length > 0
          ) {
            finalCustomizations[opt.label] = opt.options[0];
          } else if (opt.type === "text") {
            finalCustomizations[opt.label] = "";
          }
        }
      });
    }

    setCustomizations(finalCustomizations);
    addToCart(product, quantity, finalCustomizations);
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
        <nav className="flex items-center gap-2 text-xs text-brown-500 dark:text-amber-100/50 mb-8">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-700">
            Shop
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-amber-700"
              >
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brown-900 dark:text-amber-100 truncate">
            {product.name}
          </span>
        </nav>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-brown-700 dark:text-amber-100/70 hover:text-coral-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 shadow-[0_16px_40px_rgba(28,18,9,0.08)] dark:shadow-amber-900/20"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-[#1a1830] ${
                      selectedImage === i
                        ? "border-coral-500 shadow-md scale-105"
                        : "relative border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="80px"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:py-2">
            {/* Category eyebrow + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em] hover:text-amber-800"
                >
                  {category.name}
                </Link>
              )}
              {product.featured && <Badge>Featured</Badge>}
              {product.customizable && (
                <Badge variant="info">Customizable</Badge>
              )}
              {!product.inStock && (
                <Badge variant="warning">Out of Stock</Badge>
              )}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 dark:text-amber-100 leading-[1.05] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < 4
                        ? "text-amber-400 fill-amber-400"
                        : "text-cream-300 dark:text-amber-900/40"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-brown-500 dark:text-amber-100/50">
                4.0 (24 reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-[32px] font-bold text-brown-900 dark:text-amber-100">
                {formatPrice(effectivePrice)}
              </span>
              {effectivePrice !== product.price && (
                <span className="text-sm text-brown-400 dark:text-amber-100/40 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.compareAtPrice && effectivePrice === product.price && (
                <>
                  <span className="text-lg text-brown-400 dark:text-amber-100/40 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <Badge variant="danger">{discount}% OFF</Badge>
                </>
              )}
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="prose dark:prose-invert max-w-none text-brown-700 dark:text-amber-100/70 leading-[1.7] mb-6"
            />

            {/* Characteristics */}
            {chars.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {chars.map((c) => {
                  const Icon = (c.icon && ICONS[c.icon.toLowerCase()]) || Flame;
                  return (
                    <div
                      key={c.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-9 h-9 rounded-full bg-coral-100 text-coral-700 flex items-center justify-center flex-none">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.15em] text-brown-500 dark:text-amber-100/50">
                          {c.label}
                        </div>
                        <div className="text-sm font-semibold text-brown-900 dark:text-amber-100 truncate">
                          {c.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Customization options */}
            {product.customizable &&
              product.customizationOptions &&
              product.customizationOptions.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400">
                    Customize your order
                  </h3>
                  {product.customizationOptions.map((opt) => (
                    <div key={opt.label}>
                      <label className="block text-sm font-medium text-brown-700 dark:text-amber-100/70 mb-1.5">
                        {opt.label}
                      </label>
                      {opt.type === "select" && opt.options ? (
                        <select
                          className="w-full px-3 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100"
                          value={customizations[opt.label] || ""}
                          onChange={(e) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              [opt.label]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select {opt.label}</option>
                          {opt.options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : opt.type === "text" ? (
                        <input
                          type="text"
                          placeholder={`Enter your ${opt.label.toLowerCase()}`}
                          className="w-full px-3 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100"
                          value={customizations[opt.label] || ""}
                          onChange={(e) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              [opt.label]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <input
                          type="color"
                          className="w-16 h-10 border border-brown-300 rounded-xl cursor-pointer"
                          value={customizations[opt.label] || "#d97706"}
                          onChange={(e) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              [opt.label]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-brown-700 dark:text-amber-100/70">
                Quantity
              </label>
              <div className="flex items-center border border-brown-300 dark:border-amber-900/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-brown-300 dark:border-amber-900/30 min-w-[3rem] text-center text-brown-900 dark:text-amber-100">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stockCount, quantity + 1))
                  }
                  className="px-3 py-2 text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {product.stockCount < 10 && (
                <span className="text-xs text-amber-700 font-medium">
                  Only {product.stockCount} in stock
                </span>
              )}
            </div>

            {/* Primary actions */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
              >
                <ShoppingCart size={18} />
                {addedToCart
                  ? "Added to cart!"
                  : !product.inStock
                    ? "Out of stock"
                    : "Add to cart"}
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  favorite
                    ? "border-coral-400 bg-coral-50 text-coral-600"
                    : "border-brown-300 dark:border-amber-900/30 text-brown-500 dark:text-amber-100/50 hover:border-coral-400 hover:text-coral-500"
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
                      ? `${base} bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30`
                      : b.variant === "outline"
                        ? `${base} border-2 border-brown-300 dark:border-amber-900/30 text-brown-900 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-500`
                        : `${base} border-2 border-dashed border-amber-400 text-amber-800 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20`;
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

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-200 dark:border-amber-900/30">
              {[
                { icon: Truck, label: "Free shipping", sub: "Over ₹2,499" },
                {
                  icon: Shield,
                  label: "Secure payment",
                  sub: "100% protected",
                },
                {
                  icon: RotateCcw,
                  label: "Easy returns",
                  sub: "48-hour policy",
                },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center text-center gap-1.5"
                  >
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                      <Icon
                        size={16}
                        className="text-amber-700 dark:text-amber-400"
                      />
                    </div>
                    <p className="text-xs font-semibold text-brown-800 dark:text-amber-100">
                      {badge.label}
                    </p>
                    <p className="text-[11px] text-brown-500 dark:text-amber-100/50">
                      {badge.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-cream-100 dark:bg-amber-900/20 text-brown-600 dark:text-amber-100/70 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional sections as tabs */}
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
    <section className="py-12 border-t border-cream-200 dark:border-amber-900/30">
      {/* Tab selector */}
      <div
        role="tablist"
        className="flex gap-2 flex-wrap border-b border-cream-200 dark:border-amber-900/30 mb-8"
      >
        {sections.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`relative px-5 py-3 font-serif text-lg md:text-xl transition-colors ${
                isActive
                  ? "text-brown-900 dark:text-amber-100"
                  : "text-brown-500 dark:text-amber-100/50 hover:text-brown-800 dark:hover:text-amber-100/80"
              }`}
            >
              {s.heading || `Section ${i + 1}`}
              {isActive && (
                <motion.span
                  layoutId="product-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-coral-600 dark:bg-amber-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="tabpanel"
        className={`grid gap-8 md:gap-12 items-start ${
          hasImage ? "md:grid-cols-2" : "max-w-3xl"
        }`}
      >
        {hasImage && (
          <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-cream-100 dark:bg-amber-900/10 shadow-sm">
            <div className="relative w-full h-full">
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
          className="prose dark:prose-invert max-w-none text-brown-700 dark:text-amber-100/70 leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: section.body }}
        />
      </motion.div>
    </section>
  );
}
