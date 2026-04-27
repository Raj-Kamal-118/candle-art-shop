"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Truck,
  ArrowRight,
  Wrench,
  Package,
  RotateCcw,
} from "lucide-react";
import { CartGiftSet, GiftSet } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useGiftBuilderStore } from "@/lib/stores/giftBuilderStore";
import { useStore } from "@/lib/store";
import Badge from "@/components/ui/Badge";

export default function GiftSetDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [set, setSet] = useState<GiftSet | null>(null);
  const [loading, setLoading] = useState(true);
  const loadPremade = useGiftBuilderStore((s) => s.loadPremade);
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Find by slug — fetch all sets and match
    fetch("/api/gift-sets")
      .then((r) => r.json())
      .then(async (sets: GiftSet[]) => {
        const matched = sets.find((s) => s.slug === slug);
        if (!matched) return null;
        // Fetch full set with items
        const detail = await fetch(`/api/gift-sets/${matched.id}`).then((r) =>
          r.json(),
        );
        return detail as GiftSet;
      })
      .then((s) => setSet(s))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCustomise = () => {
    if (!set?.items) return;
    loadPremade(set.items.map((i) => i.id));
    router.push("/custom/gift-set");
  };

  const handleAddToCart = () => {
    if (!set) return;
    const items = set.items ?? [];
    const giftSetData: CartGiftSet = {
      kind: "premade",
      setId: set.id,
      picks: items.map((p) => ({
        id: p.id,
        qty: 1,
        name: p.name,
        image: p.images?.[0] ?? "",
        price: p.price,
      })),
      ribbon: "cream",
      box: "kraft",
      card: { style: "card-min", recipient: "", note: "" },
    };
    const syntheticProduct = {
      id: `giftset-${set.id}`,
      name: set.name,
      slug: set.slug,
      description: set.description || set.tagline || "",
      price: set.price,
      compareAtPrice: set.price + set.saving,
      categoryId: "",
      images: set.image ? [set.image] : [],
      tags: set.occasions,
      inStock: true,
      stockCount: 999,
      featured: false,
      customizable: false,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
    };
    addToCart(syntheticProduct, 1, undefined, giftSetData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] min-h-screen pt-10 lg:pt-16 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
          <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-48 mb-14 animate-pulse" />
          <div className="animate-pulse grid lg:grid-cols-2 gap-12 xl:gap-16">
            <div className="aspect-square bg-cream-200 dark:bg-amber-900/20 rounded-3xl" />
            <div className="space-y-6 pt-4">
              <div className="h-6 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
              <div className="h-12 bg-cream-200 dark:bg-amber-900/20 rounded w-3/4" />
              <div className="h-8 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!set) {
    return (
      <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] max-w-[1440px] mx-auto px-4 py-20 text-center min-h-screen">
        <p className="text-brown-500 dark:text-amber-100/60 text-lg mb-4">
          Gift set not found.
        </p>
        <Link
          href="/gift-sets"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-xl text-sm font-semibold text-brown-900 dark:text-amber-100 hover:border-amber-400"
        >
          Back to gift sets
        </Link>
      </div>
    );
  }

  const items = set.items ?? [];
  const individualTotal = items.reduce((s, i) => s + i.price, 0);

  const allImages = [
    { id: "set-main", url: set.image, alt: set.name, fallback: "🎁" },
    ...items.map((it) => ({
      id: it.id,
      url: it.images?.[0],
      alt: it.name,
      fallback: "🕯️",
    })),
  ];
  const currentView = allImages[activeIndex] || allImages[0];

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs text-brown-500 dark:text-amber-100/50 mb-8">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/gift-sets" className="hover:text-amber-700">
            Gift Sets
          </Link>
          <span>/</span>
          <span className="text-brown-900 dark:text-amber-100 truncate">
            {set.name}
          </span>
        </nav>

        <button
          onClick={() => router.push("/gift-sets")}
          className="inline-flex items-center gap-2 text-sm text-brown-700 dark:text-amber-100/70 hover:text-coral-600 transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Back to gift sets
        </button>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
          {/* Left: images */}
          <div className="space-y-4">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 shadow-[0_16px_40px_rgba(28,18,9,0.08)] dark:shadow-amber-900/20"
            >
              {currentView.url ? (
                <Image
                  src={currentView.url}
                  alt={currentView.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[80px]">
                  {currentView.fallback}
                </div>
              )}
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={`${img.id}-${i}`}
                    onClick={() => setActiveIndex(i)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-[#1a1830] ${
                      activeIndex === i
                        ? "border-coral-500 shadow-md scale-105"
                        : "relative border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="80px"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {img.fallback}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="lg:py-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
                {set.occasions.join(" · ")}
              </span>
              <Badge variant="info">Curated Set</Badge>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 dark:text-amber-100 leading-[1.05] mb-4">
              {set.name}
            </h1>

            {set.tagline && (
              <p className="font-serif italic text-xl text-coral-600 dark:text-amber-400 mb-5">
                &ldquo;{set.tagline}&rdquo;
              </p>
            )}

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-[32px] font-bold text-brown-900 dark:text-amber-100">
                {formatPrice(set.price)}
              </span>
              {set.saving > 0 && (
                <>
                  <span className="text-lg text-brown-400 dark:text-amber-100/40 line-through">
                    {formatPrice(individualTotal)}
                  </span>
                  <Badge
                    variant="success"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                  >
                    Save {formatPrice(set.saving)}
                  </Badge>
                </>
              )}
            </div>

            {set.description && (
              <p className="text-brown-700 dark:text-amber-100/70 leading-[1.7] mb-8 text-base">
                {set.description}
              </p>
            )}

            {/* What's inside */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 mb-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-5 flex items-center gap-2">
                  <Package
                    size={20}
                    className="text-amber-600 dark:text-amber-500"
                  />
                  What's inside
                </h3>
                <div className="flex flex-col gap-4">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex gap-4 p-4 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-100 dark:border-amber-900/20"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                        {it.images?.[0] ? (
                          <Image
                            src={it.images[0]}
                            alt={it.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-amber-50 dark:bg-amber-900/30">
                            🕯️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-semibold text-brown-900 dark:text-amber-100 text-sm line-clamp-1">
                            {it.name}
                          </h4>
                          <span className="text-sm font-semibold text-brown-700 dark:text-amber-100/80 shrink-0">
                            {formatPrice(it.price)}
                          </span>
                        </div>
                        {it.description && (
                          <div
                            className="text-xs text-brown-600 dark:text-amber-100/70 line-clamp-2 mb-2 [&>p]:mb-0 [&>p]:inline leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: it.description }}
                          />
                        )}
                        {it.customizable && (
                          <Link
                            href={`/products/${it.slug}`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:text-coral-600 transition-colors"
                          >
                            <Wrench size={12} /> Customise this item
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Savings breakdown */}
                {set.saving > 0 && (
                  <div className="mt-5 pt-4 flex justify-between text-sm border-t border-cream-200 dark:border-amber-900/30">
                    <span className="text-brown-600 dark:text-amber-100/70 font-medium">
                      Individual items total
                    </span>
                    <span className="text-brown-400 dark:text-amber-100/40 line-through font-medium">
                      {formatPrice(individualTotal)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:-translate-y-0.5 ${
                  added
                    ? "bg-green-600 text-white shadow-green-200 dark:shadow-green-900/30"
                    : "bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-coral-200 dark:shadow-amber-900/30"
                }`}
              >
                {added ? (
                  "Added to Cart ✓"
                ) : (
                  <>
                    Add to Cart — {formatPrice(set.price)}{" "}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                onClick={handleCustomise}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 border-dashed border-amber-400 text-amber-800 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Sparkles size={16} /> Customise this set
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-cream-200 dark:border-amber-900/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Truck
                    size={18}
                    className="text-amber-700 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 mb-0.5">
                    Free Shipping
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/60 leading-relaxed">
                    Included free gift wrap & handwritten note.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                  <RotateCcw
                    size={18}
                    className="text-amber-700 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 mb-0.5">
                    Easy Returns
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/60 leading-relaxed">
                    48-hour return policy for peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
