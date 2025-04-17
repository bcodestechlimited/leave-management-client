import { AuthLoader } from "@/components/loader";
import { useAdminActions, useAdminStore } from "@/store/useAdminStore";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function AdminGuard() {
  const { admin, isFetchingAdmin } = useAdminStore();
  const { getAdmin } = useAdminActions();

  const navigate = useNavigate();

  useEffect(() => {
    getAdmin(navigate);
  }, [getAdmin, navigate]);

  if (isFetchingAdmin || !admin) {
    return <AuthLoader isLoading={isFetchingAdmin} />;
  }

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
