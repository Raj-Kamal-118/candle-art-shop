"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MessageCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Order, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; message: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock size={14} />,
    color: "bg-yellow-100 text-yellow-800",
    message: "We've received your order and are warming up the wax. 🕯️",
  },
  processing: {
    label: "Processing",
    icon: <Package size={14} />,
    color: "bg-blue-100 text-blue-800",
    message:
      "Your order is in the studio. We are currently hand-pouring and preparing your items. 🤲",
  },
  shipped: {
    label: "Shipped",
    icon: <Truck size={14} />,
    color: "bg-purple-100 text-purple-800",
    message: "Your package has left our studio and is on its way to you! 🚚",
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircle size={14} />,
    color: "bg-green-100 text-green-800",
    message:
      "Your order has been safely delivered. We hope it brings warmth to your space. ✨",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={14} />,
    color: "bg-red-100 text-red-800",
    message:
      "This order was cancelled. If this was a mistake, we'd love to help you place a new one.",
  },
};

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, clearUser } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);

  // Fetch server-side session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setCurrentUser(user);
          fetchOrders();
        } else {
          setLoading(false);
          if (!currentUser) setLoginOpen(true);
        }
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/my-orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.user) setCurrentUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    fetchOrders();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    clearUser();
    router.push("/");
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrderId) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${cancelModalOrderId}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === cancelModalOrderId ? { ...o, status: "cancelled" } : o,
          ),
        );
        setCancelModalOrderId(null);
      }
    } finally {
      setCancelling(false);
    }
  };

  const user = currentUser;

  if (!user && !loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={32} className="text-amber-700" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brown-900 mb-3">
          My Account
        </h1>
        <p className="text-brown-500 mb-8">
          Log in with your email or Google account to view your orders and
          account details.
        </p>
        <button
          onClick={() => setLoginOpen(true)}
          className="inline-flex items-center gap-2 bg-coral-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-coral-700 transition-colors shadow-lg"
        >
          Log in / Sign up
        </button>
        <AuthModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
            <User size={26} className="text-amber-700" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brown-900">
              {user?.name || "My Account"}
            </h1>
            <p className="text-sm text-brown-500">{user?.phone}</p>
            {user?.email && (
              <p className="text-xs text-brown-400">{user.email}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-brown-500 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {/* Contact Help */}
      <div className="bg-forest-50 dark:bg-forest-900/20 rounded-2xl p-6 mb-10 border border-forest-100 dark:border-forest-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-forest-900 dark:text-amber-100">
            Need help with an order?
          </h3>
          <p className="text-sm text-forest-700 dark:text-amber-100/60 mt-1">
            Reach out to us on WhatsApp and we'll be happy to assist.
          </p>
        </div>
        <a
          href="https://wa.me/919519486785"
          className="shrink-0 inline-flex items-center gap-2 bg-coral-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-coral-700 transition-colors shadow-md"
        >
          <MessageCircle size={18} /> WhatsApp Us
        </a>
      </div>

      {/* Orders */}
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag size={20} className="text-amber-700" />
        <h2 className="font-serif text-xl font-bold text-brown-900">
          Order History
        </h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-200">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Your orders will appear here after checkout.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="mt-6 inline-flex items-center gap-2 bg-coral-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-coral-700 text-sm transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedOrder === order.id;

            const orderTime = new Date(order.createdAt).getTime();
            const diffHours =
              (new Date().getTime() - orderTime) / (1000 * 60 * 60);
            const canCancel =
              diffHours < 1 && (order.status === "pending" || !order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden"
              >
                {/* Order row */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block w-10 h-10 bg-amber-50 rounded-xl flex-none flex items-center justify-center">
                      <Package size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brown-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-brown-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {" · "}
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {status.label === "Delivered" && !order.is_reviewed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/review?order=${order.id}`);
                        }}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors shadow-sm"
                      >
                        <Star
                          size={14}
                          className="fill-amber-500 text-amber-500"
                        />
                        Review
                      </button>
                    )}
                    {status.label === "Delivered" && order.is_reviewed && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 shadow-sm border border-green-200">
                        <Star
                          size={14}
                          className="fill-green-600 text-green-600"
                        />
                        Reviewed {order.rating ? `(${order.rating})` : ""}
                      </span>
                    )}
                    <span
                      className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <p className="font-bold text-brown-900">
                      {formatPrice(order.total)}
                    </p>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-brown-400" />
                    ) : (
                      <ChevronDown size={16} className="text-brown-400" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-cream-200 p-5 space-y-4">
                    {/* Mobile status */}
                    <div className="sm:hidden flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
                      {status.label === "Delivered" && !order.is_reviewed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/review?order=${order.id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                        >
                          <Star
                            size={12}
                            className="fill-amber-500 text-amber-500"
                          />
                          Review
                        </button>
                      )}
                      {status.label === "Delivered" && order.is_reviewed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                          <Star
                            size={12}
                            className="fill-green-600 text-green-600"
                          />
                          Reviewed
                        </span>
                      )}
                    </div>

                    {/* Crafty Status Message */}
                    <div className="bg-cream-50 dark:bg-amber-900/10 border border-cream-200 dark:border-amber-900/30 rounded-xl p-4 flex items-start gap-3 mb-2">
                      <div className="text-amber-600 dark:text-amber-400 mt-0.5">
                        {status.icon}
                      </div>
                      <p className="text-sm text-brown-800 dark:text-amber-200/90 leading-relaxed font-medium">
                        {status.message}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item: OrderItem, i: number) => (
                        <div key={i}>
                          <div className="flex items-center gap-3">
                            {item.giftSet ? (
                              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-none text-2xl">
                                🎁
                              </div>
                            ) : (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-14 h-14 rounded-xl object-cover flex-none"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              {item.giftSet && (
                                <p className="text-xs font-medium uppercase tracking-widest text-amber-700 mb-0.5">
                                  {item.giftSet.kind === "custom"
                                    ? "Custom Gift Set"
                                    : "Gift Set"}
                                </p>
                              )}
                              <p className="text-sm font-medium text-brown-900 line-clamp-1">
                                {item.productName}
                              </p>
                              {item.giftSet?.card.recipient && (
                                <p className="text-xs text-brown-400 mt-0.5 italic">
                                  For {item.giftSet.card.recipient}
                                </p>
                              )}
                              {!item.giftSet &&
                                item.customizations &&
                                Object.keys(item.customizations).length > 0 && (
                                  <p className="text-xs text-brown-400 mt-0.5">
                                    {Object.entries(item.customizations)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(" · ")}
                                  </p>
                                )}
                              <p className="text-xs text-brown-500 mt-0.5">
                                Qty {item.quantity} × {formatPrice(item.price)}
                              </p>
                              {item.rating && (
                                <div className="flex items-center gap-0.5 mt-1.5">
                                  {[...Array(5)].map((_, starIdx) => (
                                    <Star
                                      key={starIdx}
                                      size={12}
                                      className={
                                        starIdx < item.rating!
                                          ? "fill-amber-400 text-amber-400"
                                          : "fill-cream-200 text-cream-200"
                                      }
                                    />
                                  ))}
                                  <span className="text-[10px] text-brown-500 dark:text-amber-100/50 ml-1 font-medium">
                                    Your rating
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-brown-900 flex-none">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          {/* Gift set contents */}
                          {item.giftSet?.picks &&
                            item.giftSet.picks.length > 0 && (
                              <div
                                className="mt-3 rounded-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden bg-cream-50/50 dark:bg-[#0f0e1c]"
                                style={{ marginLeft: 68 }}
                              >
                                <div className="px-4 py-2.5 border-b border-cream-200 dark:border-amber-900/30 bg-cream-100 dark:bg-[#1a1830]">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-brown-600 dark:text-amber-100/70">
                                    Inside the Box
                                  </span>
                                </div>
                                <div className="p-2.5 space-y-1.5">
                                  {item.giftSet.picks.map((pick, pi) => (
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

                    {/* Summary */}
                    <div className="border-t border-cream-100 pt-3 space-y-1">
                      <div className="flex justify-between text-sm text-brown-500">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-700">
                          <span>
                            Discount{" "}
                            {order.discountCode && `(${order.discountCode})`}
                          </span>
                          <span>-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-brown-500">
                        <span>Shipping</span>
                        <span>
                          {order.shipping === 0
                            ? "Free"
                            : formatPrice(order.shipping)}
                        </span>
                      </div>
                      {Math.round(
                        order.total -
                          order.subtotal +
                          order.discount -
                          order.shipping,
                      ) > 0 && (
                        <div className="flex justify-between text-sm text-brown-500">
                          <span>Cash on Delivery</span>
                          <span>
                            {formatPrice(
                              Math.round(
                                order.total -
                                  order.subtotal +
                                  order.discount -
                                  order.shipping,
                              ),
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-brown-900 pt-1 border-t border-cream-100">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-brown-600 uppercase tracking-wide mb-1">
                        Delivered to
                      </p>
                      <p className="text-sm text-brown-700">
                        {order.shippingAddress.fullName} ·{" "}
                        {order.shippingAddress.address1}
                        {order.shippingAddress.city &&
                          `, ${order.shippingAddress.city}`}
                        {order.shippingAddress.state &&
                          `, ${order.shippingAddress.state}`}
                        {order.shippingAddress.postalCode &&
                          ` - ${order.shippingAddress.postalCode}`}
                      </p>
                    </div>

                    {/* Payment details */}
                    <div className="bg-cream-50 dark:bg-amber-900/10 rounded-xl p-4 mt-3 border border-cream-100 dark:border-amber-900/20">
                      <p className="text-xs font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wide mb-1">
                        Payment Details
                      </p>
                      <p className="text-sm text-brown-700 dark:text-amber-100/80">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                        {order.paymentReference &&
                          ` · Ref: ${order.paymentReference}`}
                      </p>
                    </div>

                    {/* Cancellation Block */}
                    {canCancel && (
                      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 mt-4 border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          Need to cancel? You have 1 hour from placement to
                          cancel this order.
                        </p>
                        <button
                          onClick={() => setCancelModalOrderId(order.id)}
                          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 text-sm text-red-600 bg-white dark:bg-[#1a1830] border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 font-semibold transition-colors shadow-sm"
                        >
                          <XCircle size={16} /> Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      <Modal
        isOpen={!!cancelModalOrderId}
        onClose={() => !cancelling && setCancelModalOrderId(null)}
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
              onClick={() => setCancelModalOrderId(null)}
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
