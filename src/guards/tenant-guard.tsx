import { useQuery } from "@tanstack/react-query";
import { AuthLoader } from "@/components/loader";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getAuthTenant } from "@/api/tenant.api";
import { useTenantActions } from "@/store/useTenantStore";

export default function TenantGuard() {
  const navigate = useNavigate();
  const { setTenant } = useTenantActions();

  const {
    data: tenant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tenant"],
    queryFn: () => getAuthTenant(navigate, setTenant),
    retry: false,
  });

  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  if (isError || !tenant) {
    return <Navigate to="/client/login" replace />;
  }

  return <Outlet />;
}
