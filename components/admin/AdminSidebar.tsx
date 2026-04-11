"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  Percent,
  ShoppingBag,
  LogOut,
  Flame,
} from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-brown-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-brown-700">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-serif text-xl font-bold text-white"
        >
          <Flame className="text-amber-400" size={22} />
          Lumière Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-700 text-white"
                  : "text-brown-300 hover:bg-brown-700 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brown-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown-300 hover:bg-brown-700 hover:text-white transition-colors mb-1"
        >
          ← Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown-300 hover:bg-red-800 hover:text-white transition-colors w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
