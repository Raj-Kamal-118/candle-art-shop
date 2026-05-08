"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import { Order, OrderItem } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import CopyFeedbackLink from "@/components/admin/CopyFeedbackLink";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [testFilter, setTestFilter] = useState<string>("real");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        // API already returns newest first — no reverse needed
        setOrders(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter, statusFilter, testFilter, dateFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, status: string) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (error) {
      console.error("Status update failed", error);
      setOrders(previousOrders);
    }
  };

  const handleTestToggle = async (orderId: string, isTest: boolean) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isTest } : o)),
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTest }),
      });
      if (!res.ok) throw new Error("Failed to update test flag");
    } catch (error) {
      console.error("Test toggle failed", error);
      setOrders(previousOrders);
    }
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case "payment_verification":
        return "warning";
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "default";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchPayment =
      paymentFilter === "all" ? true : o.paymentMethod === paymentFilter;
    const matchStatus =
      statusFilter === "all" ? true : o.status === statusFilter;
    const matchTest =
      testFilter === "all" ? true : testFilter === "test" ? !!o.isTest : !o.isTest;
    const matchDate = (() => {
      if (dateFilter === "all") return true;
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      if (dateFilter === "today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (dateFilter === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }
      if (dateFilter === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    })();
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      q === ""
        ? true
        : o.shippingAddress.fullName.toLowerCase().includes(q) ||
          o.shippingAddress.email.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q);
    return matchPayment && matchStatus && matchTest && matchDate && matchSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brown-400 dark:text-amber-100/50">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag
              className="mx-auto text-cream-300 dark:text-amber-900/40 mb-3"
              size={40}
            />
            <p className="text-brown-500 dark:text-amber-100/50">
              No orders yet
            </p>
            <p className="text-brown-400 dark:text-amber-100/40 text-sm mt-1">
              Orders will appear here once customers checkout.
            </p>
          </div>
        ) : (
          <div>
            {/* Filter Bar */}
            <div className="px-5 py-3 bg-white dark:bg-[#1a1830] border-b border-cream-200 dark:border-amber-900/30 flex flex-wrap gap-2 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Search name, email, order ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] w-52 placeholder:text-brown-300 dark:placeholder:text-amber-100/30"
              />
              <div className="flex-1" />
              {/* Date */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
              </select>
              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="payment_verification">Payment Verification</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {/* Payment */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="upi">UPI / QR Pay</option>
                <option value="online">Online Payment</option>
              </select>
              {/* Test / Real */}
              <select
                value={testFilter}
                onChange={(e) => setTestFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="real">Real Orders</option>
                <option value="test">Test Orders</option>
                <option value="all">All Orders</option>
              </select>
            </div>
            {/* Header */}
            <div className="grid grid-cols-7 gap-4 px-5 py-3.5 bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider items-center">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Total</div>
              <div>Payment</div>
              <div>Status</div>
              <div className="text-right">Feedback</div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-brown-500 dark:text-amber-100/60 text-sm">
                No orders match this filter.
              </div>
            ) : (
              paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-cream-100 dark:border-amber-900/20 last:border-0"
                >
                  <div
                    className="grid grid-cols-7 gap-4 px-5 py-4 hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer text-sm items-center"
                    onClick={() =>
                      setExpanded(expanded === order.id ? null : order.id)
                    }
                  >
                    <div className="font-mono text-xs text-brown-600 dark:text-amber-100/70">
                      <div className="flex items-center gap-1">
                        {expanded === order.id ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )}
                        {order.id.slice(-8)}
                        {order.isTest && (
                          <span className="ml-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            TEST
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-brown-400 dark:text-amber-100/40 mt-0.5 ml-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-brown-800 dark:text-amber-100">
                      <div className="font-medium">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-xs text-brown-400 dark:text-amber-100/50">
                        {order.shippingAddress.email}
                      </div>
                    </div>
                    <div className="text-brown-600 dark:text-amber-100/70">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                    <div className="font-semibold text-brown-900 dark:text-amber-100">
                      ₹{order.total.toFixed(2)}
                      {order.discount > 0 && (
                        <div className="text-xs text-forest-600 dark:text-forest-400 font-normal">
                          -{order.discountCode} (-₹{order.discount.toFixed(2)})
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="uppercase text-[11px] font-bold bg-cream-100 text-brown-700 dark:bg-amber-900/30 dark:text-amber-100/80 px-2.5 py-1 rounded">
                        {order.paymentMethod === "cod" ? "COD" : order.paymentMethod === "upi" ? "UPI" : "Online"}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded-full border-0 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${
                          order.status === "delivered"
                            ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                : order.status === "processing"
                                  ? "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        <option value="payment_verification">Payment Verification</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.status === "delivered" ? (
                        <CopyFeedbackLink orderId={order.id} />
                      ) : (
                        <span className="text-[10px] text-brown-400 dark:text-amber-100/40 italic px-2">
                          Deliver to request
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === order.id && (
                    <div className="px-5 pb-5 bg-cream-50 dark:bg-[#12101e] border-t border-cream-200 dark:border-amber-900/30">
                      <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h4 className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-3">
                            Items Ordered
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item: OrderItem, i: number) => (
                              <div key={i}>
                                <div className="flex items-center gap-3 bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 rounded-xl p-3">
                                  {item.giftSet ? (
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-xl flex-shrink-0">
                                      🎁
                                    </div>
                                  ) : (
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {item.giftSet && (
                                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-0.5">
                                        {item.giftSet.kind === "custom"
                                          ? "Custom Gift Set"
                                          : "Gift Set"}
                                      </p>
                                    )}
                                    <p className="text-sm font-medium text-brown-800 dark:text-amber-100 line-clamp-1">
                                      {item.productName}
                                    </p>
                                    {item.giftSet?.card.recipient && (
                                      <p className="text-xs text-brown-400 dark:text-amber-100/50 italic">
                                        For {item.giftSet.card.recipient}
                                      </p>
                                    )}
                                    <p className="text-xs text-brown-500 dark:text-amber-100/60">
                                      Qty: {item.quantity} ·{" "}
                                      {item.giftSet
                                        ? `${item.giftSet.picks.reduce((s, p) => s + p.qty, 0)} products inside`
                                        : `₹${item.price.toFixed(0)} each`}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 flex-shrink-0">
                                    ₹{(item.price * item.quantity).toFixed(0)}
                                  </p>
                                </div>
                                {item.giftSet?.picks &&
                                  item.giftSet.picks.length > 0 && (
                                    <div
                                      className="mt-1 rounded-xl border border-amber-200 dark:border-amber-900/30 overflow-hidden ml-13"
                                      style={{ marginLeft: 52 }}
                                    >
                                      {item.giftSet.picks.map((pick, pi) => (
                                        <div
                                          key={pi}
                                          className="flex items-center gap-2 px-3 py-1.5 border-b border-amber-100 dark:border-amber-900/20 last:border-b-0 bg-amber-50 dark:bg-amber-900/10"
                                        >
                                          {pick.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                              src={pick.image}
                                              alt={pick.name}
                                              className="w-6 h-6 rounded object-cover flex-shrink-0"
                                            />
                                          ) : (
                                            <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs flex-shrink-0">
                                              🕯️
                                            </div>
                                          )}
                                          <span className="text-xs text-brown-700 dark:text-amber-100/80 flex-1 truncate">
                                            {pick.name}
                                            {pick.qty > 1 && (
                                              <span className="text-brown-400 dark:text-amber-100/40">
                                                {" "}
                                                × {pick.qty}
                                              </span>
                                            )}
                                          </span>
                                          <span className="text-xs text-brown-500 dark:text-amber-100/60 flex-shrink-0">
                                            ₹{(pick.price * pick.qty).toFixed(0)}
                                          </span>
                                        </div>
                                      ))}
                                      {item.giftSet.card.note && (
                                        <div className="px-3 py-1.5 bg-white dark:bg-[#1a1830] border-t border-amber-200 dark:border-amber-900/30">
                                          <p className="text-xs text-amber-800 dark:text-amber-200 italic">
                                            &ldquo;{item.giftSet.card.note}
                                            &rdquo;
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-3">
                            Shipping Address
                          </h4>
                          <div className="bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 rounded-xl p-4 text-sm text-brown-700 dark:text-amber-100/70 space-y-1">
                            <p className="font-medium">
                              {order.shippingAddress.fullName}
                            </p>
                            <p>{order.shippingAddress.address1}</p>
                            {order.shippingAddress.address2 && (
                              <p>{order.shippingAddress.address2}</p>
                            )}
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}{" "}
                              {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="text-brown-400 dark:text-amber-100/50 mt-1">
                              {order.shippingAddress.phone}
                            </p>
                            <p className="text-brown-400 dark:text-amber-100/50">
                              {order.shippingAddress.email}
                            </p>
                          </div>

                          <div className="mt-4 bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 rounded-xl p-4 text-sm space-y-2">
                            <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-forest-600 dark:text-forest-400">
                                <span>Discount</span>
                                <span>-₹{order.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                              <span>Shipping</span>
                              <span>₹{order.shipping.toFixed(2)}</span>
                            </div>
                            {Math.round(
                              order.total -
                                order.subtotal +
                                order.discount -
                                order.shipping,
                            ) > 0 && (
                              <div className="flex justify-between text-brown-600 dark:text-amber-100/70">
                                <span>Cash on Delivery</span>
                                <span>
                                  ₹
                                  {Math.round(
                                    order.total -
                                      order.subtotal +
                                      order.discount -
                                      order.shipping,
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-brown-900 dark:text-amber-100 border-t border-cream-100 dark:border-amber-900/20 pt-2">
                              <span>Total</span>
                              <span>₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Test order toggle */}
                      <div
                        className="mt-4 flex items-center justify-between bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800/30 rounded-xl px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <FlaskConical size={15} className="text-violet-600 dark:text-violet-400" />
                          <span className="text-sm font-medium text-violet-800 dark:text-violet-300">
                            Test Order
                          </span>
                          <span className="text-xs text-violet-500 dark:text-violet-400/70">
                            — excluded from revenue &amp; order count on dashboard
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleTestToggle(order.id, !order.isTest)
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            order.isTest
                              ? "bg-violet-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              order.isTest ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {order.paymentMethod === "upi" && (
                        <div className="mt-6 bg-white dark:bg-[#1a1830] p-6 rounded-2xl border border-cream-200 dark:border-amber-900/30 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-base font-bold text-brown-900 dark:text-amber-100">
                              UPI Payment Verification
                            </h3>
                            {order.status === "payment_verification" && (
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                Action Required
                              </span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {order.customerPhone && (
                              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-3 text-sm text-blue-800 dark:text-blue-200">
                                Customer phone: <strong className="font-mono">{order.customerPhone}</strong>
                              </div>
                            )}

                            <div className="bg-cream-50 dark:bg-[#151326] p-4 rounded-xl border border-cream-100 dark:border-amber-900/20">
                              <p className="text-xs text-brown-600 dark:text-amber-100/70 mb-1">
                                Transaction ID / UTR:
                              </p>
                              <p className="text-base font-mono font-bold text-brown-900 dark:text-amber-50">
                                {order.paymentReference ||
                                  "No Transaction ID provided"}
                              </p>
                            </div>

                            {order.paymentScreenshotUrl ? (
                              <div>
                                <p className="text-sm font-semibold text-brown-800 dark:text-amber-100/90 mb-2">
                                  Payment Screenshot:
                                </p>
                                <a
                                  href={order.paymentScreenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block border-2 border-dashed border-cream-200 dark:border-amber-900/40 rounded-xl overflow-hidden max-w-sm hover:border-amber-400 dark:hover:border-amber-600 transition-colors group relative"
                                >
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-brown-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-opacity">
                                      View Full Size
                                    </span>
                                  </div>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={order.paymentScreenshotUrl}
                                    alt="UPI Payment Screenshot"
                                    className="w-full h-auto object-contain bg-gray-50 dark:bg-black/20 max-h-64"
                                  />
                                </a>
                              </div>
                            ) : (
                              <p className="text-sm text-brown-500 dark:text-amber-100/50 italic p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                                No screenshot was uploaded by the customer.
                              </p>
                            )}

                            {order.status === "payment_verification" && (
                              <div
                                className="pt-4 mt-4 border-t border-cream-200 dark:border-amber-900/30 flex gap-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() =>
                                    handleStatusChange(order.id, "processing")
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
                                >
                                  Mark as Verified &amp; Process
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(order.id, "cancelled")
                                  }
                                  className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                  Reject Payment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-5 py-4 bg-cream-50 dark:bg-[#12101e] border-t border-cream-200 dark:border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-brown-500 dark:text-amber-100/60">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}{" "}
                  of {filteredOrders.length} entries
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg bg-white dark:bg-[#1a1830] text-brown-600 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-[#12101e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="px-3 py-1.5 text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg bg-white dark:bg-[#1a1830] text-brown-600 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-[#12101e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
