"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  isSaved?: boolean;
  index?: number;
  onRemoved?: (item: CartItemType) => void;
}

export default function CartItemComponent({
  item,
  isSaved = false,
  index = 0,
  onRemoved,
}: CartItemProps) {
  const {
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
  } = useStore();

  const rotate = index % 2 === 0 ? -2 : 2;
  const customizations = item.customizations ?? {};
  const hasCustomizations = Object.keys(customizations).length > 0;
  const unitPrice = item.price ?? item.product.price;
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="craft-perf flex gap-3 sm:gap-6 py-4 sm:py-6 pl-4 sm:pl-8 pr-4 sm:pr-6 border-b border-[rgba(122,80,40,0.18)] dark:border-amber-900/20 last:border-b-0 relative">
      {/* ── Polaroid photo ── */}
      <div className="flex-shrink-0 self-start mt-1">
        <div
          className="craft-polaroid w-[84px] sm:w-[124px]"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <Link href={`/products/${item.product.slug}`}>
            <div
              className="relative z-0 bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden w-[74px] h-[74px] sm:w-[114px] sm:h-[114px]"
            >
              {item.product.images?.[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="(max-width: 640px) 74px, 114px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🎁
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.product.slug}`}>
              <h3
                className="font-bold leading-snug text-brown-900 dark:text-amber-50 hover:text-coral-600 dark:hover:text-amber-400 transition-colors line-clamp-2"
                style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}
              >
                {item.product.name}
              </h3>
            </Link>

            {/* Customization opts pills */}
            {hasCustomizations && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(customizations).map(([k, v]) => (
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
                      {v}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price stack */}
          <div className="text-right shrink-0">
            <div
              className="font-black text-brown-900 dark:text-amber-100 leading-none"
              style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
            >
              {formatPrice(totalPrice)}
            </div>
            {item.quantity > 1 && (
              <div
                className="text-brown-400 dark:text-amber-100/40 mt-1"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 11,
                }}
              >
                {formatPrice(unitPrice)} each
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: qty + actions ── */}
        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-[rgba(122,80,40,0.12)] dark:border-amber-900/15">
          {/* Qty stepper */}
          {!isSaved ? (
            <div className="inline-flex items-center border border-[rgba(122,80,40,0.25)] dark:border-amber-900/40 rounded-xl bg-white dark:bg-[#12101e] shadow-sm">
              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.quantity - 1,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="w-8 h-8 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span
                className="w-8 text-center font-bold text-brown-900 dark:text-amber-100 select-none"
                style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.quantity + 1,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="w-8 h-8 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isSaved ? (
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
                <Bookmark size={14} />
                <span className="hidden sm:inline">Save for later</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  moveToCart(item.product.id, item.customizations, item.giftSet)
                }
                className="flex items-center gap-1.5 text-sm font-medium text-coral-600 dark:text-amber-400 hover:text-coral-700 dark:hover:text-amber-300 transition-colors"
              >
                <Bookmark size={14} />
                Move to cart
              </button>
            )}

            <button
              onClick={() => {
                if (isSaved) {
                  removeSavedItem(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  );
                } else {
                  removeFromCart(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  );
                  onRemoved?.(item);
                }
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-brown-400 hover:text-red-500 dark:text-amber-100/50 dark:hover:text-red-400 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
