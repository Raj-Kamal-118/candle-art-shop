"use client";

import { X } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface PickedChipProps {
  product: Product;
  qty?: number;
  onRemove?: () => void;
}

export default function PickedChip({ product, qty, onRemove }: PickedChipProps) {
  const image = product.images?.[0] ?? "";
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2"
      style={{ background: "#fefdf8", border: "1px solid #e8dfc8" }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={product.name} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0 text-lg">🎁</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold truncate" style={{ color: "#1c1209" }}>{product.name}</div>
        <div className="text-xs" style={{ color: "#7c5c3a" }}>
          {formatPrice(product.price)}{qty && qty > 1 ? ` × ${qty}` : ""}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center flex-shrink-0 p-1 rounded"
          style={{ background: "transparent", border: 0, color: "#9c7c5c", cursor: "pointer" }}
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
