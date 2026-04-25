"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ItemPickProps {
  product: Product;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ItemPick({
  product,
  count,
  onAdd,
  onRemove,
}: ItemPickProps) {
  const has = count > 0;
  const image = product.images?.[0] ?? "";

  return (
    <div
      onClick={onAdd}
      className={`relative flex flex-col h-full p-3 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
        has
          ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20 shadow-md shadow-amber-500/10"
          : "border-cream-200 bg-white hover:border-amber-300 dark:border-amber-900/30 dark:bg-[#1a1830] dark:hover:border-amber-700 hover:shadow-sm"
      }`}
    >
      {has && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10"
          aria-label="Remove one"
        >
          –
        </button>
      )}

      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-cream-50 dark:bg-[#0f0e1c]">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎁
          </div>
        )}
        {has && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-amber-600 shadow-md">
            {count}
          </div>
        )}
      </div>

      <div className="text-sm font-semibold leading-tight mb-1.5 line-clamp-2 text-brown-900 dark:text-amber-100">
        {product.name}
      </div>

      {product.description && (
        <div
          className="text-xs text-brown-600 dark:text-amber-100/60 line-clamp-3 mb-3 [&>p]:mb-0 [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      <div className="flex items-center justify-between gap-1 mt-auto pt-1">
        <div className="text-[10px] truncate text-brown-500 dark:text-amber-100/50 uppercase tracking-widest font-semibold">
          {product.tags?.[0] ?? ""}
        </div>
        <div className="text-sm font-bold flex-shrink-0 text-brown-900 dark:text-amber-100">
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
}
