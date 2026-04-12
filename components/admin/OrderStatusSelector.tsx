"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        setStatus(currentStatus);
      }
    } catch (error) {
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
        loading ? "opacity-50" : ""
      } ${
        status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : status === "processing"
            ? "bg-blue-100 text-blue-800"
            : status === "shipped"
              ? "bg-indigo-100 text-indigo-800"
              : status === "delivered"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
