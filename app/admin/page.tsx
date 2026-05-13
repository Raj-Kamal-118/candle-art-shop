import {
  getProducts,
  getOrders,
  getCategories,
  getDiscounts,
  getOrderIssues,
} from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Tag,
  Percent,
  TrendingUp,
  IndianRupee,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Users,
  CalendarDays,
  ArrowUpRight,
  FlaskConical,
  Package,
  Banknote,
  Smartphone,
  Globe,
  ChevronRight,
} from "lucide-react";
import OrderStatusSelector from "@/components/admin/OrderStatusSelector";
import CopyFeedbackLink from "@/components/admin/CopyFeedbackLink";

const STATUS_META: Record<string, { label: string; classes: string; icon: React.ElementType }> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    classes: "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300",
    icon: RotateCcw,
  },
  shipped: {
    label: "Shipped",
    classes: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    classes: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    icon: XCircle,
  },
  payment_pending: {
    label: "Awaiting Pay",
    classes: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    icon: CreditCard,
  },
  payment_verification: {
    label: "Verify UPI",
    classes: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    icon: AlertTriangle,
  },
};

const ISSUE_TYPE_LABEL: Record<string, string> = {
  wrong_item: "Wrong Item",
  damaged: "Damaged",
  not_delivered: "Not Delivered",
  other: "Other",
};

