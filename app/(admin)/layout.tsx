import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import React from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default AdminLayout;
