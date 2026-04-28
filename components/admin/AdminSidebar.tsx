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
  Layers,
  MessageSquare,
  Gift,
} from "lucide-react";
import ArtisanLogo from "../ui/ArtisanLogo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero Section", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/gift-sets", label: "Gift Sets", icon: Gift },
  { href: "/admin/quotes", label: "Quotes", icon: MessageSquare },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-72 bg-[var(--cream-50)] dark:bg-[#0a0a16] border-r border-cream-200 dark:border-amber-900/30 min-h-screen flex flex-col relative overflow-hidden">
      {/* Soft atelier glow top-left */}
      <div className="absolute top-[-5%] left-[-10%] w-[80%] h-48 bg-amber-200/40 dark:bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="p-6 border-b border-cream-200 dark:border-amber-900/30 relative z-10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="leading-none">
            <ArtisanLogo />
            <span className="block text-[10px] font-bold text-amber-700 dark:text-amber-500 tracking-[0.2em] uppercase mt-1.5">
              Atelier Dashboard
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 relative z-10">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-coral-600 text-white shadow-md shadow-coral-200 dark:shadow-none"
                  : "text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/20 hover:text-brown-900 dark:hover:text-amber-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cream-200 dark:border-amber-900/30 relative z-10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/20 hover:text-brown-900 dark:hover:text-amber-100 transition-colors mb-1"
        >
          ← Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown-600 dark:text-amber-100/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
