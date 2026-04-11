"use client";

import Link from "next/link";
import { Trash2, Bookmark, Minus, Plus } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  isSaved?: boolean;
}

export default function CartItemComponent({
  item,
  isSaved = false,
}: CartItemProps) {
  const { removeFromCart, updateQuantity, saveForLater, moveToCart, removeSavedItem } =
    useStore();

  return (
    <div className="flex gap-4 py-5 border-b border-cream-200 last:border-0">
      <Link href={`/products/${item.product.id}`}>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream-100 shrink-0">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.product.id}`}>
              <h3 className="font-semibold text-brown-900 text-sm hover:text-amber-700 transition-colors line-clamp-2">
                {item.product.name}
              </h3>
            </Link>
            {item.customizations &&
              Object.entries(item.customizations).length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {Object.entries(item.customizations).map(([k, v]) => (
                    <p key={k} className="text-xs text-brown-500">
                      {k}: <span className="font-medium">{v}</span>
                    </p>
                  ))}
                </div>
              )}
          </div>
          <p className="font-bold text-brown-900 shrink-0">
            {formatPrice((item.price ?? item.product.price) * item.quantity)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          {!isSaved ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="w-7 h-7 rounded-full border border-brown-300 flex items-center justify-center text-brown-600 hover:border-amber-500 hover:text-amber-700 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-brown-900">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="w-7 h-7 rounded-full border border-brown-300 flex items-center justify-center text-brown-600 hover:border-amber-500 hover:text-amber-700 transition-colors"
              >
                <Plus size={12} />
              </button>
              <span className="text-xs text-brown-400 ml-1">
                × {formatPrice(item.price ?? item.product.price)}
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {!isSaved ? (
              <button
                onClick={() => saveForLater(item.product.id)}
                className="flex items-center gap-1 text-xs text-brown-500 hover:text-amber-700 transition-colors"
              >
                <Bookmark size={13} />
                Save for Later
              </button>
            ) : (
              <button
                onClick={() => moveToCart(item.product.id)}
                className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                Move to Cart
              </button>
            )}
            <button
              onClick={() =>
                isSaved
                  ? removeSavedItem(item.product.id)
                  : removeFromCart(item.product.id)
              }
              className="p-1.5 text-brown-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
