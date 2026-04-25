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
      className="relative rounded-2xl cursor-pointer transition-all duration-200"
      style={{
        background: "#fff",
        border: has ? "2px solid #d97706" : "1px solid #e8dfc8",
        padding: 12,
        boxShadow: has
          ? "0 8px 20px -8px rgba(217,119,6,.3)"
          : "0 1px 3px rgba(45,31,20,.06)",
      }}
    >
      <div
        className="relative w-full aspect-square rounded-xl overflow-hidden mb-2"
        style={{ background: "#f9f5ee" }}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🎁
          </div>
        )}
        {has && (
          <div
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: "#d97706",
              boxShadow: "0 4px 10px -2px rgba(45,31,20,.3)",
            }}
          >
            {count}
          </div>
        )}
      </div>

      <div
        className="text-sm font-semibold leading-tight mb-0.5 line-clamp-2"
        style={{ color: "#1c1209" }}
      >
        {product.name}
      </div>
      <div className="flex items-center justify-between gap-1 mt-1">
        <div className="text-xs truncate" style={{ color: "#7c5c3a" }}>
          {product.tags?.[0] ?? product.description?.slice(0, 24) ?? ""}
        </div>
        <div
          className="text-sm font-bold flex-shrink-0"
          style={{ color: "#1c1209" }}
        >
          {formatPrice(product.price)}
        </div>
      </div>

      {has && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-sm text-white"
          style={{
            background: "rgba(45,31,20,.65)",
            backdropFilter: "blur(4px)",
            border: 0,
            lineHeight: 1,
            cursor: "pointer",
          }}
          aria-label="Remove one"
        >
          –
        </button>
      )}
    </div>
  );
}
