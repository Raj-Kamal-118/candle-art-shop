import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Negative margin offsets the global `<main className="pt-28 md:pt-20">` used by the storefront header */
    <div className="flex min-h-screen relative z-50 -mt-28 md:-mt-20 bg-[var(--cream-50)] dark:bg-[#0a0a16] text-brown-900 dark:text-amber-50 selection:bg-amber-200 selection:text-amber-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
