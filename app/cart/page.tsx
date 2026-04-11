"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cartItems, savedForLaterItems } = useStore();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="text-amber-700" size={40} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brown-900 mb-4">
          Your cart is empty
        </h1>
        <p className="text-brown-500 mb-8">
          Discover our handcrafted candles and artwork to fill it up.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-800 transition-colors shadow-sm"
        >
          Shop Now
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-brown-900 mb-8">
        Shopping Cart
        <span className="text-brown-400 font-sans font-normal text-base ml-3">
          ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            {cartItems.map((item) => (
              <CartItemComponent key={item.product.id} item={item} />
            ))}
          </div>

          {/* Saved for later */}
          {savedForLaterItems.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-bold text-brown-900 mb-4">
                Saved for Later ({savedForLaterItems.length})
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                {savedForLaterItems.map((item) => (
                  <CartItemComponent
                    key={item.product.id}
                    item={item}
                    isSaved
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
