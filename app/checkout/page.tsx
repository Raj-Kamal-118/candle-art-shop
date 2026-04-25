"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  CreditCard,
  Tag,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Address, DiscountCode, User } from "@/lib/types";
import { formatPrice, getShippingCost, calculateDiscount } from "@/lib/utils";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

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
  const [redirecting, setRedirecting] = useState(false);
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
      setRedirecting(true);
      clearCart();
      router.replace(`/order/${callbackOrderId}`);
      return;
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

  if (cartItems.length === 0 && step !== "confirmation" && !redirecting) {
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
        body: JSON.stringify({
          code: discountInput,
          subtotal,
          userId: verifiedUser?.id,
          phone: shippingAddress?.phone,
        }),
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
        productImage: item.product.images?.[0] ?? "",
        price: item.price ?? item.product.price,
        quantity: item.quantity,
        customizations: item.customizations,
        ...(item.giftSet ? { giftSet: item.giftSet } : {}),
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          discount: discountAmount,
          shipping,
          codFee,
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

      if (!res.ok) {
        throw new Error(order.error || "Failed to place order");
      }

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
        setRedirecting(true);
        clearCart();
        router.replace(`/order/${order.id}`);
        return;
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order.",
      );
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
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Editorial Header */}
      <SecondaryHeader
        eyebrow="✦ Secure Checkout ✦"
        titlePrefix="Almost"
        titleHighlighted="yours"
        description="Just a few more details to get these handcrafted pieces on their way to you."
        backgroundImage="/images/misc/checkout.png"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isPast = currentStepIndex > i;
            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
                    isActive
                      ? "bg-coral-600 dark:bg-amber-600 text-white"
                      : isPast
                        ? "bg-forest-700 dark:bg-forest-600 text-white"
                        : "bg-white dark:bg-[#1a1830] text-brown-500 dark:text-amber-100/50 border border-cream-200 dark:border-amber-900/30"
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-2 rounded-full ${isPast ? "bg-forest-400 dark:bg-forest-500" : "bg-cream-300 dark:bg-amber-900/30"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {step === "confirmation" ? (
          <div className="max-w-xl mx-auto text-center py-16 px-4 bg-white dark:bg-[#1a1830] rounded-3xl shadow-[0_12px_32px_rgba(28,18,9,0.06)] border border-cream-200 dark:border-amber-900/30">
            <div className="w-24 h-24 bg-cream-100 dark:bg-amber-900/20 border border-cream-200 dark:border-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <CheckCircle
                className="text-coral-600 dark:text-amber-500"
                size={48}
              />
            </div>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-[0.24em] mb-4">
              ✦ Order Received ✦
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 dark:text-amber-50 mb-6 leading-tight">
              Thank you.
            </h2>
            <p className="text-brown-600 dark:text-amber-100/70 mb-8 max-w-md mx-auto leading-relaxed">
              Your purchase has been securely processed. We're getting your
              handcrafted pieces ready for their journey.
            </p>
            <div className="bg-cream-50 dark:bg-amber-900/10 rounded-xl p-6 mb-10 max-w-sm mx-auto border border-cream-100 dark:border-amber-900/20">
              <p
                className={`text-sm text-brown-800 dark:text-amber-100 font-medium ${paymentRef ? "mb-2" : ""}`}
              >
                Order ID:{" "}
                <span className="font-bold text-coral-600 dark:text-amber-400">
                  {orderId}
                </span>
              </p>
              {paymentRef && (
                <p className="text-sm text-brown-800 dark:text-amber-100 font-medium">
                  Payment Ref:{" "}
                  <span className="font-bold text-coral-600 dark:text-amber-400">
                    {paymentRef}
                  </span>
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
              >
                Continue Shopping
              </button>
              {verifiedUser && (
                <button
                  onClick={() => router.push("/account")}
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
                >
                  View My Orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              {step === "address" && (
                <>
                  {!verifiedUser ? (
                    <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-8 sm:p-12 shadow-[0_12px_32px_rgba(28,18,9,0.06)] border border-cream-200 dark:border-amber-900/30 text-center">
                      <div className="w-20 h-20 bg-cream-50 dark:bg-amber-900/10 border border-cream-100 dark:border-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-700 dark:text-amber-400 shadow-sm">
                        <UserIcon size={32} />
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                        Let's make it official
                      </h2>
                      <p className="text-brown-600 dark:text-amber-100/70 mb-10 max-w-md mx-auto leading-relaxed">
                        We require you to log in or create an account before
                        placing an order. This ensures you can easily track your
                        handcrafted pieces, manage your orders, and access your
                        saved favorites anytime from your account.
                      </p>
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5"
                      >
                        Log in or Sign up
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 sm:p-8 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
                      <div className="bg-cream-50 dark:bg-[#151326] rounded-2xl p-5 sm:p-6 mb-8 border border-cream-100 dark:border-amber-900/20 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 shadow-sm">
                        <div className="w-12 h-12 bg-coral-100 dark:bg-amber-900/40 border border-coral-200 dark:border-amber-700/30 rounded-full flex items-center justify-center text-coral-700 dark:text-amber-400 shrink-0">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-2">
                            Welcome back,{" "}
                            {verifiedUser.name?.split(" ")[0] || "friend"}!
                          </h3>
                          <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
                            We're so glad you're here. Let's get your order on
                            its way. Please provide your delivery details below.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
                          Shipping Address
                        </h2>
                      </div>
                      <AddressForm
                        onSubmit={handleAddressSubmit}
                        submitLabel="Continue to Payment"
                      />
                    </div>
                  )}
                </>
              )}

              {step === "payment" && shippingAddress && (
                <>
                  {/* Address & verification summary */}
                  <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 flex items-center gap-2">
                        <MapPin
                          size={18}
                          className="text-amber-600 dark:text-amber-400"
                        />
                        Shipping to
                      </h3>
                      <button
                        onClick={() => setStep("address")}
                        className="text-xs text-coral-600 hover:text-coral-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold uppercase tracking-wide"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-cream-50 dark:bg-[#151326] p-5 rounded-2xl border border-cream-100 dark:border-amber-900/20">
                      <p className="text-sm text-brown-700 dark:text-amber-100/80 leading-relaxed">
                        <span className="font-semibold">
                          {shippingAddress.fullName}
                        </span>
                        <br />
                        {shippingAddress.address1}
                        {shippingAddress.address2
                          ? `, ${shippingAddress.address2}`
                          : ""}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.postalCode}
                      </p>
                      {verifiedUser && (
                        <p className="mt-4 pt-4 border-t border-cream-200 dark:border-amber-900/30 flex items-center gap-1.5 text-xs text-forest-600 dark:text-amber-300/80 font-medium">
                          <ShieldCheck size={14} />
                          Logged in as {verifiedUser.email || verifiedUser.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 sm:p-8 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
                    <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-6">
                      Payment Method
                    </h2>
                    {paymentError && (
                      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50 flex items-start gap-3">
                        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
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
            <div className="space-y-6">
              <OrderSummary
                items={cartItems}
                discount={discountAmount}
                discountCode={discountCode}
                codFee={codFee}
              />

              {/* Discount code */}
              <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
                <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                  <Tag
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                  Discount Code
                </h3>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl px-4 py-3 shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-green-800 dark:text-green-400">
                        {discountCode}
                      </p>
                      <p className="text-xs font-medium text-green-600 dark:text-green-500 mt-0.5">
                        -{formatPrice(discountAmount)} saved
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedDiscount(null);
                        setDiscountCode("");
                      }}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={discountInput}
                      onChange={(e) =>
                        setDiscountInput(e.target.value.toUpperCase())
                      }
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2.5 text-sm border border-brown-300 dark:border-amber-900/40 rounded-xl bg-white dark:bg-[#151326] text-brown-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 placeholder:text-brown-400 dark:placeholder:text-amber-100/30"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyDiscount()
                      }
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-sm border border-cream-200 text-sm disabled:opacity-50"
                    >
                      {applyingDiscount ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {discountError && (
                  <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                    {discountError}
                  </p>
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
    </main>
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
