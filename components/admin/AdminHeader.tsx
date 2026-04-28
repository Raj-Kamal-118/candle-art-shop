"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import ThemeSwitch from "@/components/layout/ThemeSwitch";

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
  const router = useRouter();
  const title = titles[pathname] || "Admin";

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <header className="h-20 bg-[var(--cream-50)]/90 dark:bg-[#0a0a16]/90 backdrop-blur-md border-b border-cream-200 dark:border-amber-900/30 flex items-center px-6 md:px-8 sticky top-0 z-20">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100">
          {title}
        </h1>
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2 pr-4 border-r border-cream-200 dark:border-amber-900/30">
            <ThemeSwitch />
            <Link
              href="/"
              target="_blank"
              className="p-2 text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-colors"
              title="View Storefront"
            >
              <ExternalLink size={18} />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-brown-500 hover:text-red-600 dark:text-amber-100/60 dark:hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-coral-600 shadow-md shadow-coral-200 dark:shadow-none rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-brown-900 dark:text-amber-100">
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
