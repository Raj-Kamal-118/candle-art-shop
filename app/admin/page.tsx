import {
  getProducts,
  getOrders,
  getCategories,
  getDiscounts,
} from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import {
  Package,
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
  Sparkles,
} from "lucide-react";
import OrderStatusSelector from "@/components/admin/OrderStatusSelector";
import CopyFeedbackLink from "@/components/admin/CopyFeedbackLink";

const statusConfig: Record<
  string,
  { label: string; classes: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    classes:
      "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300",
    icon: RotateCcw,
  },
  shipped: {
    label: "Shipped",
    classes: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    classes:
      "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    icon: XCircle,
  },
};

export default async function AdminDashboard() {
  const [products, orders, categories, discounts] = await Promise.all([
    getProducts(),
    getOrders(),
    getCategories(),
    getDiscounts(),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const activeDiscounts = discounts.filter((d) => d.active).length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      accent: "border-gold-400 dark:border-gold-600",
      iconBg:
        "bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300",
      sub: `${deliveredOrders} orders delivered`,
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingBag,
      accent: "border-forest-400 dark:border-forest-600",
      iconBg:
        "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
      sub: `${pendingOrders} pending`,
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      accent: "border-coral-400 dark:border-coral-600",
      iconBg:
        "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300",
      sub: `${inStockProducts} in stock`,
    },
    {
      title: "Categories",
      value: categories.length.toString(),
      icon: Tag,
      accent: "border-amber-400 dark:border-amber-600",
      iconBg:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      sub: "All active",
    },
    {
      title: "Active Discounts",
      value: activeDiscounts.toString(),
      icon: Percent,
      accent: "border-coral-400 dark:border-coral-600",
      iconBg:
        "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300",
      sub: `${discounts.length} total codes`,
    },
    {
      title: "Avg Order Value",
      value: formatPrice(avgOrderValue),
      icon: TrendingUp,
      accent: "border-gold-400 dark:border-gold-600",
      iconBg:
        "bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300",
      sub: "Per completed order",
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Overview
          </h2>
          <p className="text-brown-500 dark:text-amber-100/60 text-sm mt-1">
            {today}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-forest-50 text-forest-800 border border-forest-200 dark:bg-forest-900/30 dark:text-forest-300 dark:border-forest-800 rounded-full px-4 py-2 text-[13px] font-medium">
          <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
          Store is Live
        </div>
      </div>

      {/* Instructional Banner */}
      <div className="bg-white dark:bg-[#1a1830] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center flex-none border border-amber-100 dark:border-amber-900/50">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-1.5">
            Welcome to your atelier
          </h3>
          <p className="text-[14px] text-brown-700 dark:text-amber-100/70 leading-relaxed max-w-4xl">
            From this dashboard, you can track incoming orders, manage your
            handcrafted inventory, and curate the storefront experience. Keep an
            eye on <b>Pending</b> orders, update them to <b>Processing</b> when
            you start pouring, and mark them as <b>Shipped</b> when they leave
            the studio.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-none border border-cream-200 dark:border-amber-900/30 border-l-4 ${stat.accent} transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-brown-900 dark:text-amber-100 mb-1 font-serif">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-brown-700 dark:text-amber-100/80 mb-0.5">
                {stat.title}
              </p>
              <p className="text-xs text-brown-500 dark:text-amber-100/50">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-cream-100 dark:border-amber-900/20">
          <h3 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Recent Orders
          </h3>
          <a
            href="/admin/orders"
            className="text-[13px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-300 transition-colors"
          >
            View all →
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag
              className="mx-auto text-cream-300 dark:text-amber-900/40 mb-3"
              size={40}
            />
            <p className="text-brown-500 dark:text-amber-100/50 text-sm">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-cream-100 dark:bg-amber-900/20 border-b border-cream-200 dark:border-amber-900/30">
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider text-right">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => {
                  const s = statusConfig[order.status] ?? {
                    label: order.status,
                    classes:
                      "bg-cream-100 text-brown-700 dark:bg-amber-900/40 dark:text-amber-100/70",
                    icon: Clock,
                  };
                  const SIcon = s.icon;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-cream-100/50 dark:hover:bg-amber-900/10 transition-colors border-b border-cream-100 dark:border-amber-900/20 last:border-0"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-brown-500 dark:text-amber-100/50">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-brown-800 dark:text-amber-100">
                        {order.shippingAddress.fullName}
                      </td>
                      <td className="px-6 py-4 text-brown-600 dark:text-amber-100/70">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 font-semibold text-brown-900 dark:text-amber-100">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                            order.paymentMethod === "cod"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
                          }`}
                        >
                          {order.paymentMethod === "cod" ? "COD" : "QR Pay"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusSelector
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </td>
                      <td className="px-6 py-4 text-brown-500 dark:text-amber-100/50 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === "delivered" ? (
                          <CopyFeedbackLink orderId={order.id} />
                        ) : (
                          <span className="text-[10px] text-brown-400 dark:text-amber-100/40 italic px-2">
                            Deliver to request
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product inventory */}
      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-cream-100 dark:border-amber-900/20">
          <h3 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Atelier Inventory
          </h3>
          <a
            href="/admin/products"
            className="text-[13px] font-semibold text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-300 transition-colors"
          >
            Manage →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-cream-100 dark:bg-amber-900/20 border-b border-cream-200 dark:border-amber-900/30">
                <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-brown-600 dark:text-amber-100/60 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream-100/50 dark:hover:bg-amber-900/10 transition-colors border-b border-cream-100 dark:border-amber-900/20 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-cream-200 dark:border-amber-900/40"
                      />
                      <span className="text-brown-800 dark:text-amber-100 font-medium line-clamp-1 max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-brown-800 dark:text-amber-100">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          product.stockCount <= 5
                            ? "text-coral-600 dark:text-coral-400"
                            : product.stockCount <= 15
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-brown-700 dark:text-amber-100/80"
                        }`}
                      >
                        {product.stockCount}
                      </span>
                      <div className="w-16 h-1.5 bg-cream-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.stockCount <= 5
                              ? "bg-coral-400"
                              : product.stockCount <= 15
                                ? "bg-amber-400"
                                : "bg-forest-400"
                          }`}
                          style={{
                            width: `${Math.min((product.stockCount / 50) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                        product.inStock
                          ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
                          : "bg-coral-100 text-coral-800 dark:bg-coral-900/40 dark:text-coral-300"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
