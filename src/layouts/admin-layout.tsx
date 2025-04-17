import AdminSidebar from "@/components/admin-sidebar";
import Breadcrumb from "@/components/bread-crumb";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className="w-full max-w-[1440px]">
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
