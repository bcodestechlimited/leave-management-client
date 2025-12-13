import { AuthLoader } from "@/components/loader";
import { useAuthAdmin } from "@/hooks/use-auth-admin";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {
  const { data: admin, isLoading, isError } = useAuthAdmin();

  if (isLoading) {
    return <AuthLoader isLoading={isLoading} />;
  }

  console.log({ isError });

  if (!admin || isError) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
