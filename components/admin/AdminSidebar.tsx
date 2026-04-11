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
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
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
    <aside className="w-64 bg-forest-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-forest-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest-800 border-2 border-gold-400 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path
                d="M12 4 C11 6 10 7 10 9 C10 11 11 12 12 12 C13 12 14 11 14 9 C14 7 13 6 12 4Z"
                fill="#e8c040"
              />
              <rect x="10" y="12" width="4" height="6" rx="0.5" fill="#e56058" />
              <rect x="9" y="18" width="6" height="1.5" rx="0.75" fill="#c4564a" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="block font-serif text-base font-bold text-white">
              Artisan House
            </span>
            <span className="block text-[9px] font-medium text-gold-400 tracking-widest uppercase mt-0.5">
              Admin Panel
            </span>
          </div>
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
                  ? "bg-coral-600 text-white"
                  : "text-forest-300 hover:bg-forest-700 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-forest-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-forest-300 hover:bg-forest-700 hover:text-white transition-colors mb-1"
        >
          ← Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-forest-300 hover:bg-red-800 hover:text-white transition-colors w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