const ISSUE_STATUS_META: Record<string, { label: string; dot: string }> = {
  pending: { label: "Open", dot: "bg-red-500" },
  contacted: { label: "Contacted", dot: "bg-amber-500" },
  resolving: { label: "Resolving", dot: "bg-blue-500" },
  resolved: { label: "Resolved", dot: "bg-forest-500" },
};

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
  iconBg,
  badge,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: string;
  iconBg: string;
  badge?: { text: string; classes: string };
}) {
  return (
    <div
      className={`relative bg-white dark:bg-[#1a1830] rounded-2xl p-5 shadow-sm hover:shadow-md dark:shadow-none border border-cream-200 dark:border-amber-900/30 border-l-4 ${accent} transition-all duration-200 group overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-amber-50/30 dark:to-amber-900/10" />
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon size={18} />
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.classes}`}>
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold text-brown-900 dark:text-amber-100 font-serif leading-none mb-1">
        {value}
      </p>
      <p className="text-xs font-semibold text-brown-700 dark:text-amber-100/70 mb-0.5">{title}</p>
      <p className="text-[11px] text-brown-400 dark:text-amber-100/40">{sub}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const [products, orders, categories, discounts, issues] = await Promise.all([
    getProducts(),
    getOrders(),
    getCategories(),
    getDiscounts(),
    getOrderIssues(),
  ]);

  const realOrders = orders.filter((o) => !o.isTest);
  const testOrders = orders.filter((o) => o.isTest);
  const totalRevenue = realOrders.reduce((sum, o) => sum + o.total, 0);

  const today = new Date().toDateString();
  const todayOrders = realOrders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );

  const uniqueCustomers = new Set(
    realOrders.map((o) => o.userId || o.customerPhone || "").filter(Boolean)
  ).size;

  const statusCounts = {
    pending: realOrders.filter((o) => o.status === "pending").length,
    processing: realOrders.filter((o) => o.status === "processing").length,
    shipped: realOrders.filter((o) => o.status === "shipped").length,
    delivered: realOrders.filter((o) => o.status === "delivered").length,
    cancelled: realOrders.filter((o) => o.status === "cancelled").length,
    payment_pending: realOrders.filter((o) => o.status === "payment_pending").length,
    payment_verification: realOrders.filter((o) => o.status === "payment_verification").length,
  };

  const paymentCounts = {
    cod: realOrders.filter((o) => o.paymentMethod === "cod").length,
    upi: realOrders.filter((o) => o.paymentMethod === "upi").length,
    online: realOrders.filter((o) => o.paymentMethod === "online").length,
  };

  const avgOrderValue = realOrders.length ? totalRevenue / realOrders.length : 0;
  const activeDiscounts = discounts.filter((d) => d.active).length;
  const discountRevenue = realOrders
    .filter((o) => o.discountCode)
    .reduce((s, o) => s + o.discount, 0);

  const actionNeeded =
    statusCounts.pending +
    statusCounts.payment_verification +
    statusCounts.payment_pending +
    issues.filter((i) => i.status === "pending").length;

  const pendingVerification = realOrders.filter(
    (o) => o.status === "payment_verification"
  );
  const openIssues = issues.filter((i) => i.status !== "resolved");

  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      sub: `${statusCounts.delivered} orders delivered`,
      icon: IndianRupee,
      accent: "border-gold-400 dark:border-gold-600",
      iconBg: "bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300",
    },
    {
      title: "Real Orders",
      value: realOrders.length.toString(),
      sub: `${statusCounts.pending} pending · ${statusCounts.processing} processing`,
      icon: ShoppingBag,
      accent: "border-forest-400 dark:border-forest-600",
      iconBg: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
      badge: testOrders.length > 0
        ? { text: `${testOrders.length} test`, classes: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" }
        : undefined,
    },
    {
      title: "Today's Orders",
      value: todayOrders.length.toString(),
      sub: todayOrders.length
        ? formatPrice(todayOrders.reduce((s, o) => s + o.total, 0)) + " today"
        : "No orders yet today",
      icon: CalendarDays,
      accent: "border-coral-400 dark:border-coral-600",
      iconBg: "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300",
    },
    {
      title: "Customers",
      value: uniqueCustomers.toString(),
      sub: `${products.filter((p) => p.inStock).length} products in stock`,
      icon: Users,
      accent: "border-amber-400 dark:border-amber-600",
      iconBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    },
    {
      title: "Actions Needed",
      value: actionNeeded.toString(),
      sub: `${openIssues.length} open queries · ${pendingVerification.length} UPI pending`,
      icon: AlertTriangle,
      accent: actionNeeded > 0
        ? "border-red-400 dark:border-red-700"
        : "border-forest-400 dark:border-forest-600",
      iconBg: actionNeeded > 0
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
      badge: actionNeeded > 0
        ? { text: "Urgent", classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" }
        : undefined,
    },
    {
      title: "Avg Order Value",
      value: formatPrice(avgOrderValue),
      sub: `${activeDiscounts} active discounts · ₹${Math.round(discountRevenue)} saved`,
      icon: TrendingUp,
      accent: "border-gold-400 dark:border-gold-600",
      iconBg: "bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-coral-500 dark:text-coral-400">
              Admin Dashboard
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Artisan Command Centre
          </h2>
          <p className="text-brown-500 dark:text-amber-100/50 text-sm mt-1">{dateStr}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center self-start">
          <div className="flex items-center gap-2 bg-forest-50 text-forest-800 border border-forest-200 dark:bg-forest-900/30 dark:text-forest-300 dark:border-forest-800 rounded-full px-4 py-2 text-[13px] font-medium">
            <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
            Store Live
          </div>
          {actionNeeded > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50 rounded-full px-4 py-2 text-[13px] font-medium">
              <AlertTriangle size={13} />
              {actionNeeded} need attention
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Order flow pipeline */}
      <div className="bg-white dark:bg-[#1a1830] rounded-2xl border border-cream-200 dark:border-amber-900/30 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-serif font-bold text-brown-900 dark:text-amber-100">
            Order Pipeline
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-brown-500 dark:text-amber-100/40">
            <span className="flex items-center gap-1.5">
              <Banknote size={12} /> COD {paymentCounts.cod}
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone size={12} /> UPI {paymentCounts.upi}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={12} /> Online {paymentCounts.online}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(
            [
              "payment_verification",
              "payment_pending",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ] as const
          ).map((key) => {
            const meta = STATUS_META[key];
            const count = statusCounts[key as keyof typeof statusCounts];
            const Icon = meta.icon;
            const isUrgent = (key === "payment_verification" || key === "pending") && count > 0;
            return (
              <div
                key={key}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                  isUrgent
                    ? "border-amber-300 dark:border-amber-700/50 bg-amber-50/60 dark:bg-amber-900/10"
                    : "border-cream-200 dark:border-amber-900/20 bg-cream-50/50 dark:bg-[#16142a]/50"
                }`}
              >
                <span className={`p-1.5 rounded-lg ${meta.classes}`}>
                  <Icon size={14} />
                </span>
                <span className="text-2xl font-bold font-serif text-brown-900 dark:text-amber-100 leading-none">
                  {count}
                </span>
                <span className="text-[10px] text-brown-500 dark:text-amber-100/50 leading-tight">
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent orders — takes 3 cols */}
        <div className="xl:col-span-3 bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-cream-100 dark:border-amber-900/20">
            <h3 className="text-base font-serif font-bold text-brown-900 dark:text-amber-100">
              Recent Orders
            </h3>
            <a
              href="/admin/orders"
              className="flex items-center gap-1 text-[12px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </a>
          </div>

          {realOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto text-cream-300 dark:text-amber-900/40 mb-3" size={36} />
              <p className="text-brown-500 dark:text-amber-100/50 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100 dark:divide-amber-900/20">
              {realOrders.slice(0, 8).map((order) => {
                const s = STATUS_META[order.status] ?? STATUS_META["pending"];
                const SIcon = s.icon;
                const addr = order.shippingAddress;
                const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-cream-50/80 dark:hover:bg-amber-900/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-brown-400 dark:text-amber-100/40">
                          #{order.id.slice(-7).toUpperCase()}
                        </span>
                        {order.isGift && (
                          <span className="text-[9px] bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 px-1.5 py-0.5 rounded-full font-bold">
                            GIFT
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-brown-800 dark:text-amber-100 truncate">
                        {addr?.fullName}
                      </p>
                      <p className="text-[11px] text-brown-400 dark:text-amber-100/40">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-brown-900 dark:text-amber-100">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${s.classes}`}
                      >
                        <SIcon size={10} />
                        {s.label}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <OrderStatusSelector
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column — UPI queue + queries */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* UPI Verification Queue */}
          {pendingVerification.length > 0 && (
            <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-purple-200 dark:border-purple-900/40 overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-purple-100 dark:border-purple-900/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <h3 className="text-sm font-serif font-bold text-brown-900 dark:text-amber-100">
                    UPI Verification Queue
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  {pendingVerification.length} pending
                </span>
              </div>
              <div className="divide-y divide-purple-50 dark:divide-purple-900/20">
                {pendingVerification.slice(0, 4).map((order) => (
                  <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brown-800 dark:text-amber-100 truncate">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-[11px] text-brown-400 dark:text-amber-100/40">
                        #{order.id.slice(-7).toUpperCase()} · {formatPrice(order.total)}
                      </p>
                    </div>
                    <a
                      href="/admin/orders"
                      className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
                    >
                      Review <ChevronRight size={11} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Queries */}
          <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-cream-100 dark:border-amber-900/20">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-coral-500" />
                <h3 className="text-sm font-serif font-bold text-brown-900 dark:text-amber-100">
                  Customer Queries
                </h3>
              </div>
              {openIssues.length > 0 && (
                <span className="text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 rounded-full">
                  {openIssues.length} open
                </span>
              )}
            </div>

            {issues.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="mx-auto text-cream-300 dark:text-amber-900/40 mb-2" size={28} />
                <p className="text-brown-400 dark:text-amber-100/40 text-xs">No queries yet</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100 dark:divide-amber-900/20">
                {issues.slice(0, 6).map((issue) => {
                  const sm = ISSUE_STATUS_META[issue.status] ?? ISSUE_STATUS_META["pending"];
                  return (
                    <div key={issue.id} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded">
                          {ISSUE_TYPE_LABEL[issue.issueType] ?? issue.issueType}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                          <span className="text-[10px] text-brown-400 dark:text-amber-100/40">{sm.label}</span>
                        </div>
                      </div>
                      <p className="text-xs text-brown-700 dark:text-amber-100/70 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                      <p className="text-[10px] text-brown-400 dark:text-amber-100/30 mt-1">
                        {issue.customerEmail} ·{" "}
                        {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount & low stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Discount codes */}
        <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-cream-100 dark:border-amber-900/20">
            <div className="flex items-center gap-2">
              <Percent size={15} className="text-forest-500" />
              <h3 className="text-sm font-serif font-bold text-brown-900 dark:text-amber-100">
                Discount Codes
              </h3>
            </div>
            <a
              href="/admin/discounts"
              className="flex items-center gap-1 text-[12px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 transition-colors"
            >
              Manage <ArrowUpRight size={12} />
            </a>
          </div>
          {discounts.length === 0 ? (
            <p className="text-center text-brown-400 dark:text-amber-100/40 text-xs py-8">No codes created</p>
          ) : (
            <div className="divide-y divide-cream-100 dark:divide-amber-900/20">
              {discounts.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center gap-3 px-5 sm:px-6 py-3">
                  <code className="text-[12px] font-bold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-900/20 px-2 py-0.5 rounded shrink-0">
                    {d.code}
                  </code>
                  <div className="flex-1 min-w-0">
                    <div className="w-full bg-cream-200 dark:bg-amber-900/30 rounded-full h-1.5">
                      <div
                        className="bg-forest-400 h-1.5 rounded-full transition-all"
                        style={{
                          width: d.maxUses > 0
                            ? `${Math.min((d.usedCount / d.maxUses) * 100, 100)}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-brown-500 dark:text-amber-100/50 shrink-0">
                    {d.usedCount}{d.maxUses > 0 ? `/${d.maxUses}` : ""} uses
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      d.active
                        ? "bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-300"
                        : "bg-cream-200 text-brown-500 dark:bg-amber-900/30 dark:text-amber-100/40"
                    }`}
                  >
                    {d.active ? "Active" : "Off"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alert */}
        <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-cream-100 dark:border-amber-900/20">
            <div className="flex items-center gap-2">
              <Package size={15} className="text-amber-500" />
              <h3 className="text-sm font-serif font-bold text-brown-900 dark:text-amber-100">
                Low Stock Alert
              </h3>
            </div>
            <a
              href="/admin/products"
              className="flex items-center gap-1 text-[12px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 transition-colors"
            >
              Manage <ArrowUpRight size={12} />
            </a>
          </div>
          {products.filter((p) => p.stockCount <= 5 && p.inStock).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto text-forest-300 dark:text-forest-800 mb-2" size={28} />
              <p className="text-brown-400 dark:text-amber-100/40 text-xs">All products well-stocked</p>
              <p className="text-[11px] text-brown-300 dark:text-amber-100/30 mt-1">
                {products.filter((p) => p.inStock).length} of {products.length} in stock
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100 dark:divide-amber-900/20">
              {products
                .filter((p) => p.stockCount <= 5 && p.inStock)
                .slice(0, 5)
                .map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 sm:px-6 py-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover border border-cream-200 dark:border-amber-900/40 shrink-0"
                    />
                    <p className="flex-1 text-sm text-brown-800 dark:text-amber-100 truncate">{p.name}</p>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        p.stockCount === 0
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {p.stockCount === 0 ? "Out of stock" : `${p.stockCount} left`}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories footer strip */}
      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-coral-500" />
            <h3 className="text-sm font-serif font-bold text-brown-900 dark:text-amber-100">
              Categories · {categories.length} total
            </h3>
          </div>
          <a
            href="/admin/categories"
            className="flex items-center gap-1 text-[12px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 transition-colors"
          >
            Edit <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-cream-50 dark:bg-amber-900/10 border border-cream-200 dark:border-amber-900/20 rounded-full text-[12px] text-brown-700 dark:text-amber-100/70"
            >
              <span className="font-semibold">{cat.name}</span>
              <span className="text-brown-400 dark:text-amber-100/30 text-[10px]">{cat.productCount}</span>
            </div>
          ))}
        </div>
        {testOrders.length > 0 && (
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-brown-400 dark:text-amber-100/30">
            <FlaskConical size={11} />
            {testOrders.length} test order{testOrders.length !== 1 ? "s" : ""} excluded from all statistics above
          </p>
        )}
      </div>
    </div>
  );
}
