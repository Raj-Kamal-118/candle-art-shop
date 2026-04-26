"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Flame,
  Check,
  Package,
  Home,
  ArrowRight,
  MessageCircle,
  XCircle,
  Tag,
  AlertTriangle,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type Order = {
  id: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  status?: string;
  payment_reference?: string;
  shipping_address?: any;
  shippingAddress?: any;
  created_at?: string;
  createdAt?: string;
  items?: any[];
  discountCode?: string;
  payment_method?: string;
  paymentMethod?: string;
};

function formatRange(createdAt?: string) {
  if (!createdAt) return "3–5 days from today";
  const start = new Date(createdAt);
  const from = new Date(start);
  from.setDate(start.getDate() + 3);
  const to = new Date(start);
  to.setDate(start.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(from)} – ${fmt(to)}`;
}

export default function OrderSuccessPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) setOrder(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  const firstName =
    order?.shipping_address?.firstName ||
    order?.shippingAddress?.firstName ||
    "friend";
  const createdAt = order?.created_at || order?.createdAt;
  const arriving = formatRange(createdAt);

  // Check if order is within 1 hour of placement
  const orderTime = new Date(createdAt || new Date()).getTime();
  const diffHours = (new Date().getTime() - orderTime) / (1000 * 60 * 60);
  const isCancelled = order?.status === "cancelled";
  const canCancel =
    diffHours < 1 &&
    (order?.status === "pending" || !order?.status) &&
    !isCancelled;

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        setOrder({ ...order, status: "cancelled" });
        setCancelModalOpen(false);
      }
    } finally {
      setCancelling(false);
    }
  };

  const journey = [
    {
      Icon: Check,
      label: "Order received",
      date: "Today",
      done: true,
      active: false,
    },
    {
      Icon: Flame,
      label: "Hand-poured in studio",
      date: "Next 1–2 days",
      done: false,
      active: true,
    },
    {
      Icon: Package,
      label: "Wrapped & dispatched",
      date: "In 2–3 days",
      done: false,
      active: false,
    },
    {
      Icon: Home,
      label: "Arrives at your door",
      date: arriving,
      done: false,
      active: false,
    },
  ];

  return (
    <div
      className="relative overflow-hidden min-h-[calc(100vh-160px)]"
      style={{
        background:
          "linear-gradient(180deg, var(--cream-100, #faf7f0), var(--cream-50, #fdfcf9), var(--coral-50, #fdf3f2))",
      }}
    >
      <SecondaryHeader
        eyebrow="✦ Order placed ✦"
        titlePrefix="Your story"
        titleHighlighted="begins."
        description={`Thank you, ${firstName}. We've started hand-pouring your order in
          our Varanasi studio. You'll hear from us again when it ships —
          with a little something extra.`}
        backgroundImage="/images/misc/checkout.png"
      />

      <div className="relative max-w-[720px] mx-auto px-6 py-20 text-center">
        <div className="inline-flex flex-wrap items-center gap-6 md:gap-8 bg-white dark:bg-[#1a1830] rounded-2xl px-6 md:px-9 py-5 shadow-sm border border-cream-200 dark:border-amber-900/30 mb-10">
          <div>
            <div className="text-[11px] text-brown-500 dark:text-amber-100/50 uppercase tracking-[0.1em]">
              Order Number
            </div>
            <div className="font-serif text-base font-bold text-brown-900 dark:text-amber-100">
              {loading ? "…" : `#${order?.id ?? params?.id}`}
            </div>
          </div>
          <div className="w-px h-10 bg-cream-200 dark:bg-amber-900/30 hidden sm:block" />
          <div>
            <div className="text-[11px] text-brown-500 dark:text-amber-100/50 uppercase tracking-[0.1em]">
              Arriving
            </div>
            <div className="font-serif text-base font-bold text-brown-900 dark:text-amber-100">
              {arriving}
            </div>
          </div>
          <div className="w-px h-10 bg-cream-200 dark:bg-amber-900/30 hidden sm:block" />
          <div>
            <div className="text-[11px] text-brown-500 dark:text-amber-100/50 uppercase tracking-[0.1em]">
              Total
            </div>
            <div className="font-serif text-base font-bold text-brown-900 dark:text-amber-100">
              {loading ? "…" : formatPrice(order?.total ?? 0)}
            </div>
          </div>
        </div>

        {/* Crafty Status Banner */}
        {order?.status && !isCancelled && (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[20px] p-6 sm:p-8 mb-8 border border-amber-200 dark:border-amber-900/30 flex flex-col sm:flex-row items-center gap-6 text-left">
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                {order.status === "pending"
                  ? "Warming up the wax... 🕯️"
                  : order.status === "processing"
                    ? "Hand-pouring your pieces... 🤲"
                    : order.status === "shipped"
                      ? "On its way to you! 🚚"
                      : order.status === "delivered"
                        ? "Delivered and glowing. ✨"
                        : "Order Update"}
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-100/70 leading-relaxed">
                {order.status === "pending"
                  ? "We've securely received your order and will begin crafting it shortly."
                  : order.status === "processing"
                    ? "Your items are currently in our studio being prepared with care and intention."
                    : order.status === "shipped"
                      ? "Your package has left the studio and is en route to your shipping address."
                      : order.status === "delivered"
                        ? "Your order has safely arrived. We hope it brings warmth, light, and beautiful stories to your space."
                        : ""}
              </p>
            </div>
            {order.status === "delivered" && (
              <button
                onClick={() => router.push(`/review?order=${order.id}`)}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-amber-200 dark:shadow-amber-900/20 transition-all hover:-translate-y-0.5"
              >
                <Star size={16} className="fill-white" /> Leave a Review
              </button>
            )}
          </div>
        )}

        {!isCancelled ? (
          <div className="bg-white dark:bg-[#1a1830] rounded-[20px] p-8 text-left border border-cream-200 dark:border-amber-900/30 mb-8">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-5">
              Your candle&apos;s journey
            </div>
            {journey.map(({ Icon, label, date, done, active }, i, arr) => {
              const last = i === arr.length - 1;
              return (
                <div
                  key={label}
                  className={`relative flex gap-4 items-start ${last ? "" : "pb-4"}`}
                >
                  {!last && (
                    <div
                      className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                        done
                          ? "bg-amber-500"
                          : "bg-cream-200 dark:bg-amber-900/30"
                      }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-none ${
                      done
                        ? "bg-amber-600 text-white"
                        : active
                          ? "bg-coral-500 text-white shadow-[0_0_0_6px_rgba(215,110,96,.15)]"
                          : "bg-cream-100 dark:bg-amber-900/20 text-brown-500 dark:text-amber-100/50"
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="text-[15px] font-semibold text-brown-900 dark:text-amber-100">
                      {label}
                    </div>
                    <div className="text-[13px] text-brown-500 dark:text-amber-100/50">
                      {date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/10 rounded-[20px] p-8 text-left border border-red-100 dark:border-red-900/30 mb-8">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-2">
              <XCircle size={24} />
              <h3 className="font-serif text-xl font-bold">Order Cancelled</h3>
            </div>
            <p className="text-red-800/80 dark:text-red-200/60">
              This order has been successfully cancelled. If you have any
              questions or this was a mistake, please reach out to us.
            </p>
          </div>
        )}

        {/* Full Order Summary */}
        {order?.items && order.items.length > 0 && (
          <div className="bg-white dark:bg-[#1a1830] rounded-[20px] p-6 sm:p-8 text-left border border-cream-200 dark:border-amber-900/30 mb-8">
            <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-6">
              Order Details
            </h3>
            <div className="space-y-4 mb-6">
              {order.items.map((item: any, i: number) => (
                <div key={i}>
                  <div className="flex items-start gap-4">
                    {item.giftSet || !item.productImage ? (
                      <div className="w-16 h-16 rounded-xl bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/30 flex items-center justify-center text-2xl shrink-0">
                        🎁
                      </div>
                    ) : (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-xl object-cover border border-cream-200 dark:border-amber-900/30 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      {item.giftSet && (
                        <p className="text-xs font-medium uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-0.5">
                          {item.giftSet.kind === "custom"
                            ? "Custom Gift Set"
                            : "Gift Set"}
                        </p>
                      )}
                      <p className="font-semibold text-brown-900 dark:text-amber-100 text-sm line-clamp-2">
                        {item.productName}
                      </p>
                      {item.giftSet?.card?.recipient && (
                        <p className="text-xs text-brown-400 mt-0.5 italic line-clamp-1">
                          For {item.giftSet.card.recipient}
                        </p>
                      )}
                      {!item.giftSet &&
                        item.customizations &&
                        Object.entries(item.customizations).length > 0 && (
                          <p className="text-xs text-brown-400 mt-1 line-clamp-1">
                            {Object.entries(item.customizations)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </p>
                        )}
                      <p className="text-xs text-brown-500 dark:text-amber-100/60 mt-1">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="font-bold text-sm text-brown-900 dark:text-amber-100">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Gift set contents */}
                  {item.giftSet?.picks && item.giftSet.picks.length > 0 && (
                    <div
                      className="mt-3 rounded-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden bg-cream-50/50 dark:bg-[#0f0e1c]"
                      style={{ marginLeft: 80 }}
                    >
                      <div className="px-4 py-2.5 border-b border-cream-200 dark:border-amber-900/30 bg-cream-100 dark:bg-[#1a1830]">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brown-600 dark:text-amber-100/70">
                          Inside the Box
                        </span>
                      </div>
                      <div className="p-2.5 space-y-1.5">
                        {item.giftSet.picks.map((pick: any, pi: number) => (
                          <div
                            key={pi}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 shadow-sm"
                          >
                            {pick.image ? (
                              <img
                                src={pick.image}
                                alt={pick.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-black/5 dark:border-white/5"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-lg flex-shrink-0">
                                🕯️
                              </div>
                            )}
                            <span className="text-sm font-semibold text-brown-900 dark:text-amber-100 flex-1 truncate">
                              {pick.name}
                              {pick.qty > 1 && (
                                <span className="font-medium text-brown-500 dark:text-amber-100/60 ml-1.5">
                                  × {pick.qty}
                                </span>
                              )}
                            </span>
                            <span className="text-sm font-bold text-brown-900 dark:text-amber-100 flex-shrink-0">
                              {formatPrice(pick.price * pick.qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 dark:border-amber-900/30 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> Discount{" "}
                    {order.discountCode ? `(${order.discountCode})` : ""}
                  </span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : formatPrice(order.shipping || 0)}
                </span>
              </div>
              {Math.round(
                (order.total || 0) -
                  (order.subtotal || 0) +
                  (order.discount || 0) -
                  (order.shipping || 0),
              ) > 0 && (
                <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                  <span>Cash on Delivery</span>
                  <span>
                    {formatPrice(
                      Math.round(
                        (order.total || 0) -
                          (order.subtotal || 0) +
                          (order.discount || 0) -
                          (order.shipping || 0),
                      ),
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-cream-100 dark:border-amber-900/20 mt-2 text-brown-900 dark:text-amber-100">
                <span>Total</span>
                <span>{formatPrice(order.total || 0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {(order?.shipping_address || order?.shippingAddress) && (
          <div className="bg-white dark:bg-[#1a1830] rounded-[20px] p-6 sm:p-8 text-left border border-cream-200 dark:border-amber-900/30 mb-8">
            <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-3">
              Shipping Address
            </h3>
            <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
              <span className="font-semibold text-brown-900 dark:text-amber-100">
                {(order.shipping_address || order.shippingAddress).fullName}
              </span>
              <br />
              {(order.shipping_address || order.shippingAddress).address1}
              {(order.shipping_address || order.shippingAddress).address2
                ? `, ${(order.shipping_address || order.shippingAddress).address2}`
                : ""}
              <br />
              {(order.shipping_address || order.shippingAddress).city},{" "}
              {(order.shipping_address || order.shippingAddress).state}{" "}
              {(order.shipping_address || order.shippingAddress).postalCode}
              <br />
              {(order.shipping_address || order.shippingAddress).phone &&
                `Phone: ${(order.shipping_address || order.shippingAddress).phone}`}
            </p>
          </div>
        )}

        {(order?.payment_method ||
          order?.paymentMethod ||
          order?.payment_reference) && (
          <div className="bg-white dark:bg-[#1a1830] rounded-[20px] p-6 sm:p-8 text-left border border-cream-200 dark:border-amber-900/30 mb-8">
            <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-3">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="text-sm text-brown-500 dark:text-amber-100/60">
                Method:{" "}
                <span className="font-semibold text-brown-900 dark:text-amber-100">
                  {(order.payment_method || order.paymentMethod) === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>
              {order.payment_reference && (
                <div className="text-sm text-brown-500 dark:text-amber-100/60">
                  Reference:{" "}
                  <span className="font-semibold text-brown-900 dark:text-amber-100">
                    {order.payment_reference}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Need Help / Cancel Section */}
        <div className="bg-cream-50 dark:bg-amber-900/10 rounded-[20px] p-6 sm:p-8 border border-cream-200 dark:border-amber-900/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100">
              Need help?
            </h3>
            <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1">
              Have a question about your order or need to make changes?
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/919519486785"
              className="inline-flex items-center justify-center gap-2 bg-forest-800 text-amber-100 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-900 transition-colors w-full sm:w-auto shadow-md"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors w-full sm:w-auto shadow-sm"
              >
                <XCircle size={16} /> Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => router.push("/account")}
            className="px-6 py-3 bg-white dark:bg-[#1a1830] border border-cream-300 dark:border-amber-900/30 text-brown-900 dark:text-amber-100 font-semibold rounded-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all"
          >
            View order
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-coral-600 hover:bg-coral-700 text-white font-semibold rounded-xl shadow-lg shadow-coral-200 dark:shadow-coral-900/30 hover:-translate-y-0.5 transition-all"
          >
            Keep browsing <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => !cancelling && setCancelModalOpen(false)}
        title="Cancel Order"
        size="md"
      >
        <div className="text-center sm:text-left space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-2">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Wait, are you sure? 🕯️
          </h3>
          <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
            Every piece at Artisan House is handcrafted with love and intention.
            Cancelling means we won't be able to pour this specific piece just
            for you.
          </p>
          <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
            If you just need to make changes to your order (like updating the
            address or scent), please reach out to us on WhatsApp instead!
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCancelModalOpen(false)}
              disabled={cancelling}
            >
              Keep my order
            </Button>
            <Button
              variant="danger"
              className="w-full"
              onClick={handleCancelOrder}
              loading={cancelling}
            >
              Yes, cancel it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
