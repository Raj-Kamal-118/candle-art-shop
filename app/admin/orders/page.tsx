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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-400">No orders yet</p>
            <p className="text-gray-300 text-sm mt-1">
              Orders will appear here once customers checkout.
            </p>
          </div>
        ) : (
          <div>
            {/* Filter Bar */}
            <div className="px-5 py-3 bg-white border-b border-gray-100 flex justify-end gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-600 bg-white cursor-pointer"
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
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-600 bg-white cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
            {/* Header */}
            <div className="grid grid-cols-7 gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide items-center">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Total</div>
              <div>Payment</div>
              <div>Status</div>
              <div className="text-right">Feedback</div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No orders match this filter.
              </div>
            ) : (
              paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <div
                    className="grid grid-cols-7 gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer text-sm items-center"
                    onClick={() =>
                      setExpanded(expanded === order.id ? null : order.id)
                    }
                  >
                    <div className="font-mono text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        {expanded === order.id ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )}
                        {order.id.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 ml-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-gray-800">
                      <div className="font-medium">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.shippingAddress.email}
                      </div>
                    </div>
                    <div className="text-gray-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                    <div className="font-semibold text-gray-900">
                      ₹{order.total.toFixed(2)}
                      {order.discount > 0 && (
                        <div className="text-xs text-green-600 font-normal">
                          -{order.discountCode} (-₹{order.discount.toFixed(2)})
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="uppercase text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {order.paymentMethod === "cod" ? "COD" : "QR Pay"}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-2 py-1 text-xs rounded-full border-0 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-yellow-100 text-yellow-800"
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
                        <span className="text-[10px] text-gray-400 italic px-2">
                          Deliver to request
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === order.id && (
                    <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
                      <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Items Ordered
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item: OrderItem, i: number) => (
                              <div key={i}>
                                <div className="flex items-center gap-3 bg-white rounded-xl p-3">
                                  {item.giftSet ? (
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl flex-shrink-0">
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
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                      {item.productName}
                                    </p>
                                    {item.giftSet?.card.recipient && (
                                      <p className="text-xs text-gray-400 italic">
                                        For {item.giftSet.card.recipient}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity} ·{" "}
                                      {item.giftSet
                                        ? `${item.giftSet.picks.reduce((s, p) => s + p.qty, 0)} products inside`
                                        : `₹${(item.price / 100).toFixed(0)} each`}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
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
                                      className="mt-1 rounded-xl border border-amber-100 overflow-hidden ml-13"
                                      style={{ marginLeft: 52 }}
                                    >
                                      {item.giftSet.picks.map((pick, pi) => (
                                        <div
                                          key={pi}
                                          className="flex items-center gap-2 px-3 py-1.5 border-b border-amber-50 last:border-b-0 bg-amber-50"
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
                                          <span className="text-xs text-gray-700 flex-1 truncate">
                                            {pick.name}
                                            {pick.qty > 1 && (
                                              <span className="text-gray-400">
                                                {" "}
                                                × {pick.qty}
                                              </span>
                                            )}
                                          </span>
                                          <span className="text-xs text-gray-500 flex-shrink-0">
                                            ₹
                                            {(
                                              (pick.price * pick.qty) /
                                              100
                                            ).toFixed(0)}
                                          </span>
                                        </div>
                                      ))}
                                      {item.giftSet.card.note && (
                                        <div className="px-3 py-1.5 bg-white border-t border-amber-100">
                                          <p className="text-xs text-amber-800 italic">
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
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Shipping Address
                          </h4>
                          <div className="bg-white rounded-xl p-4 text-sm text-gray-700 space-y-1">
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
                            <p className="text-gray-400">
                              {order.shippingAddress.phone}
                            </p>
                            <p className="text-gray-400">
                              {order.shippingAddress.email}
                            </p>
                          </div>

                          <div className="mt-4 bg-white rounded-xl p-4 text-sm space-y-2">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{order.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                              <span>Shipping</span>
                              <span>₹{order.shipping.toFixed(2)}</span>
                            </div>
                            {Math.round(
                              order.total -
                                order.subtotal +
                                order.discount -
                                order.shipping,
                            ) > 0 && (
                              <div className="flex justify-between text-gray-600">
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
                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                              <span>Total</span>
                              <span>₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {order.paymentReference && (
                            <div className="mt-4 bg-white rounded-xl p-4 text-sm">
                              <span className="text-gray-500 mr-2">
                                Payment Ref:
                              </span>
                              <span className="font-mono text-gray-900 font-medium break-all">
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
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}{" "}
                  of {filteredOrders.length} entries
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
