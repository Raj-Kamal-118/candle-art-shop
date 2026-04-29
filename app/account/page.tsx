"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RotateCcw,
  MessageCircle,
  AlertTriangle,
  Star,
  MapPin,
  Home,
  Trash2,
  Pencil,
  Download,
  Settings,
  Heart,
  FileText,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Order, OrderItem, Address } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AddressForm from "@/components/checkout/AddressForm";
import Receipt from "@/components/order/Receipt";

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
  returning: {
    label: "Returning",
    icon: <RotateCcw size={14} />,
    color: "bg-orange-100 text-orange-800",
    message:
      "Your return request is active. Once the items are received, we will initiate your refund.",
  },
  partially_returning: {
    label: "Partial Return",
    icon: <RotateCcw size={14} />,
    color: "bg-orange-100 text-orange-800",
    message:
      "A return request for some items is active. We will process your partial refund once received.",
  },
  returned: {
    label: "Returned",
    icon: <CheckCircle size={14} />,
    color: "bg-gray-100 text-gray-800",
    message: "This order has been returned and refunded.",
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
  const [deletingAddressIndex, setDeletingAddressIndex] = useState<
    number | null
  >(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );
  const [settingDefaultIndex, setSettingDefaultIndex] = useState<number | null>(
    null,
  );
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null,
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfilePhone, setEditProfilePhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [returnModalOrderId, setReturnModalOrderId] = useState<string | null>(
    null,
  );
  const [returnSelections, setReturnSelections] = useState<
    Record<number, boolean>
  >({});
  const [returningOrder, setReturningOrder] = useState(false);

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

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    clearUser();
    router.push("/");
  };

  const handleDownloadReceipt = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setPrintingOrder(order);
    setTimeout(() => {
      const originalTitle = document.title;
      document.title = `Artisan_house_Order-${order.id}`;
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        setPrintingOrder(null);
      }, 100);
    }, 100); // Small delay allows React to mount the Receipt component
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

  const handleReturnOrder = async () => {
    if (!returnModalOrderId) return;

    const selectedIndices = Object.keys(returnSelections)
      .filter((k) => returnSelections[parseInt(k)])
      .map(Number);

    if (selectedIndices.length === 0) {
      showToast("Please select at least one item to return.");
      return;
    }

    setReturningOrder(true);
    try {
      const res = await fetch(`/api/orders/${returnModalOrderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemsToReturn: selectedIndices }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(
          orders.map((o) => (o.id === returnModalOrderId ? updatedOrder : o)),
        );
        setReturnModalOrderId(null);
        setReturnSelections({});
        showToast("Return initiated successfully");
      }
    } finally {
      setReturningOrder(false);
    }
  };

  const openAccountSettings = () => {
    setEditProfileName(user?.name || "");
    setEditProfilePhone(user?.phone || "");
    setIsAccountSettingsOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: editProfileName,
          phone: editProfilePhone,
        }),
      });
      if (res.ok) {
        const { user: updatedUser } = await res.json();
        setCurrentUser(updatedUser);
        showToast("Profile updated successfully");
        setIsAccountSettingsOpen(false);
      } else {
        showToast("Failed to update profile");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!user) return;
    setDeletingAddressIndex(index);
    try {
      const res = await fetch("/api/user/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, addressIndex: index }),
      });
      if (res.ok) {
        const { user: updatedUser } = await res.json();
        setCurrentUser(updatedUser);
        showToast("Address deleted successfully");
        setConfirmDeleteIndex(null);
      }
    } finally {
      setDeletingAddressIndex(null);
    }
  };

  const handleEditAddress = async (address: Address) => {
    if (!user || editingAddressIndex === null) return;
    setSavingAddress(true);
    try {
      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          addressIndex: editingAddressIndex,
          address,
        }),
      });
      if (res.ok) {
        const { user: updatedUser } = await res.json();
        setCurrentUser(updatedUser);
        setEditingAddressIndex(null);
        showToast("Address updated successfully");
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const handleAddAddress = async (address: Address) => {
    if (!user) return;
    setSavingAddress(true);
    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, address }),
      });
      if (res.ok) {
        const { user: updatedUser } = await res.json();
        setCurrentUser(updatedUser);
        setIsAddingAddress(false);
        showToast("Address added successfully");
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (index: number) => {
    if (!user) return;
    setSettingDefaultIndex(index);
    try {
      const res = await fetch("/api/user/address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, addressIndex: index }),
      });
      if (res.ok) {
        const { user: updatedUser } = await res.json();
        setCurrentUser(updatedUser);
        showToast("Default address set");
      }
    } finally {
      setSettingDefaultIndex(null);
    }
  };

  const user = currentUser;

  if (loading && !user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 lg:grid lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-8 xl:gap-12 items-start animate-pulse">
        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="h-80 bg-cream-50 dark:bg-amber-900/10 rounded-3xl border border-cream-200 dark:border-amber-900/30" />
          <div className="h-40 bg-cream-50 dark:bg-amber-900/10 rounded-3xl border border-cream-200 dark:border-amber-900/30" />
        </div>

        {/* Main content skeleton */}
        <div className="space-y-10">
          <div>
            <div className="h-8 w-48 bg-cream-200 dark:bg-amber-900/20 rounded-lg mb-6" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="h-32 bg-cream-50 dark:bg-amber-900/10 rounded-2xl" />
              <div className="h-32 bg-cream-50 dark:bg-amber-900/10 rounded-2xl" />
            </div>
          </div>
          <div>
            <div className="h-8 w-40 bg-cream-200 dark:bg-amber-900/20 rounded-lg mb-6" />
            <div className="space-y-4">
              <div className="h-24 bg-cream-50 dark:bg-amber-900/10 rounded-2xl" />
              <div className="h-24 bg-cream-50 dark:bg-amber-900/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          header, footer { display: none !important; }
        }
      `,
        }}
      />
      <div className="print:hidden max-w-[1440px] mx-auto px-4 sm:px-6 py-12 lg:grid lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-8 xl:gap-12 items-start">
        {/* Sidebar: Profile & Support */}
        <div className="space-y-6 lg:sticky lg:top-28 mb-10 lg:mb-0">
          {/* Profile Card */}
          <div className="bg-white dark:bg-[#1a1830] rounded-3xl p-6 md:p-8 border border-cream-200 dark:border-amber-900/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-cream-50 dark:bg-amber-900/20" />
            <div className="relative">
              <div className="w-20 h-20 bg-white dark:bg-[#1a1830] rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-[#1a1830] shadow-sm">
                <div className="w-full h-full bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                  <User
                    size={32}
                    className="text-amber-700 dark:text-amber-400"
                  />
                </div>
              </div>
              <h1 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 leading-tight">
                {user?.name || "My Account"}
              </h1>
              <p className="text-sm text-brown-600 dark:text-amber-100/70 mt-1 font-medium">
                {user?.phone}
              </p>
              {user?.email && (
                <p className="text-xs text-brown-500 dark:text-amber-100/50 mt-0.5">
                  {user.email}
                </p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                <div className="bg-cream-50 dark:bg-[#0f0e1c] rounded-2xl p-4 border border-cream-100 dark:border-amber-900/20 text-center">
                  <p className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100">
                    {orders.length}
                  </p>
                  <p className="text-[10px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mt-1">
                    Orders
                  </p>
                </div>
                <div className="bg-cream-50 dark:bg-[#0f0e1c] rounded-2xl p-4 border border-cream-100 dark:border-amber-900/20 text-center">
                  <p className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100">
                    {user.savedAddresses?.length || 0}
                  </p>
                  <p className="text-[10px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mt-1">
                    Addresses
                  </p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-1.5 border-t border-cream-100 dark:border-amber-900/20 pt-5">
                <button
                  onClick={openAccountSettings}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brown-800 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                >
                  <Settings size={18} className="text-brown-400" /> Account
                  Settings
                </button>
                <button
                  onClick={() => router.push("/favorites")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brown-800 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                >
                  <Heart size={18} className="text-brown-400" /> Wishlist
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut size={18} className="text-red-500" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Contact Help */}
          <div className="bg-forest-900 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl hidden lg:block border border-forest-800">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 0%, rgba(251,191,36,.15), transparent 50%)",
              }}
            />
            <div className="relative">
              <h3 className="font-serif text-xl font-bold mb-2">Need help?</h3>
              <p className="text-sm text-forest-200 mb-6 leading-relaxed">
                Have a question about your order or a custom request? We usually
                reply within an hour.
              </p>
              <a
                href="https://wa.me/919519486785"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-forest-900 px-4 py-3.5 rounded-xl text-sm font-bold hover:bg-cream-50 transition-colors shadow-sm"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Main Content: Addresses & Orders */}
        <div className="space-y-12 min-w-0">
          {/* Saved Addresses */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin size={22} className="text-amber-700" />
                <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
                  Saved Addresses
                </h2>
              </div>
              <button
                onClick={() => setIsAddingAddress(true)}
                disabled={(user.savedAddresses?.length || 0) >= 8}
                title={
                  (user.savedAddresses?.length || 0) >= 8
                    ? "Maximum of 8 addresses reached"
                    : undefined
                }
                className="text-sm font-bold text-coral-600 hover:text-coral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-coral-600"
              >
                + Add New
              </button>
            </div>

            {!user.savedAddresses || user.savedAddresses.length === 0 ? (
              <div className="bg-white dark:bg-[#1a1830] rounded-3xl border border-cream-200 dark:border-amber-900/30 p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-cream-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cream-100 dark:border-amber-900/30">
                  <Home
                    size={24}
                    className="text-brown-400 dark:text-amber-600"
                  />
                </div>
                <p className="text-brown-800 dark:text-amber-100 font-semibold text-lg">
                  No saved addresses yet
                </p>
                <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-2 max-w-sm mx-auto">
                  Addresses saved during checkout will appear here for quicker
                  access on your next visit.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#1a1830] rounded-2xl p-5 shadow-sm border border-cream-200 dark:border-amber-900/30 relative group transition-all hover:shadow-md"
                  >
                    <p className="font-bold text-brown-900 dark:text-amber-100 mb-1">
                      {addr.fullName}
                    </p>
                    <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
                      {addr.address1}
                      {addr.address2 && (
                        <>
                          <br />
                          {addr.address2}
                        </>
                      )}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      <span className="text-xs text-brown-500 dark:text-amber-100/50 mt-2 block font-medium tracking-wide">
                        {addr.phone}
                      </span>
                    </p>
                    {addr.isDefault && (
                      <span className="absolute bottom-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider z-10 shadow-sm">
                        Default
                      </span>
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-1 transition-all">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(index)}
                          disabled={settingDefaultIndex === index}
                          className="p-2 text-brown-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors disabled:opacity-50 text-xs font-semibold"
                          title="Set as default"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => setEditingAddressIndex(index)}
                        className="p-2 text-brown-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                        title="Edit address"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteIndex(index)}
                        disabled={deletingAddressIndex === index}
                        className="p-2 text-brown-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Orders Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag size={22} className="text-amber-700" />
              <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
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
              <div className="text-center py-16 bg-white dark:bg-[#1a1830] rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm">
                <div className="w-20 h-20 bg-cream-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-cream-100 dark:border-amber-900/30">
                  <ShoppingBag
                    size={32}
                    className="text-brown-300 dark:text-amber-700/50"
                  />
                </div>
                <p className="text-brown-800 dark:text-amber-100 font-bold text-lg">
                  No orders yet
                </p>
                <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-2 max-w-sm mx-auto">
                  Once you place an order, all its tracking and details will
                  appear right here.
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="mt-8 inline-flex items-center gap-2 bg-coral-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-coral-700 hover:-translate-y-0.5 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const status =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const isExpanded = expandedOrder === order.id;

                  const orderTime = new Date(order.createdAt).getTime();
                  const diffHours =
                    (new Date().getTime() - orderTime) / (1000 * 60 * 60);
                  const canCancel =
                    diffHours < 1 &&
                    (order.status === "pending" || !order.status);

                  return (
                    <div
                      key={order.id}
                      className={`bg-white dark:bg-[#1a1830] rounded-3xl shadow-sm border overflow-hidden transition-colors ${isExpanded ? "border-amber-200 dark:border-amber-900/50 shadow-md" : "border-cream-200 dark:border-amber-900/30"}`}
                    >
                      {/* Order row */}
                      <button
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between p-5 sm:p-6 text-left hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors group gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="hidden sm:flex w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex-none items-center justify-center border border-amber-100 dark:border-amber-900/40">
                            <Package
                              size={20}
                              className="text-amber-700 dark:text-amber-400"
                            />
                          </div>
                          <div>
                            <p className="text-base font-bold text-brown-900 dark:text-amber-100">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs font-medium text-brown-500 dark:text-amber-100/60 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                              {" · "}
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-2 sm:gap-4">
                            {status.label === "Delivered" &&
                              !order.is_reviewed && (
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shadow-sm">
                                  <Star
                                    size={14}
                                    className="fill-amber-500 text-amber-500"
                                  />{" "}
                                  Rate Order
                                </span>
                              )}
                            <span
                              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${status.color}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                            <p className="font-bold text-brown-900 dark:text-amber-100 text-lg">
                              {formatPrice(order.total)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 border-l border-cream-200 dark:border-amber-900/30 pl-3 sm:pl-4">
                            <div
                              onClick={(e) => handleDownloadReceipt(e, order)}
                              className="p-2.5 text-brown-400 hover:text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 rounded-xl transition-all"
                              title="Download Receipt"
                            >
                              <Download size={18} />
                            </div>
                            <div className="p-2.5 text-brown-400 bg-cream-50 dark:bg-amber-900/20 group-hover:bg-cream-100 dark:group-hover:bg-amber-900/40 rounded-xl transition-colors">
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-cream-200 dark:border-amber-900/30 p-5 sm:p-7 space-y-6 bg-cream-50/30 dark:bg-[#151326]">
                          {/* Mobile Status Tag */}
                          <div className="md:hidden flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                              {status.icon} {status.label}
                            </span>
                            {status.label === "Delivered" &&
                              !order.is_reviewed && (
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
                            {status.label === "Delivered" &&
                              order.is_reviewed && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                  <Star
                                    size={12}
                                    className="fill-green-600 text-green-600"
                                  />
                                  Reviewed
                                </span>
                              )}
                          </div>

                          {/* Fun Status Message */}
                          <div className="bg-white dark:bg-amber-900/10 border border-cream-200 dark:border-amber-900/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                            <div className="text-amber-600 dark:text-amber-400 mt-0.5 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-xl">
                              {status.icon}
                            </div>
                            <p className="text-[15px] text-brown-800 dark:text-amber-100/90 leading-relaxed font-medium">
                              {status.message}
                            </p>
                          </div>

                          {/* Items Loop */}
                          <div className="space-y-6">
                            {order.items.map((item: OrderItem, i: number) => (
                              <div key={i}>
                                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                  {item.giftSet ? (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center flex-none text-4xl shadow-sm">
                                      🎁
                                    </div>
                                  ) : (
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-none shadow-sm border border-cream-200 dark:border-amber-900/30"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0 pt-1 sm:pt-0">
                                    {item.giftSet && (
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
                                        {item.giftSet.kind === "custom"
                                          ? "Custom Gift Set"
                                          : "Gift Set"}
                                      </p>
                                    )}
                                    {(item as any).return_status ===
                                      "returning" && (
                                      <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 rounded-md border border-orange-200">
                                        Returning
                                      </span>
                                    )}
                                    <p className="text-base font-bold text-brown-900 dark:text-amber-100 line-clamp-1">
                                      {item.productName}
                                    </p>
                                    {item.giftSet?.card.recipient && (
                                      <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1 italic">
                                        For {item.giftSet.card.recipient}
                                      </p>
                                    )}
                                    {!item.giftSet &&
                                      item.customizations &&
                                      Object.keys(item.customizations).length >
                                        0 && (
                                        <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1 line-clamp-2">
                                          {Object.entries(item.customizations)
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(" · ")}
                                        </p>
                                      )}
                                    <div className="flex items-center gap-3 mt-2">
                                      <p className="text-sm font-semibold text-brown-600 dark:text-amber-100/70 bg-cream-100 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                                        Qty {item.quantity}
                                      </p>
                                      <p className="text-sm text-brown-500 dark:text-amber-100/60">
                                        {formatPrice(item.price)} each
                                      </p>
                                    </div>
                                    {item.rating && (
                                      <div className="flex items-center gap-1 mt-3">
                                        {[...Array(5)].map((_, starIdx) => (
                                          <Star
                                            key={starIdx}
                                            size={14}
                                            className={
                                              starIdx < item.rating!
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-cream-200 text-cream-200 dark:fill-amber-900/30"
                                            }
                                          />
                                        ))}
                                        <span className="text-xs text-brown-500 dark:text-amber-100/50 ml-1.5 font-bold uppercase tracking-wider">
                                          Your rating
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-base font-bold text-brown-900 dark:text-amber-100 flex-none mt-1 sm:mt-0">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>

                                {/* Gift set contents nested block */}
                                {item.giftSet?.picks &&
                                  item.giftSet.picks.length > 0 && (
                                    <div className="mt-4 rounded-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden bg-cream-50/80 dark:bg-[#0f0e1c] ml-0 sm:ml-[120px]">
                                      <div className="px-5 py-3 border-b border-cream-200 dark:border-amber-900/30 bg-white dark:bg-[#1a1830]">
                                        <span className="text-xs font-bold uppercase tracking-widest text-brown-600 dark:text-amber-100/70">
                                          Inside the Box
                                        </span>
                                      </div>
                                      <div className="p-3 space-y-2">
                                        {item.giftSet.picks.map((pick, pi) => (
                                          <div
                                            key={pi}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 shadow-sm"
                                          >
                                            {pick.image ? (
                                              <img
                                                src={pick.image}
                                                alt={pick.name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-black/5 dark:border-white/5"
                                              />
                                            ) : (
                                              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xl flex-shrink-0">
                                                🕯️
                                              </div>
                                            )}
                                            <span className="text-sm font-bold text-brown-900 dark:text-amber-100 flex-1 truncate">
                                              {pick.name}
                                              {pick.qty > 1 && (
                                                <span className="font-semibold text-brown-500 dark:text-amber-100/60 ml-2">
                                                  × {pick.qty}
                                                </span>
                                              )}
                                            </span>
                                            <span className="text-sm font-bold text-brown-900 dark:text-amber-100 flex-shrink-0">
                                              {formatPrice(
                                                pick.price * pick.qty,
                                              )}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>

                          {/* Crafty Star Rating Section */}
                          {status.label === "Delivered" &&
                            !order.is_reviewed && (
                              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/40 text-center shadow-sm relative overflow-hidden">
                                <div className="w-12 h-12 bg-white dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-amber-100 dark:border-amber-800/50">
                                  <Star
                                    size={24}
                                    className="text-amber-500 fill-amber-500"
                                  />
                                </div>
                                <h4 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-1">
                                  How did we do?
                                </h4>
                                <p className="text-[15px] text-brown-600 dark:text-amber-100/70 mb-5">
                                  Your feedback helps us pour better stories.
                                  Tap a star to rate your items.
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                          `/review?order=${order.id}&rating=${star}`,
                                        );
                                      }}
                                      className="text-amber-300 dark:text-amber-700 hover:text-amber-500 dark:hover:text-amber-400 transition-all transform hover:scale-110"
                                    >
                                      <Star
                                        size={36}
                                        className="fill-current"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Financial Summary */}
                          <div className="border-t border-cream-200 dark:border-amber-900/30 pt-5 space-y-2.5">
                            <div className="flex justify-between text-[15px] text-brown-600 dark:text-amber-100/70">
                              <span>Subtotal</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-sm text-green-700">
                                <span>
                                  Discount{" "}
                                  {order.discountCode &&
                                    `(${order.discountCode})`}
                                </span>
                                <span>-{formatPrice(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[15px] text-brown-600 dark:text-amber-100/70">
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
                                <span>COD Handling</span>
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
                            <div className="flex justify-between text-lg font-bold text-brown-900 dark:text-amber-100 pt-3 mt-3 border-t border-cream-200 dark:border-amber-900/30">
                              <span>Total</span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                            <div className="pt-4 flex justify-end">
                              <button
                                onClick={(e) => handleDownloadReceipt(e, order)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1a1830] hover:bg-cream-50 dark:hover:bg-amber-900/40 text-brown-800 dark:text-amber-100 rounded-xl text-sm font-bold transition-colors border border-cream-200 dark:border-amber-900/50 shadow-sm"
                              >
                                <FileText
                                  size={18}
                                  className="text-amber-700"
                                />{" "}
                                Download Invoice
                              </button>
                            </div>
                          </div>

                          {/* Meta Grid (Shipping + Payment) */}
                          <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            {order.shippingAddress && (
                              <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-5 border border-cream-200 dark:border-amber-900/30 shadow-sm">
                                <p className="text-[10px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                                  Delivered to
                                </p>
                                <p className="text-sm text-brown-800 dark:text-amber-100/90 leading-relaxed">
                                  <span className="font-semibold">
                                    {order.shippingAddress.fullName}
                                  </span>
                                  <br />
                                  {order.shippingAddress.address1}
                                  {order.shippingAddress.city &&
                                    `, ${order.shippingAddress.city}`}
                                  {order.shippingAddress.state &&
                                    `, ${order.shippingAddress.state}`}
                                  {order.shippingAddress.postalCode &&
                                    ` - ${order.shippingAddress.postalCode}`}
                                </p>
                              </div>
                            )}

                            {(order.paymentMethod ||
                              order.paymentReference) && (
                              <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-5 border border-cream-200 dark:border-amber-900/30 shadow-sm">
                                <p className="text-[10px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                                  Payment Details
                                </p>
                                <p className="text-sm text-brown-800 dark:text-amber-100/90 leading-relaxed font-medium">
                                  {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                                  {order.paymentReference && (
                                    <>
                                      <br />
                                      <span className="text-brown-500 font-normal">
                                        Ref: {order.paymentReference}
                                      </span>
                                    </>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Return Order Block */}
                          {status.label === "Delivered" && (
                            <div className="bg-cream-50 dark:bg-amber-900/10 rounded-2xl p-5 mt-4 border border-cream-200 dark:border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div>
                                <p className="text-[15px] font-bold text-brown-900 dark:text-amber-100">
                                  Not completely satisfied?
                                </p>
                                <p className="text-sm text-brown-600 dark:text-amber-100/70 mt-0.5">
                                  You can request a return within 7 days of
                                  delivery.
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReturnModalOrderId(order.id);
                                }}
                                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 text-sm text-brown-800 dark:text-amber-100 bg-white dark:bg-[#1a1830] border border-brown-200 dark:border-amber-700/50 px-5 py-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-amber-900/40 font-semibold transition-all shadow-sm"
                              >
                                <RotateCcw size={16} /> Return Order
                              </button>
                            </div>
                          )}

                          {canCancel && (
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 mt-4 border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <p className="text-sm text-red-800 dark:text-red-200">
                                Need to cancel? You have 1 hour from placement
                                to cancel this order.
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
          </section>
        </div>

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
              Every piece at Artisan House is handcrafted with love and
              intention. Cancelling means we won't be able to pour this specific
              piece just for you.
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

        {/* Return Order Modal */}
        <Modal
          isOpen={!!returnModalOrderId}
          onClose={() => {
            if (returningOrder) return;
            setReturnModalOrderId(null);
            setReturnSelections({});
          }}
          title="Return Order"
          size="md"
        >
          <div className="text-center sm:text-left space-y-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <RotateCcw size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
              Return this order?
            </h3>
            <p className="text-[15px] text-brown-600 dark:text-amber-100/70 leading-relaxed">
              We're sorry the pieces didn't work out for you. Once you initiate
              a return, we will arrange a pickup from your delivery address.
            </p>
            <p className="text-sm font-medium text-brown-800 dark:text-amber-100/90 bg-cream-50 dark:bg-amber-900/20 p-4 rounded-xl border border-cream-100 dark:border-amber-900/30">
              <strong className="font-bold">Refund Process:</strong> Once the
              order is successfully returned to our studio, we will initiate
              your refund immediately. It typically reflects in your original
              payment method within 5-7 business days.
            </p>

            {/* Items selection UI */}
            <div className="max-h-[35vh] overflow-y-auto space-y-3 bg-cream-50 dark:bg-amber-900/10 p-3 rounded-2xl border border-cream-100 dark:border-amber-900/30 text-left mt-4 shadow-inner">
              <p className="text-[11px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest px-2 mb-1">
                Select items to return:
              </p>
              {orders
                .find((o) => o.id === returnModalOrderId)
                ?.items.map((item: any, idx: number) => {
                  const isReturned =
                    item.return_status === "returned" ||
                    item.return_status === "returning";
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${isReturned ? "opacity-50 grayscale cursor-not-allowed border-cream-200 dark:border-amber-900/30" : returnSelections[idx] ? "bg-white dark:bg-[#1a1830] border-orange-400 shadow-sm" : "bg-white dark:bg-[#1a1830] border-transparent hover:border-orange-200 dark:hover:border-amber-700/50"}`}
                    >
                      <input
                        type="checkbox"
                        disabled={isReturned}
                        className="w-4 h-4 accent-orange-600 rounded cursor-pointer shrink-0"
                        checked={!!returnSelections[idx]}
                        onChange={(e) =>
                          setReturnSelections((prev) => ({
                            ...prev,
                            [idx]: e.target.checked,
                          }))
                        }
                      />
                      <img
                        src={item.productImage || ""}
                        className="w-12 h-12 rounded-lg object-cover border border-cream-100 dark:border-amber-900/30 shrink-0"
                        alt={item.productName}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-brown-900 dark:text-amber-100 truncate">
                          {item.productName}
                        </div>
                        <div className="text-xs text-brown-500 dark:text-amber-100/60 mt-0.5">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-[15px] font-bold text-brown-900 dark:text-amber-100 pl-2">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </label>
                  );
                })}
            </div>
            <p className="text-[13px] text-brown-500 dark:text-amber-100/60 mt-3 text-left italic font-medium px-1">
              Note: Shipping and COD fees are strictly non-refundable.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setReturnModalOrderId(null)}
                disabled={returningOrder}
              >
                Keep my order
              </Button>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 dark:shadow-none border-none"
                onClick={handleReturnOrder}
                loading={returningOrder}
              >
                Initiate Return
              </Button>
            </div>
          </div>
        </Modal>

        {/* Account Settings Modal */}
        <Modal
          isOpen={isAccountSettingsOpen}
          onClose={() => !savingProfile && setIsAccountSettingsOpen(false)}
          title="Account Settings"
          size="md"
        >
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-5 pt-2 text-left"
          >
            <div>
              <label className="block text-[13px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editProfileName}
                onChange={(e) => setEditProfileName(e.target.value)}
                required
                className="w-full px-4 py-3 text-base sm:text-sm bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={editProfilePhone}
                onChange={(e) => setEditProfilePhone(e.target.value)}
                required
                className="w-full px-4 py-3 text-base sm:text-sm bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900"
              />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full" loading={savingProfile}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Address Modal */}
        <Modal
          isOpen={editingAddressIndex !== null}
          onClose={() => !savingAddress && setEditingAddressIndex(null)}
          title="Edit Address"
          size="md"
        >
          <div className="pt-2 text-left">
            {editingAddressIndex !== null &&
              user?.savedAddresses?.[editingAddressIndex] && (
                <div
                  className={
                    savingAddress ? "opacity-50 pointer-events-none" : ""
                  }
                >
                  <AddressForm
                    defaultValues={user.savedAddresses[editingAddressIndex]}
                    onSubmit={handleEditAddress}
                    submitLabel={savingAddress ? "Saving..." : "Save Changes"}
                  />
                </div>
              )}
          </div>
        </Modal>

        {/* Add Address Modal */}
        <Modal
          isOpen={isAddingAddress}
          onClose={() => !savingAddress && setIsAddingAddress(false)}
          title="Add New Address"
          size="md"
        >
          <div className="pt-2 text-left">
            <div
              className={savingAddress ? "opacity-50 pointer-events-none" : ""}
            >
              <AddressForm
                defaultValues={
                  {
                    fullName: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    address1: "",
                    address2: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "India",
                    isDefault: user?.savedAddresses?.length === 0,
                  } as Address
                }
                onSubmit={handleAddAddress}
                submitLabel={savingAddress ? "Saving..." : "Save Address"}
              />
            </div>
          </div>
        </Modal>

        {/* Delete Address Modal */}
        <Modal
          isOpen={confirmDeleteIndex !== null}
          onClose={() => {
            if (deletingAddressIndex === null) {
              setConfirmDeleteIndex(null);
            }
          }}
          title="Delete Address"
          size="md"
        >
          <div className="text-center sm:text-left space-y-4 pt-2">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
              Are you sure?
            </h3>
            <p className="text-[15px] text-brown-600 dark:text-amber-100/70 leading-relaxed">
              This will permanently delete this address from your saved
              addresses. You can't undo this action.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setConfirmDeleteIndex(null)}
                disabled={deletingAddressIndex !== null}
              >
                Keep Address
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  if (confirmDeleteIndex !== null) {
                    handleDeleteAddress(confirmDeleteIndex);
                  }
                }}
                loading={deletingAddressIndex !== null}
              >
                Delete Address
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-0 right-0 sm:left-auto sm:right-6 z-50 flex justify-center pointer-events-none"
            >
              <div className="bg-forest-800 dark:bg-amber-100 text-white dark:text-brown-900 px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 pointer-events-auto mx-4 sm:mx-0 w-max">
                <CheckCircle
                  size={18}
                  className="text-amber-400 dark:text-brown-600"
                />
                <span className="text-sm font-medium">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {printingOrder && <Receipt order={printingOrder} />}
    </>
  );
}
