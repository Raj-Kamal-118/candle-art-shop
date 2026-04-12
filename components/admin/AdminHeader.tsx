"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/discounts": "Discounts",
  "/admin/orders": "Orders",
  "/admin/quotes": "Quote Requests",
  "/admin/reviews": "Customer Reviews",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "Admin";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
