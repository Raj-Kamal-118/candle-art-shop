import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Tag } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  discount?: number;
  discountCode?: string;
  codFee?: number;
  shipping: number;
}

export default function OrderSummary({
  items,
  discount = 0,
  discountCode,
  codFee = 0,
  shipping,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );
  const total = subtotal - discount + shipping + codFee;

  return (
    <div className="bg-cream-50 dark:bg-[#151326] rounded-2xl p-5 border border-cream-200 dark:border-amber-900/30">
      <h3 className="font-serif font-bold text-brown-900 dark:text-amber-100 mb-4">
        Order Items ({items.reduce((s, i) => s + i.quantity, 0)})
      </h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => {
          const image = item.product.images?.[0];
          return (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-200 dark:bg-amber-900/40 shrink-0 flex items-center justify-center text-xl">
                {image ? (
                  <img
                    src={image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "🎁"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brown-900 dark:text-amber-100 line-clamp-1">
                  {item.product.name}
                </p>
                <p className="text-xs text-brown-500 dark:text-amber-100/60">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 shrink-0">
                {formatPrice(
                  (item.price ?? item.product.price) * item.quantity,
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-cream-200 dark:border-amber-900/30 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {discountCode}
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
            <span>Cash on Delivery</span>
            <span>{formatPrice(codFee)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-1 border-t border-cream-200 dark:border-amber-900/30">
          <span className="text-brown-900 dark:text-amber-100">Total</span>
          <span className="text-brown-900 dark:text-amber-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
