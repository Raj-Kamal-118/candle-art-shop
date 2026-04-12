"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  CreditCard,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Address, DiscountCode, User } from "@/lib/types";
import { formatPrice, getShippingCost, calculateDiscount } from "@/lib/utils";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";

type Step = "address" | "payment" | "confirmation";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart, currentUser, setCurrentUser } = useStore();

  const [step, setStep] = useState<Step>("address");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null,
  );
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<User | null>(currentUser);

  // Sync verifiedUser with store
  useEffect(() => {
    if (currentUser) setVerifiedUser(currentUser);
  }, [currentUser]);

  // Handle returning from PhonePe Gateway
  useEffect(() => {
    const callbackOrderId = searchParams.get("order");
    const callbackStatus = searchParams.get("status");
    const callbackRef = searchParams.get("ref");

    if (callbackOrderId && callbackStatus === "SUCCESS") {
      setOrderId(callbackOrderId);
      if (callbackRef) setPaymentRef(callbackRef);
      clearCart();
      setStep("confirmation");
    } else if (callbackStatus === "FAILED") {
      setPaymentError("Payment failed or was cancelled. Please try again.");
    }
  }, [searchParams, clearCart]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );
  const discountAmount = appliedDiscount
    ? calculateDiscount(subtotal, appliedDiscount.type, appliedDiscount.value)
    : 0;
  const shipping = getShippingCost(subtotal - discountAmount);
  const codFee = paymentMethod === "cod" ? 50 : 0;
  const total = subtotal - discountAmount + shipping + codFee;

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

  const handleAuthSuccess = (user: User) => {
    setVerifiedUser(user);
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;
    setPlacingOrder(true);
    setPaymentError("");
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.price ?? item.product.price,
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
          userId: verifiedUser?.id,
          customerPhone: shippingAddress.phone,
        }),
      });

      const order = await res.json();
      if (paymentMethod === "online") {
        const ppRes = await fetch("/api/payment/phonepe", {
          method: "POST",
          body: JSON.stringify({
            orderId: order.id,
            amount: total,
            phone: shippingAddress.phone,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const ppData = await ppRes.json();

        if (ppData.url) {
          window.location.href = ppData.url; // Redirect to PhonePe
          return; // Do not clear cart yet, wait for return
        } else {
          throw new Error("Failed to initialize payment gateway");
        }
      } else {
        setOrderId(order.id);
        clearCart();
        setStep("confirmation");
      }
    } catch (error) {
      setPaymentError("Something went wrong while placing your order.");
      setPlacingOrder(false);
    } finally {
      setPlacingOrder(false);
    }
  };

  const steps = [
    { id: "address", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirmation", label: "Confirmation", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

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
          const isPast = currentStepIndex > i;
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
                  className={`w-8 sm:w-12 h-0.5 mx-1 ${isPast ? "bg-green-400" : "bg-cream-300"}`}
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
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <p
            className={`text-sm text-amber-700 font-medium ${paymentRef ? "mb-1" : "mb-8"}`}
          >
            Order ID: {orderId}
          </p>
          {paymentRef && (
            <p className="text-sm text-brown-500 mb-8">
              Payment Ref:{" "}
              <span className="font-semibold text-brown-900">{paymentRef}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/")} size="lg">
              Continue Shopping
            </Button>
            {verifiedUser && (
              <Button
                variant="outline"
                onClick={() => router.push("/account")}
                size="lg"
              >
                View My Orders
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-brown-900">
                    Shipping Address
                  </h2>
                  {verifiedUser && (
                    <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
                      <ShieldCheck size={12} />
                      Logged in
                    </span>
                  )}
                </div>
                {!verifiedUser && (
                  <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brown-900">
                        Already have an account?
                      </p>
                      <p className="text-xs text-brown-600 mt-0.5">
                        Log in for a faster checkout experience.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAuthModalOpen(true)}
                    >
                      Log in
                    </Button>
                  </div>
                )}
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  submitLabel="Continue to Payment"
                />
              </div>
            )}

            {step === "payment" && shippingAddress && (
              <>
                {/* Address & verification summary */}
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
                    {shippingAddress.address2
                      ? `, ${shippingAddress.address2}`
                      : ""}
                    , {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}
                  </p>
                  {verifiedUser && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                      <ShieldCheck size={12} />
                      Logged in as: {verifiedUser.email || verifiedUser.name}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                  {paymentError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200">
                      {paymentError}
                    </div>
                  )}
                  <PaymentStep
                    total={total}
                    method={paymentMethod}
                    onMethodChange={setPaymentMethod}
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
              codFee={codFee}
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
                    onChange={(e) =>
                      setDiscountInput(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleApplyDiscount()
                    }
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Log in / Sign up"
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-brown-500">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
