"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, Bookmark, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { GS_BOXES, GS_RIBBONS } from "@/lib/stores/giftBuilderStore";
import { CartItem } from "@/lib/types";

export default function GiftSetCartItem({
  item,
  index,
  onRemoved,
}: {
  item: CartItem;
  index: number;
  onRemoved?: (item: CartItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const saveForLater = useStore((s) => s.saveForLater);
  const price = item.price ?? item.product.price;
  const gs = item.giftSet;
  const picks = gs?.picks ?? [];
  const ribbonLabel =
    GS_RIBBONS.find((r) => r.id === gs?.ribbon)?.label ?? gs?.ribbon ?? "";
  const boxLabel =
    GS_BOXES.find((b) => b.id === gs?.box)?.label ?? gs?.box ?? "";
  const rotate = index % 2 === 0 ? -2 : 2;

  return (
    <div className="py-4 sm:py-6 pl-4 sm:pl-8 pr-4 sm:pr-6 relative after:absolute after:bottom-0 after:left-8 sm:after:left-16 after:right-8 sm:after:right-16 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(122,80,40,0.25)] dark:after:via-amber-900/30 after:to-transparent last:after:hidden">
      <div className="flex items-start gap-3 sm:gap-6">
        <div className="flex-shrink-0 self-start mt-1">
          <div
            className="craft-polaroid w-[84px] sm:w-[124px]"
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <div className="relative z-0 bg-gradient-to-br from-amber-100 to-coral-100 dark:from-amber-900/60 dark:to-coral-900/30 overflow-hidden w-[74px] h-[74px] sm:w-[114px] sm:h-[114px]">
              <Image
                src="/images/misc/gift-box.png"
                alt="Gift Box"
                fill
                sizes="(max-width: 640px) 74px, 114px"
                className="object-contain scale-110 p-1 drop-shadow-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                }}
              >
                {gs?.kind === "custom" ? "Custom Gift Set" : "Gift Set"}
              </div>
              <Link
                href="/custom/gift-set"
                className="ah-body font-serif font-bold text-brown-900 dark:text-amber-50 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
              >
                {item.product.name}
              </Link>
              {gs?.card.recipient && (
                <p className="mt-1 font-serif italic text-[12px] text-brown-500 dark:text-amber-100/50">
                  For{" "}
                  <span className="font-medium text-brown-600 dark:text-amber-100/70">
                    {gs.card.recipient}
                  </span>
                </p>
              )}
              {gs && (ribbonLabel || boxLabel) && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {boxLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ah-caption bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30">
                      📦 {boxLabel}
                    </span>
                  )}
                  {ribbonLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ah-caption bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30">
                      🎀 {ribbonLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div
                className="font-black text-brown-900 dark:text-amber-100 leading-none"
                style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
              >
                {formatPrice(price)}
              </div>
              {picks.length > 0 && (
                <div
                  className="text-brown-400 dark:text-amber-100/40 mt-1"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 11,
                  }}
                >
                  {picks.reduce((s, p) => s + p.qty, 0)} items
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-[rgba(122,80,40,0.12)] dark:border-amber-900/15">
            {picks.length > 0 ? (
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span className="hidden xs:inline">
                  {open ? "Hide contents" : "View contents"}
                </span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() =>
                  saveForLater(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="flex items-center gap-1.5 text-sm font-medium text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-colors"
              >
                <Bookmark size={20} />
              </button>
              <button
                onClick={() => {
                  removeFromCart(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  );
                  onRemoved?.(item);
                }}
                className="flex items-center gap-1.5 text-sm font-medium text-brown-400 hover:text-red-500 dark:text-amber-100/50 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {open && picks.length > 0 && (
        <div className="mt-5 ml-0 sm:ml-[116px] rounded-xl border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30 overflow-hidden bg-cream-50 dark:bg-[#0f0e1c]">
          {picks.map((pick, i) => (
            <div
              key={`${pick.id}-${i}`}
              className="flex items-start sm:items-center gap-3 px-3 sm:px-4 py-3 border-b border-[rgba(122,80,40,0.10)] dark:border-amber-900/15 last:border-b-0"
            >
              {pick.image ? (
                <div className="relative w-10 h-10 mt-0.5 sm:mt-0 rounded-lg flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden">
                  <Image
                    src={pick.image}
                    alt={pick.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 mt-0.5 sm:mt-0 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-lg flex-shrink-0">
                  🎁
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold text-brown-900 dark:text-amber-100 leading-snug pr-2"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
                >
                  {pick.name}
                  {pick.qty > 1 && (
                    <span className="text-brown-400 dark:text-amber-100/50 font-medium ml-1.5">
                      × {pick.qty}
                    </span>
                  )}
                </div>
                {(pick as any).customization &&
                  Object.keys((pick as any).customization).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries((pick as any).customization).map(
                        ([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/70 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            <span className="opacity-60">{k}:</span>{" "}
                            <span
                              className="text-coral-700 dark:text-amber-400"
                              style={{ fontStyle: "italic" }}
                            >
                              {String(v)}
                            </span>
                          </span>
                        ),
                      )}
                    </div>
                  )}
                <div
                  className="text-brown-400 dark:text-amber-100/50 mt-0.5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 11,
                  }}
                >
                  {formatPrice(pick.price)}
                </div>
              </div>
              <div
                className="font-bold text-brown-900 dark:text-amber-100 shrink-0 mt-0.5 sm:mt-0"
                style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
              >
                {formatPrice(pick.price * pick.qty)}
              </div>
            </div>
          ))}
          {gs?.card.note && (
            <div className="px-5 py-4 bg-amber-50/80 dark:bg-[#1a1830] border-t border-amber-100 dark:border-amber-900/40">
              <div
                className="text-amber-900 dark:text-amber-200/90 leading-relaxed"
                style={{ fontFamily: "var(--font-hand)", fontSize: 18 }}
              >
                &ldquo;{gs.card.note}&rdquo;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
