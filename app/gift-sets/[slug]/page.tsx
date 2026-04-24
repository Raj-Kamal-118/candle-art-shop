"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles, Truck, ArrowRight, Wrench } from "lucide-react";
import { CartGiftSet, GiftSet } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useGiftBuilderStore } from "@/lib/stores/giftBuilderStore";
import { useStore } from "@/lib/store";

export default function GiftSetDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [set, setSet] = useState<GiftSet | null>(null);
  const [loading, setLoading] = useState(true);
  const loadPremade = useGiftBuilderStore((s) => s.loadPremade);
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Find by slug — fetch all sets and match
    fetch("/api/gift-sets")
      .then((r) => r.json())
      .then(async (sets: GiftSet[]) => {
        const matched = sets.find((s) => s.slug === slug);
        if (!matched) return null;
        // Fetch full set with items
        const detail = await fetch(`/api/gift-sets/${matched.id}`).then((r) => r.json());
        return detail as GiftSet;
      })
      .then((s) => setSet(s))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCustomise = () => {
    if (!set?.items) return;
    loadPremade(set.items.map((i) => i.id));
    router.push("/gift-sets/build");
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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-200 rounded w-2/3" />
            <div className="h-12 bg-cream-200 rounded w-full" />
            <div className="h-24 bg-cream-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!set) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-brown-500 text-lg mb-4">Gift set not found.</p>
        <Link href="/gift-sets" className="text-amber-700 font-medium">← Back to gift sets</Link>
      </div>
    );
  }

  const items = set.items ?? [];
  const individualTotal = items.reduce((s, i) => s + i.price, 0);

  return (
    <main style={{ background: "#fefdf8", paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <button
          onClick={() => router.push("/gift-sets")}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ background: "transparent", border: 0, color: "#7c5c3a", cursor: "pointer" }}
        >
          <ChevronLeft size={16} /> All gift sets
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: images */}
        <div className="lg:sticky lg:top-28">
          <div
            className="w-full rounded-2xl overflow-hidden shadow-lg"
            style={{ aspectRatio: "1/1.15", background: "#f9f5ee" }}
          >
            {set.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={set.image} alt={set.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">🎁</div>
            )}
          </div>

          {items.length > 0 && (
            <div className="grid grid-cols-4 gap-2.5 mt-3">
              {items.slice(0, 4).map((it) => (
                <div key={it.id} className="aspect-square rounded-lg overflow-hidden" style={{ background: "#fff", border: "1px solid #e8dfc8" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.images?.[0] ?? ""} alt={it.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: details */}
        <div>
          <div className="text-xs font-medium uppercase tracking-widest mb-2.5" style={{ letterSpacing: ".24em", color: "#b45309" }}>
            {set.occasions.join(" · ")}
          </div>

          <h1 className="font-serif mb-3" style={{ fontSize: 44, fontWeight: 500, color: "#1c1209", letterSpacing: "-.015em", lineHeight: 1.05 }}>
            {set.name}
          </h1>

          {set.tagline && (
            <p className="font-serif italic mb-5" style={{ fontSize: 19, color: "#c2522a", lineHeight: 1.4 }}>
              &ldquo;{set.tagline}&rdquo;
            </p>
          )}

          {set.description && (
            <p className="mb-7 leading-relaxed" style={{ fontSize: 15, color: "#5c3d1e", lineHeight: 1.7 }}>
              {set.description}
            </p>
          )}

          {/* Price block */}
          <div className="flex items-baseline gap-3 mb-7">
            <div className="text-4xl font-bold" style={{ color: "#1c1209" }}>{formatPrice(set.price)}</div>
            {set.saving > 0 && (
              <>
                <div className="text-base line-through" style={{ color: "#9c7c5c" }}>
                  {formatPrice(individualTotal)}
                </div>
                <div
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "#dcfce7", color: "#15803d" }}
                >
                  You save {formatPrice(set.saving)}
                </div>
              </>
            )}
          </div>

          {/* What's inside */}
          {items.length > 0 && (
            <div className="rounded-2xl mb-6" style={{ background: "#fff", border: "1px solid #e8dfc8", padding: 20 }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ letterSpacing: ".2em", color: "#7c5c3a" }}>
                What&apos;s inside
              </div>
              <div className="flex flex-col gap-3">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.images?.[0] ?? ""} alt={it.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#1c1209" }}>{it.name}</div>
                      <div className="text-xs" style={{ color: "#7c5c3a" }}>{it.description}</div>
                      {it.customizable && (
                        <Link
                          href={`/products/${it.slug}`}
                          className="inline-flex items-center gap-1 text-xs mt-0.5 font-medium"
                          style={{ color: "#b45309" }}
                        >
                          <Wrench size={10} /> Customise this item
                        </Link>
                      )}
                    </div>
                    <div className="text-sm font-semibold flex-shrink-0" style={{ color: "#5c3d1e" }}>
                      {formatPrice(it.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Savings breakdown */}
              {set.saving > 0 && (
                <div className="mt-4 pt-4 flex justify-between text-sm" style={{ borderTop: "1px solid #e8dfc8" }}>
                  <span style={{ color: "#7c5c3a" }}>Individual total</span>
                  <span className="line-through" style={{ color: "#9c7c5c" }}>{formatPrice(individualTotal)}</span>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base mb-3 transition-all"
            style={{
              background: added ? "#15803d" : "#1c1209",
              color: "#fefdf8",
            }}
          >
            {added ? "Added to bag ✓" : <>Add to bag — {formatPrice(set.price)} <ArrowRight size={16} /></>}
          </button>

          <button
            onClick={handleCustomise}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all"
            style={{
              background: "transparent",
              border: "1px dashed #b45309",
              color: "#b45309",
              cursor: "pointer",
            }}
          >
            <Sparkles size={16} /> Customise this set
          </button>

          {/* Shipping note */}
          <div className="mt-7 flex gap-3 items-start p-4 rounded-xl" style={{ background: "#f9f5ee" }}>
            <Truck size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#15803d" }} />
            <p className="text-sm leading-relaxed" style={{ color: "#5c3d1e" }}>
              <strong style={{ color: "#1c1209" }}>Free gift wrap &amp; handwritten note.</strong>{" "}
              Ships in 2–3 days. Delivered in 4–6 days across India.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
