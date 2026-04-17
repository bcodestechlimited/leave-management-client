import AdminSidebar from "@/components/admin-sidebar";
import Breadcrumb from "@/components/bread-crumb";
import SwitchTenants from "@/pages/admin/_components/switch-tenants";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className="w-full max-w-[1440px]">
          <div className="flex justify-between items-center mb-4">
            <Breadcrumb />
            <SwitchTenants />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
