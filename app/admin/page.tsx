import { getProducts, getOrders, getCategories, getDiscounts } from "@/lib/data";
import { Package, ShoppingBag, Tag, Percent, TrendingUp, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const products = await getProducts();
  const orders = await getOrders();
  const categories = await getCategories();
  const discounts = await getDiscounts();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeDiscounts = discounts.filter((d) => d.active).length;
  const inStockProducts = products.filter((p) => p.inStock).length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
      change: "+12.5% this month",
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-700",
      change: `${pendingOrders} pending`,
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      color: "bg-amber-100 text-amber-700",
      change: `${inStockProducts} in stock`,
    },
    {
      title: "Categories",
      value: categories.length.toString(),
      icon: Tag,
      color: "bg-purple-100 text-purple-700",
      change: "All active",
    },
    {
      title: "Active Discounts",
      value: activeDiscounts.toString(),
      icon: Percent,
      color: "bg-pink-100 text-pink-700",
      change: `${discounts.length} total codes`,
    },
    {
      title: "Avg Order Value",
      value: orders.length
        ? `$${(totalRevenue / orders.length).toFixed(2)}`
        : "$0.00",
      icon: TrendingUp,
      color: "bg-indigo-100 text-indigo-700",
      change: "Per completed order",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h2>
        <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening in your store.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-700 mb-0.5">
                {stat.title}
              </p>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Orders</h3>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 font-mono text-xs text-gray-600">
                      {order.id.slice(-8)}
                    </td>
                    <td className="py-3 text-gray-800">
                      {order.shippingAddress.fullName}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="py-3 font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product inventory */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-5">
          Product Inventory
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Price
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Stock
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="text-gray-800 font-medium line-clamp-1 max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">${product.price}</td>
                  <td className="py-3 text-gray-700">{product.stockCount}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
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
