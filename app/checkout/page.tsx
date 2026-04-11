"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, MapPin, CreditCard, Tag } from "lucide-react";
import { useStore } from "@/lib/store";
import { Address, DiscountCode } from "@/lib/types";
import { formatPrice, getShippingCost, calculateDiscount } from "@/lib/utils";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import Button from "@/components/ui/Button";

type Step = "address" | "payment" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useStore();

  const [step, setStep] = useState<Step>("address");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = appliedDiscount
    ? calculateDiscount(subtotal, appliedDiscount.type, appliedDiscount.value)
    : 0;
  const shipping = getShippingCost(subtotal - discountAmount);
  const total = subtotal - discountAmount + shipping;

  if (cartItems.length === 0 && step !== "confirmation") {
    router.push("/cart");
    return null;
  }

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setApplyingDiscount(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error || "Invalid code");
      } else {
        setAppliedDiscount(data.discount);
        setDiscountCode(discountInput.toUpperCase());
        setDiscountInput("");
      }
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleAddressSubmit = (address: Address) => {
    setShippingAddress(address);
    setStep("payment");
  };

  const handlePlaceOrder = async (paymentMethod: "cod" | "qr") => {
    if (!shippingAddress) return;
    setPlacingOrder(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        customizations: item.customizations,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          discount: discountAmount,
          shipping,
          total,
          discountCode: discountCode || undefined,
          shippingAddress,
          billingAddress: shippingAddress,
          paymentMethod,
        }),
      });

      const order = await res.json();
      setOrderId(order.id);
      clearCart();
      setStep("confirmation");
    } finally {
      setPlacingOrder(false);
    }
  };

  const steps = [
    { id: "address", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirmation", label: "Confirmation", icon: CheckCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-brown-900 mb-8 text-center">
        Checkout
      </h1>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isPast =
            steps.findIndex((x) => x.id === step) > i;
          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-700 text-white"
                    : isPast
                    ? "bg-green-600 text-white"
                    : "bg-cream-200 text-brown-500"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-1 ${
                    isPast ? "bg-green-400" : "bg-cream-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === "confirmation" ? (
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-brown-900 mb-3">
            Order Confirmed!
          </h2>
          <p className="text-brown-500 mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-amber-700 font-medium mb-8">
            Order ID: {orderId}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/")} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                <h2 className="font-serif text-xl font-bold text-brown-900 mb-5">
                  Shipping Address
                </h2>
                <AddressForm onSubmit={handleAddressSubmit} />
              </div>
            )}

            {step === "payment" && shippingAddress && (
              <>
                {/* Address summary */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-brown-900 text-sm flex items-center gap-2">
                      <MapPin size={15} className="text-amber-600" />
                      Shipping to
                    </h3>
                    <button
                      onClick={() => setStep("address")}
                      className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-brown-700">
                    {shippingAddress.fullName}, {shippingAddress.address1}
                    {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""},{" "}
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                  <PaymentStep
                    total={total}
                    onSubmit={handlePlaceOrder}
                    loading={placingOrder}
                  />
                </div>
              </>
            )}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <OrderSummary
              items={cartItems}
              discount={discountAmount}
              discountCode={discountCode}
            />

            {/* Discount code */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
              <h3 className="font-semibold text-brown-900 text-sm mb-3 flex items-center gap-2">
                <Tag size={14} className="text-amber-600" />
                Discount Code
              </h3>
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      {discountCode}
                    </p>
                    <p className="text-xs text-green-600">
                      -{formatPrice(discountAmount)} saved
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedDiscount(null);
                      setDiscountCode("");
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyDiscount}
                    loading={applyingDiscount}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {discountError && (
                <p className="mt-2 text-xs text-red-600">{discountError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
