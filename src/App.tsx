import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import TenantLogin from "./pages/tenant/tenant-login";
import TenantGuard from "./guards/tenant-guard";
import TenantLayout from "./layouts/tenant-layout";
import TenantProfile from "./pages/tenant/tenant-profile";
import TenantDashboard from "./pages/tenant/tenant-dashboard";
import Employee from "./pages/tenant/employee";
import EmployeeInvites from "./pages/tenant/employee-invites";
import EmployeeRegister from "./pages/employee/employee-register";
import EmployeeLayout from "./layouts/employee-layout";
import EmployeeDashboard from "./pages/employee/employee-dashboard";
import EmployeeGuard, { IsEmployeeAdmin } from "./guards/employee-guard";
import AcceptInvite from "./pages/employee/accept-invite";
import AdminLogin from "./pages/admin/admin-login";
import AdminGuard from "./guards/admin-guard";
import AdminLayout from "./layouts/admin-layout";
import Tenants from "./pages/admin/tenants";
import EmployeeProfile from "./pages/employee/employee-profile";
import EmployeeForgotPassword from "./pages/employee/employee-forgot-password";
import EmployeeLogin from "./pages/employee/employee-login";
import EmployeeResetPassword from "./pages/employee/employee-reset-password";
import TenantForgotPassword from "./pages/tenant/tenant-forgot-password";
import TenantResetPassword from "./pages/tenant/tenant-reset-password";
import LandingPage from "./pages/public/landing-page";
import EmployeeProfileUpdate from "./pages/employee/employee-profile-update";
import TenantLeave from "./pages/tenant/tenant-leave";
import Levels from "./pages/tenant/level";
import LeaveTypes from "./pages/tenant/leave-types";
import EmployeeLeave from "./pages/employee/employee-leave";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import EmployeeLeaveRequests from "./pages/employee/employee-leave-requests";
import AllLeaves from "./pages/employee/employee-admin/all-leaves";
import EmployeeDetail from "./pages/employee/employee-detail";
import EmployeeLeaveDetail from "./pages/employee/employee-leave-detail";
import TenantProfileUpdate from "./pages/tenant/tenant-profile-update";
import ClientLeaveDetail from "./pages/tenant/leave/client-leave-detail";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    //Tenant Routes
    {
      path: "/client/login",
      element: <TenantLogin />,
    },
    {
      path: "/tenant/forgot-password",
      element: <TenantForgotPassword />,
    },
    {
      path: "/tenant/reset-password",
      element: <TenantResetPassword />,
    },
    {
      path: "/dashboard/tenant",
      element: <TenantGuard />,
      children: [
        {
          element: <TenantLayout />,
          children: [
            {
              path: "",
              element: <TenantDashboard />,
            },
            {
              path: "profile",
              element: <TenantProfile />,
            },
            {
              path: "profile/update",
              element: <TenantProfileUpdate />,
            },
            {
              path: "employee",
              element: <Employee />,
            },
            {
              path: "employee/invite",
              element: <EmployeeInvites />,
            },
            {
              path: "employee/:employeeId",
              element: <EmployeeDetail />,
            },
            {
              path: "leave",
              element: <TenantLeave />,
            },
            {
              path: "leave/:leaveId",
              element: <ClientLeaveDetail />,
            },
            {
              path: "leave/types",
              element: <LeaveTypes />,
            },
            {
              path: "level",
              element: <Levels />,
            },
          ],
        },
      ],
    },
    //Eemployee Routes
    {
      path: "/invite/:tenantId/:token/:email",
      element: <EmployeeRegister />,
    },
    {
      path: "/dashboard/employee",
      element: <EmployeeGuard />,
      children: [
        {
          element: <EmployeeLayout />,
          children: [
            {
              path: "",
              element: <EmployeeDashboard />,
            },
            {
              path: "leave",
              element: <EmployeeLeave />,
            },
            {
              path: "leave/leave-request",
              element: <EmployeeLeaveRequests />,
            },
            {
              path: "leave/leave-request/:leaveId",
              element: <EmployeeLeaveDetail />,
            },
            {
              path: "leave/:leaveId",
              element: <EmployeeLeaveDetail />,
            },
            {
              path: "profile",
              element: <EmployeeProfile />,
            },
            {
              path: "profile/update",
              element: <EmployeeProfileUpdate />,
            },

            {
              element: <IsEmployeeAdmin />,
              children: [
                {
                  path: "all-leaves",
                  element: <AllLeaves />,
                },
                {
                  path: "all-leaves/:leaveId",
                  element: <EmployeeLeaveDetail />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <EmployeeLogin />,
    },
    {
      path: "/forgot-password",
      element: <EmployeeForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <EmployeeResetPassword />,
    },
    {
      path: "/:tenantId/verify",
      element: <AcceptInvite />,
    },
    //Admin Routes
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/dashboard/admin",
      element: <AdminGuard />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <div>Admin Home</div>,
            },
            {
              path: "tenants",
              element: <Tenants />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
