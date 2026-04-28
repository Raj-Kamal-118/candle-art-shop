"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { Order, OrderItem } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import CopyFeedbackLink from "@/components/admin/CopyFeedbackLink";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.reverse());
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter, statusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    const previousOrders = [...orders];
    // Optimistic update
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
      setOrders(previousOrders); // Revert optimistic update on failure
    }
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
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
    return matchPayment && matchStatus;
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
            <div className="px-5 py-3 bg-white dark:bg-[#1a1830] border-b border-cream-200 dark:border-amber-900/30 flex justify-end gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-sm border border-cream-300 dark:border-amber-900/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 text-brown-600 dark:text-amber-100 bg-white dark:bg-[#12101e] cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="online">Online Payment</option>
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
                        {order.paymentMethod === "cod" ? "COD" : "QR Pay"}
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
                                        : `₹${(item.price / 100).toFixed(0)} each`}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 flex-shrink-0">
                                    ₹
                                    {(
                                      (item.price * item.quantity) /
                                      100
                                    ).toFixed(0)}
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
                                            ₹
                                            {(
                                              (pick.price * pick.qty) /
                                              100
                                            ).toFixed(0)}
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

                          {order.paymentReference && (
                            <div className="mt-4 bg-white dark:bg-[#1a1830] border border-cream-100 dark:border-amber-900/20 rounded-xl p-4 text-sm">
                              <span className="text-brown-500 dark:text-amber-100/50 mr-2">
                                Payment Ref:
                              </span>
                              <span className="font-mono text-brown-900 dark:text-amber-100 font-medium break-all">
                                {order.paymentReference}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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
