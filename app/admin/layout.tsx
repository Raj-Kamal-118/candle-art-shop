import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Negative margin offsets the global `<main className="pt-28 md:pt-20">` used by the storefront header */
    <div className="flex min-h-screen relative z-50 -mt-28 md:-mt-20 bg-[var(--cream-50)] dark:bg-[#0a0a16] text-brown-900 dark:text-amber-50 selection:bg-amber-200 selection:text-amber-900">
      {/* CSS-only mobile sidebar toggle */}
      <input
        type="checkbox"
        id="mobile-sidebar-toggle"
        className="peer hidden"
      />

      {/* Mobile Overlay */}
      <label
        htmlFor="mobile-sidebar-toggle"
        className="fixed inset-0 bg-black/50 z-40 hidden peer-checked:block md:peer-checked:hidden cursor-pointer"
      />

      <div className="fixed inset-y-0 left-0 z-50 transform -translate-x-full peer-checked:translate-x-0 md:relative md:translate-x-0 transition-transform duration-300 bg-cream-50 dark:bg-[#0a0a16] shadow-2xl md:shadow-none h-full">
        <div className="h-full overflow-y-auto">
          <AdminSidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center bg-white dark:bg-[#1a1830] border-b border-cream-200 dark:border-amber-900/30 md:hidden px-4 py-3">
          <label
            htmlFor="mobile-sidebar-toggle"
            className="cursor-pointer p-2 bg-cream-100 dark:bg-amber-900/30 rounded-lg text-brown-800 dark:text-amber-100"
          >
            <Menu size={20} />
          </label>
          <span className="ml-3 font-serif font-bold text-brown-900 dark:text-amber-100">
            Admin Dashboard
          </span>
        </div>
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
