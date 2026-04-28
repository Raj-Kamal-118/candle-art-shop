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
      } uppercase tracking-wider font-bold ${
        status === "pending"
          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          : status === "processing"
            ? "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300"
            : status === "shipped"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              : status === "delivered"
                ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
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
