import { AuthLoader } from "@/components/loader";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthClient } from "@/hooks/use-auth-client";

export default function ClientGuard() {
  const { data: client, isLoading, isError } = useAuthClient();
  const location = useLocation();

  console.log({ client, isLoading, isError });

  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  if (isError || !client) {
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
