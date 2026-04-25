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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Order, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock size={14} />,
    color: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    label: "Processing",
    icon: <Package size={14} />,
    color: "bg-blue-100 text-blue-800",
  },
  shipped: {
    label: "Shipped",
    icon: <Truck size={14} />,
    color: "bg-purple-100 text-purple-800",
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircle size={14} />,
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={14} />,
    color: "bg-red-100 text-red-800",
  },
};

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, clearUser } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
                    <div className="sm:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.icon} {status.label}
                      </span>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
