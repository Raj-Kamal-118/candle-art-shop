"use client";

import Link from "next/link";
import { Tag, Truck } from "lucide-react";
import { formatPrice, getShippingCost } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  discountCode?: string;
  showCheckoutButton?: boolean;
}

export default function CartSummary({
  subtotal,
  discount = 0,
  discountCode,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const shipping = getShippingCost(subtotal - discount);
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
      <h2 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-5">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
          <span>Subtotal</span>
          <span className="font-medium text-brown-900 dark:text-amber-100">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-500">
            <span className="flex items-center gap-1.5">
              <Tag size={13} />
              Discount {discountCode && `(${discountCode})`}
            </span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
          <span className="flex items-center gap-1.5">
            <Truck size={13} />
            Shipping
          </span>
          <span className="font-medium text-brown-900 dark:text-amber-100">
            {shipping === 0 ? (
              <span className="text-green-600 dark:text-green-500">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {subtotal < 999 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            Add {formatPrice(999 - subtotal)} more for free shipping!
          </p>
        )}

        {subtotal < 1500 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            Add {formatPrice(1500 - subtotal)} more for a free Greeting Card!
          </p>
        )}

        <div className="border-t border-cream-200 dark:border-amber-900/30 pt-3 flex justify-between font-bold text-base">
          <span className="text-brown-900 dark:text-amber-100">Total</span>
          <span className="text-brown-900 dark:text-amber-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full text-center mt-5 bg-coral-600 dark:bg-amber-600 text-white py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
        >
          Proceed to Checkout
        </Link>
      )}

      <p className="mt-4 text-xs text-brown-400 dark:text-amber-100/50 text-center">
        Free returns · Secure checkout · 30-day guarantee
      </p>
    </div>
  );
}
