import Breadcrumb from "@/components/bread-crumb";
import EmpployeeSidebar from "@/components/employee-sidebar";
import { Outlet } from "react-router-dom";

export default function EmployeeLayout() {
  return (
    <div className="flex h-screen">
      <EmpployeeSidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <div className="w-full max-w-[1440px]">
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
