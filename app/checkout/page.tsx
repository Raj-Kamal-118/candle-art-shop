"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  CreditCard,
  Tag,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Gift,
  Pencil,
  Check,
  ArrowLeft,
  Ban,
  Cake,
  HeartHandshake,
  HandHeart,
  PartyPopper,
  Heart,
  Truck,
  Package,
  Flame,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Address, DiscountCode, User } from "@/lib/types";
import { formatPrice, getShippingCost, calculateDiscount } from "@/lib/utils";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import StickyNote from "@/components/ui/StickyNote";
import { supabase } from "@/lib/supabase";
import SavedAddressList from "@/components/checkout/SavedAddressList";

type Step = "address" | "payment" | "confirmation";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, clearCart, currentUser, setCurrentUser } = useStore();

  const [step, setStep] = useState<Step>("address");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [orderType, setOrderType] = useState<"self" | "gift">("self");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNoteColor, setGiftNoteColor] = useState("#fef3c7");
  const [greetingCard, setGreetingCard] = useState<string>("none");
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedSavedAddress, setSelectedSavedAddress] =
    useState<Address | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null,
  );
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod" | "upi">(
    "online",
  );
  const [paymentError, setPaymentError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<User | null>(currentUser);
  const [expectedSubtotal, setExpectedSubtotal] = useState<number | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Sync verifiedUser with store
  useEffect(() => {
    if (currentUser) setVerifiedUser(currentUser);
  }, [currentUser]);

  // Fetch saved addresses for the verified user
  useEffect(() => {
    async function fetchSavedAddresses() {
      if (!verifiedUser?.id) return;
      const { data } = await supabase
        .from("users")
        .select("saved_addresses")
        .eq("id", verifiedUser.id)
        .single();
      if (data?.saved_addresses) {
        const addresses = data.saved_addresses as Address[];
        setSavedAddresses(addresses);

        if (addresses.length === 0) setSaveAddress(true);

        const defaultAddr = addresses.find((a) => a.isDefault);
        if (defaultAddr) setSelectedSavedAddress(defaultAddr);
      } else {
        setSaveAddress(true);
      }
    }
    fetchSavedAddresses();
  }, [verifiedUser?.id]);

  // Read applied discount from cart
  useEffect(() => {
    try {
      const savedDiscount = sessionStorage.getItem("appliedDiscount");
      if (savedDiscount) {
        const parsed = JSON.parse(savedDiscount);
        setAppliedDiscount(parsed.discount);
        setDiscountCode(parsed.code);
      }
    } catch (e) {
      console.error("Failed to load discount", e);
    }
  }, []);

  // Handle returning from PhonePe Gateway
  useEffect(() => {
    const callbackOrderId = searchParams.get("order");
    const callbackStatus = searchParams.get("status");
    const callbackRef = searchParams.get("ref");
    const callbackMessage = searchParams.get("message");

    // Attempt to recover checkout state so the address is kept filled
    const savedStateStr = sessionStorage.getItem("checkoutState");
    let stateRecovered = false;
    let addressRecovered = false;
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        if (savedState.shippingAddress) {
          setShippingAddress(savedState.shippingAddress);
          addressRecovered = true;
        }
        if (savedState.orderType) setOrderType(savedState.orderType);
        if (savedState.giftMessage) setGiftMessage(savedState.giftMessage);
        if (savedState.discountCode) setDiscountCode(savedState.discountCode);
        if (savedState.saveAddress !== undefined)
          setSaveAddress(savedState.saveAddress);
        if (savedState.giftWrap !== undefined) setGiftWrap(savedState.giftWrap);
        if (savedState.giftNoteColor)
          setGiftNoteColor(savedState.giftNoteColor);
        if (savedState.greetingCard) setGreetingCard(savedState.greetingCard);
        if (savedState.expectedSubtotal !== undefined)
          setExpectedSubtotal(savedState.expectedSubtotal);
        if (savedState.orderId) setOrderId(savedState.orderId);
        stateRecovered = true;
      } catch (e) {
        console.error("Failed to parse checkout state", e);
      }
      // Clean up so it doesn't trigger on normal page refreshes
      sessionStorage.removeItem("checkoutState");
    }

    if (callbackOrderId && callbackStatus === "SUCCESS") {
      setRedirecting(true);
      clearCart();
      setTimeout(() => {
        router.replace(`/order/${callbackOrderId}`);
      }, 3000);
      return;
    } else if (callbackStatus === "FAILED") {
      setPaymentError(
        callbackMessage || "Payment failed or was cancelled. Please try again.",
      );
      // Restore orderId from URL if sessionStorage was unavailable (e.g. new tab)
      if (callbackOrderId && !stateRecovered) setOrderId(callbackOrderId);
      if (addressRecovered) setStep("payment");
    } else if (stateRecovered && !callbackOrderId) {
      setPaymentError(
        "Payment was interrupted. Please review your details and try again.",
      );
      if (addressRecovered) setStep("payment");
    }
  }, [searchParams, clearCart, router]);

  // Auto-scroll to the error banner when a payment error occurs
  useEffect(() => {
    if (paymentError && errorRef.current) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [paymentError, step]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );

  useEffect(() => {
    if (expectedSubtotal !== null && subtotal > 0) {
      if (expectedSubtotal !== subtotal) {
        setPaymentError((prev) =>
          prev
            ? `${prev} Please note: your cart was modified in another window. Review your updated total before retrying.`
            : "Your cart was modified in another tab. Please review your updated total before retrying.",
        );
      }
      setExpectedSubtotal(null);
    }
  }, [expectedSubtotal, subtotal]);
  const discountAmount = appliedDiscount
    ? calculateDiscount(subtotal, appliedDiscount.type, appliedDiscount.value)
    : 0;
  const isVaranasi = Boolean(
    shippingAddress?.postalCode?.startsWith("221") ||
    shippingAddress?.city?.toLowerCase() === "varanasi" ||
    shippingAddress?.city?.toLowerCase() === "varanashi",
  );
  const baseShipping = getShippingCost(subtotal - discountAmount);
  const shipping = isVaranasi ? 0 : baseShipping;
  const codFee = paymentMethod === "cod" ? 50 : 0;
  const giftWrapFee = orderType === "gift" && giftWrap ? 30 : 0;
  const greetingCardFee =
    orderType === "gift" && greetingCard !== "none" ? 20 : 0;
  const total =
    subtotal -
    discountAmount +
    shipping +
    codFee +
    giftWrapFee +
    greetingCardFee;

  if (cartItems.length === 0 && step !== "confirmation" && !redirecting) {
    router.push("/cart");
    return null;
  }

  const handleAddressSubmit = async (address: Address) => {
    setShippingAddress(address);
    setPaymentError("");

    if (saveAddress && verifiedUser?.id) {
      try {
        await fetch("/api/user/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: verifiedUser.id, address }),
        });
      } catch {
        // Non-critical — don't block checkout if this fails
      }
    }

    setStep("payment");
  };

  const handleAuthSuccess = (user: User) => {
    setVerifiedUser(user);
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handlePlaceOrder = async (paymentData?: {
    transactionId?: string;
    screenshot?: string;
  }) => {
    if (!shippingAddress) return;
    setPlacingOrder(true);
    setPaymentError("");
    try {
      let currentOrderId = orderId;

      // Only create a new order if we haven't already created one in this session
      if (!currentOrderId) {
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
            paymentReference: paymentData?.transactionId,
            paymentScreenshot: paymentData?.screenshot,
            userId: verifiedUser?.id,
            status: paymentMethod === "online" ? "payment_pending" : "pending",
            customerEmail: verifiedUser?.email,
            customerPhone: verifiedUser?.phone || shippingAddress.phone,
            isGift: orderType === "gift",
            giftMessage: orderType === "gift" ? giftMessage : undefined,
            giftWrap: orderType === "gift" ? giftWrap : false,
            giftNoteColor: orderType === "gift" ? giftNoteColor : undefined,
            greetingCard: orderType === "gift" ? greetingCard : undefined,
            giftWrapFee,
            greetingCardFee,
            saveAddress: saveAddress,
          }),
        });

        const order = await res.json();

        if (!res.ok) {
          throw new Error(order.error || "Failed to place order");
        }
        currentOrderId = order.id;
        setOrderId(currentOrderId);
      } else {
        // Order exists from a failed PhonePe attempt — update it with new payment details
        const retryRes = await fetch(`/api/orders/${currentOrderId}/retry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            codFee,
            total,
            paymentReference: paymentData?.transactionId,
            paymentScreenshot: paymentData?.screenshot,
          }),
        });
        if (!retryRes.ok) {
          const err = await retryRes.json();
          throw new Error(err.error || "Failed to update order for retry");
        }
      }

      if (paymentMethod === "online") {
        // Save state to recover after redirect so address stays filled
        sessionStorage.setItem(
          "checkoutState",
          JSON.stringify({
            shippingAddress,
            orderType,
            giftMessage,
            discountCode,
            giftWrap,
            giftNoteColor,
            greetingCard,
            saveAddress,
            expectedSubtotal: subtotal,
            orderId: currentOrderId,
          }),
        );

        const ppRes = await fetch("/api/payment/phonepe", {
          method: "POST",
          body: JSON.stringify({
            orderId: `${currentOrderId}_${Date.now()}`,
            amount: total,
            phone: shippingAddress.phone,
            merchantUserId: verifiedUser?.id || "guest",
            name: shippingAddress.fullName,
            email: verifiedUser?.email || shippingAddress.email,
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
        router.replace(`/order/${currentOrderId}`);
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
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isPast = currentStepIndex > i;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-coral-600 dark:bg-coral-500 text-white shadow-[0_0_12px_rgba(232,93,74,0.6)]"
                        : isPast
                          ? "bg-forest-700/80 dark:bg-forest-600/80 text-white shadow-[0_0_12px_rgba(22,163,74,0.4)]"
                          : "bg-cream-100 dark:bg-[#1a1830] text-brown-300 dark:text-amber-100/30 border border-dashed border-brown-200 dark:border-amber-900/30"
                    }`}
                  >
                    {isPast ? <Check size={13} /> : <Icon size={14} />}
                  </div>
                  <span
                    className={`font-serif text-[9px] uppercase tracking-[0.12em] font-medium transition-colors ${
                      isActive
                        ? "text-coral-600 dark:text-coral-400"
                        : isPast
                          ? "text-forest-600 dark:text-forest-400"
                          : "text-brown-300 dark:text-amber-100/30"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-12 sm:w-20 mb-4 mx-2 h-px border-t border-dashed transition-colors"
                    style={{
                      borderColor: isPast
                        ? "rgba(55,110,60,0.5)"
                        : "rgba(180,140,100,0.35)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {step !== "confirmation" && (
          <div className="mb-6">
            <button
              onClick={() => router.push("/cart")}
              className="font-serif inline-flex items-center gap-1.5 text-sm font-medium text-brown-500 dark:text-amber-100/50 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to basket
            </button>
          </div>
        )}

        {redirecting && (
          <div className="fixed inset-0 z-50 bg-[#fdfbf9] dark:bg-[#1a1612] flex flex-col items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(215, 110, 96, 0.08), transparent 60%)",
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative w-24 h-32 flex flex-col items-center justify-end mb-6">
                {/* Flame */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 0.95, 1.1, 1],
                    rotate: [0, -2, 2, -1, 0],
                    y: [0, -2, 1, -1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                >
                  <Flame
                    size={48}
                    strokeWidth={1.5}
                    className="fill-amber-400"
                  />
                </motion.div>

                {/* Candle body */}
                <div className="w-12 h-16 bg-gradient-to-b from-cream-100 to-cream-200 dark:from-[#2a2640] dark:to-[#1a1830] rounded-t-sm rounded-b-xl border border-cream-300 dark:border-amber-900/40 relative shadow-inner">
                  {/* Wax drip */}
                  <div className="absolute top-0 right-2 w-2 h-7 bg-cream-100 dark:bg-[#2a2640] rounded-b-full shadow-sm opacity-80"></div>
                  <div className="absolute top-0 left-2 w-1.5 h-4 bg-cream-100 dark:bg-[#2a2640] rounded-b-full shadow-sm opacity-60"></div>
                </div>

                {/* Glow on surface */}
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-1 w-20 h-3 bg-amber-500/30 blur-md rounded-full"
                />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-50 mb-4 tracking-wide text-center">
                Confirming Order
              </h2>
              <p className="font-serif italic text-lg text-brown-500 dark:text-amber-100/60 text-center px-6">
                Warming up the wax and preparing your order...
              </p>
            </motion.div>
          </div>
        )}

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
              <Button onClick={() => router.push("/")} variant="primary">
                Continue Shopping
              </Button>
              {verifiedUser && (
                <Button
                  onClick={() => router.push("/account")}
                  variant="primary"
                >
                  View My Orders
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 min-w-0">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6 min-w-0">
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
                      <Button
                        onClick={() => setAuthModalOpen(true)}
                        variant="primary"
                        size="lg"
                      >
                        Log in or Sign up
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#1a1830] rounded-3xl shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
                      {/* Artistic shipping banner */}
                      <div className="relative bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50/60 dark:from-amber-900/20 dark:via-[#151326] dark:to-orange-900/10 px-6 sm:px-8 pt-7 pb-6 border-b border-amber-100 dark:border-amber-900/30 rounded-t-3xl">
                        {/* Decorative shipping icons inside clipped container */}
                        <div className="absolute inset-0 overflow-hidden rounded-t-3xl pointer-events-none">
                          <Truck
                            size={160}
                            className="absolute -right-8 -top-4 text-amber-200/40 dark:text-amber-900/20"
                            strokeWidth={0.8}
                          />
                          <Package
                            size={80}
                            className="absolute right-32 bottom-2 text-amber-100/60 dark:text-amber-900/15"
                            strokeWidth={0.8}
                          />
                        </div>

                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            {(verifiedUser as any).avatarUrl ? (
                              <img
                                src={(verifiedUser as any).avatarUrl}
                                alt={verifiedUser.name || "Profile picture"}
                                className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-amber-200 dark:border-amber-700/40 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-white dark:bg-amber-900/40 border-2 border-amber-200 dark:border-amber-700/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-sm">
                                <Sparkles size={20} />
                              </div>
                            )}
                            <div>
                              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-0.5">
                                Welcome back
                              </p>
                              <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 leading-none flex items-center gap-2">
                                {verifiedUser.name?.split(" ")[0] || "friend"}
                                <Flame
                                  size={20}
                                  className="text-amber-500 dark:text-amber-400"
                                />
                              </h3>
                            </div>
                          </div>

                          <div className="sm:ml-auto relative bg-[#fdfbf7] dark:bg-[#1a1830] border border-dashed border-amber-200 dark:border-amber-900/40 px-4 py-2.5 rounded-lg shadow-sm transition-all mt-2 sm:mt-0 group/tooltip cursor-default">
                            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50/60 dark:from-amber-900/20 dark:via-[#151326] dark:to-orange-900/10 rounded-full border-r border-amber-200 dark:border-amber-900/40"></div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-700/60 dark:text-amber-500/60 uppercase tracking-widest hidden sm:inline-block">
                                Invoice &amp; Order Confirmation
                              </span>
                              <span className="text-[10px] font-bold text-amber-700/60 dark:text-amber-500/60 uppercase tracking-widest sm:hidden">
                                Updates
                              </span>
                              <div className="w-px h-3 bg-amber-200 dark:bg-amber-900/40"></div>
                              <span
                                className="text-brown-700 dark:text-amber-100/90 flex items-center gap-1.5"
                                style={{
                                  fontFamily: "var(--font-hand)",
                                  fontSize: 16,
                                }}
                              >
                                to: {verifiedUser.email || "your email"}
                                <div className="relative flex items-center">
                                  <Info
                                    size={14}
                                    className="text-amber-600/50 dark:text-amber-400/50 cursor-help hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                  />
                                  <div className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2.5 w-48 p-2.5 bg-brown-900 dark:bg-amber-100 text-cream-50 dark:text-brown-900 text-[11px] font-sans font-medium leading-relaxed rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50">
                                    We use this to send your order confirmation,
                                    tracking updates, and receipt. No spam,
                                    ever.
                                    <div className="absolute top-full right-1.5 sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-brown-900 dark:border-t-amber-100"></div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <h2 className="font-serif text-[24px] font-bold text-brown-900 dark:text-amber-100 whitespace-nowrap">
                            Shipping{" "}
                            <span
                              className="text-[30px] text-coral-600 dark:text-amber-400"
                              style={{ fontFamily: "var(--font-script)" }}
                            >
                              Address
                            </span>
                          </h2>
                        </div>

                        {/* Order Intent Selection */}
                        <div className="mb-8">
                          <h3 className="text-sm font-semibold text-brown-800 dark:text-amber-200 mb-3 uppercase tracking-wider">
                            Who is this for?
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => {
                                setOrderType("self");
                                setPaymentError("");
                              }}
                              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                orderType === "self"
                                  ? "border-coral-500 bg-coral-50 dark:border-amber-500 dark:bg-amber-900/20"
                                  : "border-cream-200 bg-white dark:bg-[#151326] dark:border-amber-900/20 hover:border-coral-300"
                              }`}
                            >
                              <UserIcon
                                size={24}
                                className={
                                  orderType === "self"
                                    ? "text-coral-600 dark:text-amber-400 mb-2"
                                    : "text-brown-400 dark:text-amber-100/50 mb-2"
                                }
                              />
                              <span
                                className={`font-semibold text-sm ${orderType === "self" ? "text-coral-900 dark:text-amber-100" : "text-brown-600 dark:text-amber-100/70"}`}
                              >
                                For Myself
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setOrderType("gift");
                                setPaymentError("");
                              }}
                              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                orderType === "gift"
                                  ? "border-coral-500 bg-coral-50 dark:border-amber-500 dark:bg-amber-900/20"
                                  : "border-cream-200 bg-white dark:bg-[#151326] dark:border-amber-900/20 hover:border-coral-300"
                              }`}
                            >
                              <Gift
                                size={24}
                                className={
                                  orderType === "gift"
                                    ? "text-coral-600 dark:text-amber-400 mb-2"
                                    : "text-brown-400 dark:text-amber-100/50 mb-2"
                                }
                              />
                              <span
                                className={`font-semibold text-sm ${orderType === "gift" ? "text-coral-900 dark:text-amber-100" : "text-brown-600 dark:text-amber-100/70"}`}
                              >
                                For Someone Else
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Gift Message */}
                        {orderType === "gift" && (
                          <div className="mb-8 relative overflow-hidden p-6 sm:p-8 bg-[#fdfbf7] dark:bg-amber-900/10 rounded-3xl border border-dashed border-amber-200 dark:border-amber-900/40 shadow-sm transition-all">
                            <div className="absolute -top-10 -right-10 text-amber-100 dark:text-amber-900/20 pointer-events-none rotate-12">
                              <Gift size={160} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                              <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2">
                                Make it{" "}
                                <span
                                  className="text-coral-600 dark:text-amber-400"
                                  style={{ fontFamily: "var(--font-script)" }}
                                >
                                  special
                                </span>
                              </h3>
                              <p className="text-sm text-brown-600 dark:text-amber-100/70 mb-8 leading-relaxed max-w-[90%]">
                                Sending this directly to them? We'll make sure
                                it feels like a warm hug in a box. No pricing or
                                invoices will be included.
                              </p>

                              {/* Gift Wrap Toggle */}
                              <label className="flex items-start gap-4 cursor-pointer group p-4 bg-white dark:bg-[#151326] border border-amber-100 dark:border-amber-900/30 rounded-2xl hover:border-amber-300 dark:hover:border-amber-700/50 transition-colors mb-8 shadow-sm">
                                <div className="relative shrink-0 mt-1">
                                  <input
                                    type="checkbox"
                                    checked={giftWrap}
                                    onChange={(e) =>
                                      setGiftWrap(e.target.checked)
                                    }
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${giftWrap ? "bg-coral-500 border-coral-500" : "border-brown-300 bg-white dark:bg-[#1a1830] group-hover:border-coral-400"}`}
                                  >
                                    {giftWrap && (
                                      <Check
                                        size={14}
                                        strokeWidth={3}
                                        className="text-white"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <span className="block font-serif text-[17px] font-bold text-brown-900 dark:text-amber-100 leading-none mb-1.5">
                                    Premium Gift Wrap (+₹30)
                                  </span>
                                  <span className="text-sm text-brown-500 dark:text-amber-100/60 block leading-relaxed">
                                    We'll wrap their gifts in our signature
                                    botanical paper and tie it with a beautiful
                                    soft ribbon.
                                  </span>
                                </div>
                              </label>

                              {/* Greeting Card Upsell */}
                              <div className="mb-8">
                                <label className="block font-serif text-[17px] font-bold text-brown-900 dark:text-amber-100 mb-3">
                                  Add a Greeting Card (+₹20)
                                </label>
                                <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide -mx-2 px-2">
                                  {[
                                    {
                                      id: "none",
                                      label: "No Card",
                                      icon: Ban,
                                      color: "text-slate-500",
                                      bg: "bg-slate-100 dark:bg-slate-800",
                                    },
                                    {
                                      id: "birthday",
                                      label: "Birthday",
                                      icon: Cake,
                                      color: "text-pink-600",
                                      bg: "bg-pink-100 dark:bg-pink-900/30",
                                    },
                                    {
                                      id: "anniversary",
                                      label: "Anniversary",
                                      icon: HeartHandshake,
                                      color: "text-purple-600",
                                      bg: "bg-purple-100 dark:bg-purple-900/30",
                                    },
                                    {
                                      id: "love",
                                      label: "Love You",
                                      icon: Heart,
                                      color: "text-red-500",
                                      bg: "bg-red-100 dark:bg-red-900/30",
                                    },
                                    {
                                      id: "thankyou",
                                      label: "Thank You",
                                      icon: HandHeart,
                                      color: "text-emerald-600",
                                      bg: "bg-emerald-100 dark:bg-emerald-900/30",
                                    },
                                    {
                                      id: "congrats",
                                      label: "Congrats",
                                      icon: PartyPopper,
                                      color: "text-amber-600",
                                      bg: "bg-amber-100 dark:bg-amber-900/30",
                                    },

                                    {
                                      id: "get_well",
                                      label: "Get Well",
                                      icon: Sparkles,
                                      color: "text-teal-600",
                                      bg: "bg-teal-100 dark:bg-teal-900/30",
                                    },
                                  ].map((card) => {
                                    const Icon = card.icon;
                                    return (
                                      <button
                                        key={card.id}
                                        type="button"
                                        onClick={() => setGreetingCard(card.id)}
                                        className={`shrink-0 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 min-w-[90px] ${greetingCard === card.id ? "border-coral-500 bg-white dark:bg-[#1a1830] shadow-[0_4px_12px_rgba(232,93,74,0.15)]" : "border-transparent bg-white/60 dark:bg-[#151326]/60 hover:border-amber-200 dark:hover:border-amber-800"}`}
                                      >
                                        <div
                                          className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}
                                        >
                                          <Icon size={22} strokeWidth={2} />
                                        </div>
                                        <span
                                          className={`text-xs font-semibold ${greetingCard === card.id ? "text-coral-700 dark:text-coral-400" : "text-brown-600 dark:text-amber-100/70"}`}
                                        >
                                          {card.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Handwritten Note */}
                              <div className="p-5 sm:p-6 bg-white dark:bg-[#151326] border border-amber-100 dark:border-amber-900/30 rounded-2xl shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                  <div>
                                    <label className="flex items-center gap-2 font-serif text-[17px] font-bold text-brown-900 dark:text-amber-100 mb-1">
                                      <Pencil
                                        size={16}
                                        className="text-amber-600 dark:text-amber-400"
                                      />
                                      Your Message (Free)
                                    </label>
                                    <p className="text-xs text-brown-500 dark:text-amber-100/60 leading-relaxed max-w-[280px]">
                                      {greetingCard === "none"
                                        ? "We'll handwrite your note on a beautifully designed artisan paper, tucked inside the box."
                                        : "We'll carefully transcribe your note directly onto the greeting card you selected above."}
                                    </p>
                                  </div>

                                  {greetingCard === "none" && (
                                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">
                                        Paper color
                                      </span>
                                      <div className="flex gap-1.5">
                                        {[
                                          "#fef3c7",
                                          "#fee2e2",
                                          "#e0f2fe",
                                          "#dcfce7",
                                          "#f3e8ff",
                                        ].map((colorHex) => (
                                          <button
                                            key={colorHex}
                                            type="button"
                                            onClick={() =>
                                              setGiftNoteColor(colorHex)
                                            }
                                            className={`w-6 h-6 rounded-full border-2 transition-all shadow-sm ${giftNoteColor === colorHex ? "border-brown-400 scale-110" : "border-white/50 dark:border-transparent hover:scale-110"}`}
                                            style={{
                                              backgroundColor: colorHex,
                                            }}
                                            aria-label={`Select color ${colorHex}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <textarea
                                  value={giftMessage}
                                  onChange={(e) =>
                                    setGiftMessage(e.target.value)
                                  }
                                  placeholder="Dearest..."
                                  rows={4}
                                  style={{
                                    backgroundColor:
                                      greetingCard === "none"
                                        ? giftNoteColor
                                        : "transparent",
                                    color:
                                      greetingCard === "none"
                                        ? "#4a3320"
                                        : undefined,
                                  }}
                                  className={`w-full px-4 py-3 font-serif text-[15px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-brown-700/40 resize-none transition-colors ${greetingCard === "none" ? "border-black/5 shadow-inner" : "border-amber-200 dark:border-amber-800/50 text-brown-900 dark:text-amber-100 bg-amber-50/30 dark:bg-amber-900/10"}`}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Saved Addresses Selection */}
                        {savedAddresses.length > 0 && (
                          <div className="mb-10">
                            <SavedAddressList
                              savedAddresses={savedAddresses}
                              selectedSavedAddress={selectedSavedAddress}
                              setSelectedSavedAddress={(addr) => {
                                setSelectedSavedAddress(addr);
                                setPaymentError("");
                                if (addr) setSaveAddress(false);
                              }}
                            />
                          </div>
                        )}

                        {paymentError && (
                          <div
                            ref={errorRef}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50 flex items-start gap-3"
                          >
                            <ShieldCheck
                              size={18}
                              className="shrink-0 mt-0.5"
                            />
                            <div>
                              <strong className="block mb-1">
                                Payment Failed
                              </strong>
                              {paymentError}
                            </div>
                          </div>
                        )}

                        <div className="mb-6 flex items-center gap-3">
                          <div className="h-px bg-cream-200 dark:bg-amber-900/30 flex-1" />
                          <span className="text-[11px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest">
                            {selectedSavedAddress
                              ? "Review & Confirm Details"
                              : "Enter Delivery Details"}
                          </span>
                          <div className="h-px bg-cream-200 dark:bg-amber-900/30 flex-1" />
                        </div>

                        <AddressForm
                          key={`${orderType}-${selectedSavedAddress ? savedAddresses.indexOf(selectedSavedAddress) : "new"}-${shippingAddress ? "restored" : "empty"}`}
                          onSubmit={handleAddressSubmit}
                          submitLabel={
                            paymentError
                              ? "Retry Payment"
                              : "Continue to Payment"
                          }
                          defaultValues={
                            selectedSavedAddress ||
                            shippingAddress ||
                            ({
                              fullName:
                                orderType === "self"
                                  ? verifiedUser.name || ""
                                  : "",
                              email: verifiedUser.email || "", // Always prefill to receive the invoice
                              phone: verifiedUser.phone || "", // Always prefill for shipping tracking updates
                            } as Address)
                          }
                        />

                        {/* Save Address Toggle */}
                        {!selectedSavedAddress && (
                          <label
                            htmlFor="saveAddress"
                            className="mt-6 flex items-center gap-3 p-4 bg-cream-50 dark:bg-[#151326] rounded-xl border border-cream-100 dark:border-amber-900/20 cursor-pointer group hover:border-coral-200 dark:hover:border-amber-800/40 transition-colors"
                          >
                            <div className="relative shrink-0">
                              <input
                                type="checkbox"
                                id="saveAddress"
                                checked={saveAddress}
                                onChange={(e) =>
                                  setSaveAddress(e.target.checked)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                                  saveAddress
                                    ? "bg-coral-500 border-coral-500 dark:bg-amber-500 dark:border-amber-500 shadow-sm"
                                    : "border-brown-300 dark:border-amber-900/50 bg-white dark:bg-[#12101e] group-hover:border-coral-400 dark:group-hover:border-amber-700"
                                }`}
                              >
                                {saveAddress && (
                                  <Check
                                    size={12}
                                    strokeWidth={3}
                                    className="text-white"
                                  />
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-medium text-brown-800 dark:text-amber-100 flex-1 select-none">
                              Save this address to my profile for future orders
                            </span>
                          </label>
                        )}
                      </div>
                      {/* end p-6 sm:p-8 */}
                    </div>
                  )}
                </>
              )}

              {step === "payment" && shippingAddress && (
                <>
                  {/* Address & verification summary */}
                  <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="font-bold text-brown-900 dark:text-amber-100 flex items-center gap-2"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 20,
                        }}
                      >
                        <MapPin
                          size={18}
                          className="text-amber-600 dark:text-amber-400"
                        />
                        Shipping{" "}
                        <span
                          className="text-coral-600 dark:text-amber-400"
                          style={{
                            fontFamily: "var(--font-script)",
                            fontSize: 26,
                          }}
                        >
                          to
                        </span>
                      </h3>
                      <button
                        onClick={() => setStep("address")}
                        className="text-xs text-coral-600 hover:text-coral-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold uppercase tracking-wide"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-[#fdfbf7] dark:bg-[#151326] p-6 sm:p-8 rounded-2xl border border-amber-200 dark:border-amber-900/40 relative shadow-sm overflow-hidden">
                      {/* Postcard background elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

                      {/* Fake stamp & wavy cancellation lines */}
                      <div className="absolute top-6 right-6 flex items-center pointer-events-none opacity-70">
                        {/* Wavy lines */}
                        <div className="flex flex-col gap-1.5 mr-2">
                          {[1, 2, 3, 4].map((i) => (
                            <svg
                              key={i}
                              width="40"
                              height="4"
                              viewBox="0 0 40 4"
                              fill="none"
                              stroke="currentColor"
                              className="text-amber-800/20 dark:text-amber-100/10"
                            >
                              <path
                                d="M0 2 Q 5 0 10 2 T 20 2 T 30 2 T 40 2"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          ))}
                        </div>
                        {/* Stamp */}
                        <div className="w-14 h-16 border-2 border-dashed border-amber-300 dark:border-amber-700/30 p-1 rotate-3 bg-[#fdfbf7] dark:bg-[#151326] shadow-sm">
                          <div className="w-full h-full border border-amber-200 dark:border-amber-800/40 flex flex-col items-center justify-center bg-amber-50/50 dark:bg-amber-900/20">
                            <Flame
                              size={16}
                              className="text-amber-600/50 dark:text-amber-400/40 mb-1"
                            />
                            <span className="text-[6px] uppercase tracking-[0.15em] text-amber-700/60 dark:text-amber-400/50 font-bold text-center leading-none">
                              Post
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Postcard content area */}
                      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative z-10">
                        <div className="flex-1 pt-2">
                          <p
                            className="text-xl text-brown-800 dark:text-amber-100 leading-relaxed"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 22,
                            }}
                          >
                            <span className="text-2xl font-bold block mb-1">
                              {shippingAddress.fullName}
                            </span>
                            {shippingAddress.address1}
                            {shippingAddress.address2
                              ? `, ${shippingAddress.address2}`
                              : ""}
                            <br />
                            {shippingAddress.city}, {shippingAddress.state}{" "}
                            {shippingAddress.postalCode}
                          </p>

                          {verifiedUser && (
                            <div className="mt-6 sm:mt-8 inline-flex items-center gap-1.5 text-[10px] text-forest-600 dark:text-amber-300/80 font-bold uppercase tracking-wider bg-forest-50 dark:bg-forest-900/20 px-3 py-1.5 rounded-lg border border-forest-100 dark:border-forest-800/30">
                              <ShieldCheck size={14} />
                              Linked to{" "}
                              {verifiedUser.email || verifiedUser.name}
                            </div>
                          )}
                        </div>

                        {/* Gift Summary side (if applicable) */}
                        {orderType === "gift" && (
                          <>
                            {/* Divider */}
                            <div className="hidden sm:block w-px border-r-2 border-dashed border-amber-200 dark:border-amber-900/30"></div>
                            <div className="sm:hidden h-px border-b-2 border-dashed border-amber-200 dark:border-amber-900/30 -mx-6"></div>

                            <div className="sm:w-64 pt-2">
                              <h4 className="font-serif text-lg font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                                <Gift
                                  size={18}
                                  className="text-amber-600 dark:text-amber-400"
                                />
                                Gift Included
                              </h4>

                              <div className="flex flex-col gap-2.5 mb-5">
                                {giftWrap && (
                                  <div className="inline-flex items-center gap-2 text-sm font-medium text-brown-700 dark:text-amber-100/80">
                                    <Sparkles
                                      size={14}
                                      className="text-coral-600 dark:text-coral-400"
                                    />{" "}
                                    Premium Wrap
                                  </div>
                                )}
                                {greetingCard !== "none" && (
                                  <div className="inline-flex items-center gap-2 text-sm font-medium text-brown-700 dark:text-amber-100/80">
                                    {greetingCard === "birthday" && (
                                      <Cake
                                        size={14}
                                        className="text-coral-600 dark:text-coral-400"
                                      />
                                    )}
                                    {greetingCard === "anniversary" && (
                                      <HeartHandshake
                                        size={14}
                                        className="text-coral-600 dark:text-coral-400"
                                      />
                                    )}
                                    {greetingCard === "love" && (
                                      <Heart
                                        size={14}
                                        className="text-coral-600 dark:text-coral-400"
                                      />
                                    )}
                                    {greetingCard === "thankyou" && (
                                      <HandHeart
                                        size={14}
                                        className="text-coral-600 dark:text-coral-400"
                                      />
                                    )}
                                    {greetingCard === "congrats" && (
                                      <PartyPopper
                                        size={14}
                                        className="text-coral-600 dark:text-coral-400"
                                      />
                                    )}
                                    <span className="capitalize">
                                      {greetingCard}
                                    </span>{" "}
                                    Card
                                  </div>
                                )}
                              </div>

                              {giftMessage && (
                                <div className="relative mt-2">
                                  <div
                                    className="absolute -top-3 -left-2 text-4xl text-amber-200 dark:text-amber-900/40 pointer-events-none"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                  >
                                    "
                                  </div>
                                  <p
                                    style={{
                                      backgroundColor: giftNoteColor,
                                      color: "#4a3320",
                                      fontFamily: "var(--font-hand)",
                                      fontSize: 18,
                                    }}
                                    className="p-3 pt-4 rounded-lg shadow-sm transform -rotate-1 relative z-10 border border-black/5 leading-snug"
                                  >
                                    {giftMessage}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 sm:p-8 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
                    <h2 className="font-serif text-[24px] font-bold text-brown-900 dark:text-amber-100 mb-6">
                      Payment{" "}
                      <span
                        className="text-[30px] text-coral-600 dark:text-amber-400"
                        style={{ fontFamily: "var(--font-script)" }}
                      >
                        Method
                      </span>
                    </h2>
                    {/* Phone number nudge: UPI needs a contact number for failed-payment follow-up */}
                    {paymentMethod === "upi" &&
                      verifiedUser &&
                      !verifiedUser.phone &&
                      !shippingAddress?.phone && (
                        <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
                          <ShieldCheck
                            size={18}
                            className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
                          />
                          <p>
                            <strong>Add a phone number to your account.</strong>{" "}
                            We use it to contact you if UPI payment verification
                            needs a follow-up. You can add it in{" "}
                            <button
                              onClick={() => router.push("/account")}
                              className="underline underline-offset-2 font-semibold hover:text-amber-700 dark:hover:text-amber-100 transition-colors"
                            >
                              your account settings
                            </button>
                            , or fill in a phone number on your delivery address
                            above.
                          </p>
                        </div>
                      )}
                    {paymentError && (
                      <div
                        ref={errorRef}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50 flex items-start gap-3"
                      >
                        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-1">Payment Failed</strong>
                          {paymentError}
                        </div>
                      </div>
                    )}
                    <PaymentStep
                      total={total}
                      method={paymentMethod}
                      onMethodChange={setPaymentMethod}
                      onSubmit={handlePlaceOrder}
                      loading={placingOrder}
                      email={verifiedUser?.email}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="space-y-6 min-w-0">
              {step === "payment" && isVaranasi ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <StickyNote
                    isAbsolute={false}
                    bgColor="#f0fdf4"
                    pinColor="#16a34a"
                  >
                    <div className="flex flex-col items-center text-center gap-2 p-2">
                      <Sparkles
                        size={20}
                        className="text-green-600 dark:text-green-400 animate-pulse"
                      />
                      <div
                        className="text-green-900 dark:text-green-50 leading-snug"
                        style={{ fontFamily: "var(--font-hand)", fontSize: 20 }}
                      >
                        <span className="relative inline-block mb-2 mt-1">
                          <span className="absolute inset-0 bg-green-200 dark:bg-green-800/60 transform rotate-1 rounded-sm"></span>
                          <span
                            className="relative font-bold px-2 text-green-950 dark:text-green-100"
                            style={{ fontSize: 22 }}
                          >
                            Free Varanasi Delivery Applied!
                          </span>
                        </span>
                        <br />
                        Since your delivery address is in Varanasi (where our
                        studio is located), your shipping is{" "}
                        <span className="relative inline-block mx-0.5">
                          <span className="absolute inset-x-0 bottom-0.5 h-3 bg-green-200/80 dark:bg-green-800/60 transform -skew-x-12 -rotate-1 rounded-sm"></span>
                          <span className="relative font-bold text-green-950 dark:text-green-100">
                            free
                          </span>
                        </span>
                        . If your items are premade, we will pack and deliver
                        them on the same day. If your items are made-to-order,
                        you will receive delivery on the same day they are
                        ready.
                        <br />
                        <span
                          className="opacity-80 mt-2 block"
                          style={{ fontSize: 16 }}
                        >
                          *Your final payment total below reflects this free
                          shipping.
                        </span>
                      </div>
                    </div>
                  </StickyNote>
                </motion.div>
              ) : step === "address" ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <StickyNote
                    isAbsolute={false}
                    bgColor="#fef3c7"
                    pinColor="#d97706"
                  >
                    <div className="flex flex-col items-center text-center gap-2 p-2">
                      <MapPin
                        size={20}
                        className="text-amber-600 dark:text-amber-400"
                      />
                      <div
                        className="text-brown-900 dark:text-amber-50 leading-snug"
                        style={{ fontFamily: "var(--font-hand)", fontSize: 20 }}
                      >
                        <span className="relative inline-block mb-2 mt-1">
                          <span className="absolute inset-0 bg-amber-200 dark:bg-amber-700/50 transform -rotate-1 rounded-sm"></span>
                          <span
                            className="relative font-bold px-2 text-brown-950 dark:text-amber-100"
                            style={{ fontSize: 22 }}
                          >
                            Local to Varanasi?
                          </span>
                        </span>
                        <br />
                        If you are ordering from Varanasi, we offer{" "}
                        <span className="relative inline-block mx-0.5">
                          <span className="absolute inset-x-0 bottom-0.5 h-3 bg-amber-200/80 dark:bg-amber-700/50 transform -skew-x-12 -rotate-1 rounded-sm"></span>
                          <span className="relative font-bold text-brown-950 dark:text-amber-100">
                            Free &amp; Same-Day Delivery
                          </span>
                        </span>
                        ! Premade items are delivered the same day, and custom
                        items are delivered the day they are ready.
                      </div>
                    </div>
                  </StickyNote>
                </motion.div>
              ) : null}

              <OrderSummary
                items={cartItems}
                discount={discountAmount}
                discountCode={discountCode}
                codFee={codFee}
                shipping={shipping}
                giftWrapFee={giftWrapFee}
                greetingCardFee={greetingCardFee}
              />
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
