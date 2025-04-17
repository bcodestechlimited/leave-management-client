import Breadcrumb from "@/components/bread-crumb";
import TenantSidebar from "@/components/tenant-sidebar";
import { Outlet } from "react-router-dom";

export default function TenantLayout() {
  return (
    <div className="flex h-screen">
      <TenantSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className="w-full max-w-[1440px]">
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
