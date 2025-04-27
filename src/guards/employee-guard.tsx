import { getLoggedInEmployee } from "@/api/employee.api";
import { AuthLoader } from "@/components/loader";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function EmployeeGuard() {
  const { setAuthEmployee } = useEmployeeActions();
  const location = useLocation();

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee"],
    queryFn: () => getLoggedInEmployee(setAuthEmployee),
    retry: false,
  });

  useEffect(() => {
    if (employee?.tenantId?.color) {
      document.documentElement.style.setProperty(
        "--tenant-primary",
        employee.tenantId.color
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
