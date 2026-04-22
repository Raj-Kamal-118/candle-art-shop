"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Flame, Check, Package, Home, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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

  const journey = [
    { Icon: Check, label: "Order received", date: "Today", done: true, active: false },
    { Icon: Flame, label: "Hand-poured in studio", date: "Next 1–2 days", done: false, active: true },
    { Icon: Package, label: "Wrapped & dispatched", date: "In 2–3 days", done: false, active: false },
    { Icon: Home, label: "Arrives at your door", date: arriving, done: false, active: false },
  ];

  return (
    <div
      className="relative overflow-hidden min-h-[calc(100vh-160px)]"
      style={{
        background:
          "linear-gradient(180deg, var(--cream-100, #faf7f0), var(--cream-50, #fdfcf9), var(--coral-50, #fdf3f2))",
      }}
    >
      <div
        className="absolute -top-40 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(251,204,201,.3)", filter: "blur(80px)" }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(253,230,138,.4)", filter: "blur(80px)" }}
      />

      <div className="relative max-w-[720px] mx-auto px-6 py-20 text-center">
        <div className="relative w-24 h-24 rounded-full bg-white mx-auto mb-8 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(215,110,96,.3)]">
          <div
            className="absolute -inset-3 rounded-full -z-0"
            style={{
              background: "rgba(253,230,138,.5)",
              filter: "blur(20px)",
            }}
          />
          <Flame size={44} className="relative text-coral-600" />
        </div>

        <div className="text-[13px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-4">
          Order placed
        </div>
        <h1 className="font-serif text-5xl md:text-[56px] font-bold text-brown-900 dark:text-amber-100 leading-[1.05] mb-5">
          Your story <span className="text-coral-600 italic">begins.</span>
        </h1>
        <p className="text-lg leading-[1.7] text-brown-700 dark:text-amber-100/70 max-w-[520px] mx-auto mb-10">
          Thank you, {firstName}. We&apos;ve started hand-pouring your order in our
          Bengaluru studio. You&apos;ll hear from us again when it ships — with a
          little something extra.
        </p>

        <div className="inline-flex flex-wrap items-center gap-6 md:gap-8 bg-white dark:bg-[#1a1830] rounded-2xl px-6 md:px-9 py-5 shadow-sm border border-cream-200 dark:border-amber-900/30 mb-10">
          <div>
            <div className="text-[11px] text-brown-500 dark:text-amber-100/50 uppercase tracking-[0.1em]">
              Order
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

        <div className="bg-white dark:bg-[#1a1830] rounded-[20px] p-8 text-left border border-cream-200 dark:border-amber-900/30 mb-8">
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-5">
            Your candle&apos;s journey
          </div>
          {journey.map(({ Icon, label, date, done, active }, i, arr) => {
            const last = i === arr.length - 1;
            return (
              <div key={label} className={`relative flex gap-4 items-start ${last ? "" : "pb-4"}`}>
                {!last && (
                  <div
                    className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                      done ? "bg-amber-500" : "bg-cream-200 dark:bg-amber-900/30"
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

        {order?.payment_reference && (
          <div className="text-sm text-brown-500 dark:text-amber-100/60 mb-6">
            Payment reference:{" "}
            <span className="font-semibold text-brown-900 dark:text-amber-100">
              {order.payment_reference}
            </span>
          </div>
        )}

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
    </div>
  );
}
