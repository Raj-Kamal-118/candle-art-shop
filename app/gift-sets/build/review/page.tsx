"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles, Share2, Heart, ArrowRight } from "lucide-react";
import { CartGiftSet, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import BoxPreview from "@/components/gift-sets/BoxPreview";
import { useGiftBuilderStore, GS_RIBBONS, GS_BOXES, GS_CARDS } from "@/lib/stores/giftBuilderStore";
import { useStore } from "@/lib/store";

export default function ReviewPage() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [wrapping, setWrapping] = useState(false);
  const [wrapped, setWrapped] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { picks, ribbon, box, recipient, note, cardStyle, reset } = useGiftBuilderStore();
  const addToCart = useStore((s) => s.addToCart);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts);
  }, []);

  const resolvedProducts = picks.flatMap((p) =>
    Array(p.qty).fill(allProducts.find((pr) => pr.id === p.id)).filter(Boolean)
  ) as Product[];

  const subtotal = picks.reduce((total, p) => {
    const product = allProducts.find((pr) => pr.id === p.id);
    return total + (product ? product.price * p.qty : 0);
  }, 0);

  const card = GS_CARDS.find((c) => c.id === cardStyle) ?? GS_CARDS[0];
  const boxDef = GS_BOXES.find((b) => b.id === box) ?? GS_BOXES[0];
  const ribbonDef = GS_RIBBONS.find((r) => r.id === ribbon) ?? GS_RIBBONS[0];

  const doWrap = () => {
    setWrapping(true);
    setTimeout(() => setWrapped(true), 1200);
  };

  const handlePlaceOrder = () => {
    const setId = `custom-${Date.now()}`;
    const giftSetData: CartGiftSet = {
      kind: "custom",
      setId,
      picks: picks.map((p) => {
        const product = allProducts.find((pr) => pr.id === p.id);
        return {
          id: p.id,
          qty: p.qty,
          name: product?.name ?? p.id,
          image: product?.images?.[0] ?? "",
          price: product?.price ?? 0,
        };
      }),
      ribbon,
      box,
      card: { style: cardStyle, recipient, note },
    };

    const syntheticProduct = {
      id: `giftset-${setId}`,
      name: recipient ? `Gift set for ${recipient}` : "Your Custom Gift Set",
      slug: `custom-gift-set-${setId}`,
      description: note || "Custom gift set",
      price: subtotal,
      categoryId: "",
      images: [],
      tags: ["gift-set", "custom"],
      inStock: true,
      stockCount: 999,
      featured: false,
      customizable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addToCart(syntheticProduct, 1, undefined, giftSetData);
    reset();
    router.push("/cart");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://artisanhouse.in/gift/preview/ah-${Math.random().toString(36).slice(2, 8)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (picks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-brown-500 text-lg mb-4">Your box is empty.</p>
        <button
          onClick={() => router.push("/gift-sets/build")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
          style={{ background: "#1c1209", color: "#fefdf8" }}
        >
          <ArrowRight size={16} /> Build your set
        </button>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen pb-20"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #fef3c755, #fefdf8 60%)" }}
    >
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <button
          onClick={() => router.push("/gift-sets/build")}
          className="flex items-center gap-1.5 text-sm"
          style={{ background: "transparent", border: 0, color: "#7c5c3a", cursor: "pointer" }}
        >
          <ChevronLeft size={16} /> Keep editing
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">
        {/* LEFT: the box */}
        <div className="text-center lg:sticky lg:top-28">
          <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ letterSpacing: ".24em", color: "#b45309" }}>
            {wrapped ? "Ready to ship" : wrapping ? "Wrapping…" : "Your set · Final review"}
          </div>
          <h1
            className="font-serif mb-10"
            style={{ fontSize: 40, fontWeight: 500, color: "#1c1209", letterSpacing: "-.015em", lineHeight: 1.05 }}
          >
            {wrapped ? (
              "All tied up with love."
            ) : wrapping ? (
              <em style={{ fontStyle: "italic", color: "#c2522a" }}>Hold still…</em>
            ) : (
              "Beautiful. Shall we wrap it?"
            )}
          </h1>

          <div
            style={{
              transition: "transform .8s cubic-bezier(.22,1,.36,1)",
              transform: wrapping && !wrapped ? "rotate(-4deg) scale(.96)" : wrapped ? "rotate(2deg) scale(1.02)" : "rotate(0) scale(1)",
            }}
          >
            <BoxPreview
              items={resolvedProducts}
              ribbon={ribbon}
              box={box}
              recipient={recipient}
              wrap={wrapping && !wrapped}
              big
            />
          </div>

          {!wrapping && !wrapped && (
            <button
              onClick={doWrap}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
              style={{ background: "#1c1209", color: "#fefdf8" }}
            >
              Wrap my box <Sparkles size={16} />
            </button>
          )}

          {wrapped && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handlePlaceOrder}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base"
                style={{ background: "#1c1209", color: "#fefdf8" }}
              >
                Place order — {formatPrice(subtotal)} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm"
                style={{ background: "transparent", border: "1px solid #d4c9b4", color: "#1c1209" }}
              >
                <Share2 size={16} /> Share preview
              </button>
              <button
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm"
                style={{ background: "transparent", border: "1px solid #d4c9b4", color: "#1c1209" }}
              >
                <Heart size={16} /> Save for later
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: summary */}
        <div>
          {/* Gift card preview */}
          <div
            className="relative rounded-2xl mb-6"
            style={{ background: card.swatch, padding: "28px", boxShadow: "0 4px 16px rgba(45,31,20,.12)", minHeight: 180 }}
          >
            <div
              className="absolute top-3.5 right-3.5 text-xs uppercase tracking-widest opacity-60 font-medium"
              style={{ letterSpacing: ".2em", color: card.stroke }}
            >
              {card.label} card
            </div>
            <div className="text-xs uppercase tracking-widest mb-2.5 opacity-70" style={{ letterSpacing: ".2em", color: card.stroke }}>For</div>
            <div className="font-serif text-2xl font-medium mb-4" style={{ color: card.stroke, letterSpacing: "-.01em" }}>
              {recipient || "…"}
            </div>
            <div className="font-serif italic text-base leading-relaxed opacity-90" style={{ color: card.stroke }}>
              &ldquo;{note || "your kind words will go here"}&rdquo;
            </div>
            <div className="mt-4 text-xs font-serif italic opacity-60" style={{ color: card.stroke }}>— written by hand</div>
          </div>

          {/* Itemised summary */}
          <div className="rounded-2xl mb-4" style={{ background: "#fff", border: "1px solid #e8dfc8", padding: 20 }}>
            <div className="flex justify-between mb-4">
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ letterSpacing: ".2em", color: "#5c3d1e" }}>
                Inside the box
              </div>
              <div className="text-xs" style={{ color: "#9c7c5c" }}>{resolvedProducts.length} items</div>
            </div>
            <div className="flex flex-col gap-2.5">
              {picks.map((p) => {
                const product = allProducts.find((pr) => pr.id === p.id);
                if (!product) return null;
                const image = product.images?.[0] ?? "";
                return (
                  <div key={p.id} className="flex items-center gap-2.5">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">🎁</div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#1c1209" }}>
                        {product.name}{p.qty > 1 && <span className="font-normal ml-1" style={{ color: "#7c5c3a" }}>× {p.qty}</span>}
                      </div>
                      <div className="text-xs" style={{ color: "#7c5c3a" }}>{product.description?.slice(0, 60)}</div>
                    </div>
                    <div className="text-sm font-semibold flex-shrink-0" style={{ color: "#5c3d1e" }}>
                      {formatPrice(product.price * p.qty)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 flex flex-col gap-1.5" style={{ borderTop: "1px solid #e8dfc8" }}>
              <div className="flex justify-between text-sm" style={{ color: "#7c5c3a" }}>
                <span>Items subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: "#7c5c3a" }}>
                <span>Gift wrap</span><span style={{ color: "#15803d" }}>Free</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: "#7c5c3a" }}>
                <span>Handwritten note</span><span style={{ color: "#15803d" }}>Free</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 mt-1" style={{ borderTop: "1px solid #e8dfc8" }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ letterSpacing: ".15em", color: "#5c3d1e" }}>Total</span>
                <span className="font-serif text-2xl font-bold" style={{ color: "#1c1209" }}>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>

          {/* Wrap details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl" style={{ background: "#fff", border: "1px solid #e8dfc8" }}>
              <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>Box</div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ background: boxDef.color, border: "1px solid rgba(0,0,0,.1)" }} />
                <span className="text-sm font-semibold" style={{ color: "#1c1209" }}>{boxDef.label}</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: "#fff", border: "1px solid #e8dfc8" }}>
              <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>Ribbon</div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ background: ribbonDef.color, border: "1px solid rgba(0,0,0,.1)" }} />
                <span className="text-sm font-semibold" style={{ color: "#1c1209" }}>{ribbonDef.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ background: "rgba(45,31,20,.5)", backdropFilter: "blur(8px)" }}
          onClick={() => setShareOpen(false)}
        >
          <div
            className="rounded-2xl p-8 max-w-sm w-full text-center"
            style={{ background: "#fff", boxShadow: "0 24px 64px rgba(45,31,20,.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={28} className="mx-auto mb-3" style={{ color: "#b45309" }} />
            <h3 className="font-serif text-2xl font-medium mb-2" style={{ color: "#1c1209" }}>Share for group gifting</h3>
            <p className="text-sm mb-5" style={{ color: "#7c5c3a" }}>Send this preview so everyone can chip in.</p>
            <div
              className="px-3.5 py-3 rounded-xl text-xs mb-4 break-all"
              style={{ background: "#f9f5ee", color: "#5c3d1e", fontFamily: "ui-monospace, monospace" }}
            >
              artisanhouse.in/gift/preview/ah-{Math.random().toString(36).slice(2, 8)}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "#1c1209", color: "#fefdf8" }}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "transparent", border: "1px solid #d4c9b4", color: "#1c1209" }}
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
