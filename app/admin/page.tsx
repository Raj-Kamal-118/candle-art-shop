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
} from "lucide-react";
import OrderStatusSelector from "@/components/admin/OrderStatusSelector";
import CopyFeedbackLink from "@/components/admin/CopyFeedbackLink";

const statusConfig: Record<
  string,
  { label: string; classes: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    classes: "bg-blue-100 text-blue-800",
    icon: RotateCcw,
  },
  shipped: {
    label: "Shipped",
    classes: "bg-indigo-100 text-indigo-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    classes: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-100 text-red-800",
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
      accent: "border-emerald-500",
      iconBg: "bg-emerald-100 text-emerald-700",
      sub: `${deliveredOrders} orders delivered`,
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingBag,
      accent: "border-blue-500",
      iconBg: "bg-blue-100 text-blue-700",
      sub: `${pendingOrders} pending`,
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      accent: "border-coral-500",
      iconBg: "bg-coral-100 text-coral-700",
      sub: `${inStockProducts} in stock`,
    },
    {
      title: "Categories",
      value: categories.length.toString(),
      icon: Tag,
      accent: "border-purple-500",
      iconBg: "bg-purple-100 text-purple-700",
      sub: "All active",
    },
    {
      title: "Active Discounts",
      value: activeDiscounts.toString(),
      icon: Percent,
      accent: "border-pink-500",
      iconBg: "bg-pink-100 text-pink-700",
      sub: `${discounts.length} total codes`,
    },
    {
      title: "Avg Order Value",
      value: formatPrice(avgOrderValue),
      icon: TrendingUp,
      accent: "border-gold-500",
      iconBg: "bg-gold-100 text-gold-700",
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
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-500 text-sm mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Store Live
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 ${stat.accent}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1 font-serif">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-700 mb-0.5">
                {stat.title}
              </p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <a
            href="/admin/orders"
            className="text-xs font-medium text-coral-600 hover:text-coral-700 transition-colors"
          >
            View all →
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-200 mb-3" size={40} />
            <p className="text-gray-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Order
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((order) => {
                  const s = statusConfig[order.status] ?? {
                    label: order.status,
                    classes: "bg-gray-100 text-gray-700",
                    icon: Clock,
                  };
                  const SIcon = s.icon;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.shippingAddress.fullName}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            order.paymentMethod === "cod"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-sky-100 text-sky-700"
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
                      <td className="px-6 py-4 text-gray-400 text-xs">
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
                          <span className="text-[10px] text-gray-400 italic px-2">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Product Inventory</h3>
          <a
            href="/admin/products"
            className="text-xs font-medium text-coral-600 hover:text-coral-700 transition-colors"
          >
            Manage →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Price
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Stock
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.slice(0, 8).map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-100"
                      />
                      <span className="text-gray-800 font-medium line-clamp-1 max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          product.stockCount <= 5
                            ? "text-red-600"
                            : product.stockCount <= 15
                              ? "text-yellow-600"
                              : "text-gray-700"
                        }`}
                      >
                        {product.stockCount}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.stockCount <= 5
                              ? "bg-red-400"
                              : product.stockCount <= 15
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
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
