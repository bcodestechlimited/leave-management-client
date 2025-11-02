import { AuthLoader } from "@/components/loader";
import { useAuthEmployee } from "@/hooks/use-auth-employee";
import { useEmployeeStore } from "@/store/use-employee-store";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function EmployeeGuard() {
  const { data: employee, isLoading, isError } = useAuthEmployee();
  const location = useLocation();

  useEffect(() => {
    if (employee?.clientId?.color) {
      document.documentElement.style.setProperty(
        "--client-primary",
        employee.clientId.color
      );
    }
  }, [employee]);

  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  if (isError || !employee) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // document.documentElement.style.setProperty(
  //   "--tenant-primary",
  //   employee.tenantId?.color || "black"
  // );

  return <Outlet />;
}

export function IsEmployeeAdmin() {
  const { employee } = useEmployeeStore();

  if (!employee?.isAdmin) {
    return <div className="mt-2">You don't have rights to this page</div>;
  }

  return <Outlet />;
}
