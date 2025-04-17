import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboardIcon,
  FilePenLine,
  FileStack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { toast } from "sonner";

interface Submenu {
  name: string;
  path: string;
  icon: JSX.Element;
}

interface Route {
  name: string;
  path: string;
  icon: JSX.Element;
  submenu?: Submenu[];
}

const routes: Route[] = [
  {
    name: "Dashboard",
    path: "/dashboard/employee",
    icon: <LayoutDashboardIcon className="w-5 h-5" />,
  },
  {
    name: "Leave",
    path: "/dashboard/employee/leave",
    icon: <FileStack className="w-5 h-5" />,
    submenu: [
      {
        name: "Leave Request",
        path: "/dashboard/employee/leave/leave-request",
        icon: <FilePenLine className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "Profile",
    path: "/dashboard/employee/profile",
    icon: <User className="w-5 h-5" />,
  },
];

const adminRoutes: Route[] = [
  {
    name: "All Leaves",
    path: "/dashboard/employee/all-leaves",
    icon: <FileStack className="w-5 h-5" />,
  },
];

export default function EmployeeSidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { setAuthEmployee } = useEmployeeActions();
  const { employee } = useEmployeeStore();

  const navigate = useNavigate();

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path: string) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthEmployee(null);
    navigate(`/login`);
    toast.success("Logged out successfully");
  };

  return (
    <aside
      className={cn(
        "w-[200px] max-w-[200px] h-screen bg-white border-r shadow-md flex flex-col justify-between "
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b flex items-center gap-2">
        <img
          className=" max-w-10 max-h-10"
          src={employee?.tenantId?.logo}
          alt={`${employee?.tenantId?.name} logo`}
        />
        <h1 className="text-lg font-bold">{employee?.tenantId?.name}</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {routes.map((route, index) => (
            <li key={index}>
              {route.submenu ? (
                <div>
                  {/* Parent menu with toggle */}
                  <Link
                    to={route.path}
                    className={cn(
                      "flex items-center justify-between w-full p-2 hover:bg-gray-100 text-gray-700",
                      isActive(route.path) &&
                        "bg-gray-200 text-gray-900 border-l-4 border-black"
                    )}
                    onClick={() => toggleMenu(route.name)}
                  >
                    <div className="flex items-center space-x-3">
                      {route.icon}
                      <span>{route.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openMenu === route.name ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </Link>

                  {/* Submenu */}
                  {openMenu === route.name && (
                    <ul className="mt-2 text-left space-y-2">
                      {route.submenu.map((submenu, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={submenu.path}
                            className={cn(
                              "flex items-center space-x-3 p-2 ml-4 hover:bg-gray-100 text-gray-600",
                              isActive(submenu.path) &&
                                "bg-gray-200 text-gray-900 border-l-4 border-black"
                            )}
                          >
                            {submenu.icon}
                            <span>{submenu.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={route.path}
                  className={cn(
                    "flex items-center space-x-3 p-2 hover:bg-gray-100 text-gray-700",
                    isActive(route.path) &&
                      "bg-gray-200 text-gray-900 border-l-4 border-black"
                  )}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Admin Routes (only visible if employee.isAdmin is true) */}
        {employee?.isAdmin && (
          <>
            <Separator className="my-2" />
            <div className="font-semibold text-sm text-gray-500 text-left">
              Admin
            </div>
            <ul className="space-y-2 mt-2">
              {adminRoutes.map((route, index) => (
                <li key={index}>
                  <Link
                    to={route.path}
                    className={cn(
                      "flex items-center space-x-3 p-2 hover:bg-gray-100 text-gray-700",
                      isActive(route.path) &&
                        "bg-gray-200 text-gray-900 border-l-4 border-black"
                    )}
                  >
                    {route.icon}
                    <span>{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="relative">
        <Separator className="my-2" />
        <div
          className="p-4 max-w-[200px] flex gap-8 items-center justify-center cursor-pointer hover:bg-gray-100 overflow-x-hidden"
          onClick={toggleProfileDropdown}
        >
          <div>
            <p className="text-sm text-gray-500">
              {employee?.name || employee?.email}
            </p>
          </div>
        </div>

        {profileDropdownOpen && (
          <div className="absolute bottom-16 left-40 p-4 bg-white border shadow-md rounded-md">
            <div>
              <p className="font-semibold">{employee?.name}</p>
              <p className="text-sm text-gray-500">{employee?.jobRole}</p>
              <p className="text-sm text-gray-500">{employee?.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pb-6">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-100"
          onClick={() => handleLogout()}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
