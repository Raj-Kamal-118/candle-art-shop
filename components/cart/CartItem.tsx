"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Bookmark, Minus, Plus } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  isSaved?: boolean;
  onRemoved?: (item: CartItemType) => void;
}

export default function CartItemComponent({
  item,
  isSaved = false,
  onRemoved,
}: CartItemProps) {
  const {
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
  } = useStore();

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-cream-200 dark:border-amber-900/20 last:border-b-0">
      <Link href={`/products/${item.product.slug}`}>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 shrink-0 shadow-sm">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.product.slug}`}>
              <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-50 hover:text-coral-600 dark:hover:text-amber-400 transition-colors leading-tight line-clamp-2">
                {item.product.name}
              </h3>
            </Link>
            {item.customizations &&
              Object.entries(item.customizations).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(item.customizations).map(([k, v]) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-cream-50 dark:bg-amber-900/20 text-brown-600 dark:text-amber-100/70 border border-cream-200 dark:border-amber-900/30"
                    >
                      <span className="opacity-70">{k}:</span> {v}
                    </span>
                  ))}
                </div>
              )}
          </div>
          <div className="font-bold text-brown-900 dark:text-amber-100 shrink-0 text-right mt-1 sm:mt-0">
            {formatPrice((item.price ?? item.product.price) * item.quantity)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 sm:mt-auto pt-2">
          {!isSaved ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.quantity - 1,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="w-8 h-8 rounded-full border border-cream-300 dark:border-amber-900/40 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:border-coral-500 dark:hover:border-amber-400 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-brown-900 dark:text-amber-100">
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
                className="w-8 h-8 rounded-full border border-cream-300 dark:border-amber-900/40 flex items-center justify-center text-brown-600 dark:text-amber-100/70 hover:border-coral-500 dark:hover:border-amber-400 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
              >
                <Plus size={12} />
              </button>
              <span className="text-xs font-medium text-brown-400 dark:text-amber-100/40 ml-1">
                × {formatPrice(item.price ?? item.product.price)}
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {!isSaved ? (
              <button
                onClick={() =>
                  saveForLater(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="group flex items-center gap-1.5 text-sm font-medium text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-all"
              >
                <Bookmark
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                <span className="hidden sm:inline">Save for later</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  moveToCart(item.product.id, item.customizations, item.giftSet)
                }
                className="group flex items-center gap-1.5 text-sm font-medium text-coral-600 dark:text-amber-400 hover:text-coral-700 dark:hover:text-amber-300 transition-all"
              >
                <Bookmark
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                Move to Cart
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
              className="group flex items-center justify-center p-2 text-brown-400 hover:text-red-600 dark:text-amber-100/40 dark:hover:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              aria-label="Remove item"
              title="Remove from cart"
            >
              <Trash2
                size={22}
                className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
