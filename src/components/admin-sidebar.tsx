import { Users, LogOut, ChevronDown, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAdminStore } from "@/store/use-admin-store";
// import { useAdminActions, useAdminStore } from "@/store/useAdminStore";

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
    path: "/dashboard/admin",
    icon: <LayoutDashboardIcon className="w-5 h-5" />,
  },
  {
    name: "Tenants",
    path: "/dashboard/admin/tenants",
    icon: <Users className="w-5 h-5" />,
    // submenu: [],
  },
  {
    name: "Leaves",
    path: "/dashboard/admin/leaves",
    icon: <Users className="w-5 h-5" />,
    // submenu: [],
  },
];

export default function AdminSidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { admin } = useAdminStore();

  const navigate = useNavigate();

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <aside
      className={cn(
        "w-54 h-screen bg-white border-r shadow-md flex flex-col justify-between"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
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
                              "flex items-center space-x-3 p-2 ml-8 hover:bg-gray-100 text-gray-600",
                              isActive(route.path) &&
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
      </nav>

      {/* Profile Section */}
      <div className="relative">
        <Separator className="my-2" />
        <div
          className="py-1 flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onClick={toggleProfileDropdown}
        >
          <div>
            {/* <p className="font-semibold text-sm">{admin.email}</p>
            <p className="text-sm text-gray-500">{admin.role}</p> */}
          </div>
        </div>

        {profileDropdownOpen && (
          <div className="absolute bottom-16 w-full p-4 bg-white border shadow-md rounded-md">
            <div>
              {/* <p className="font-semibold">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.role}</p>
              <p className="text-sm text-gray-500">{admin.email}</p> */}
            </div>
          </div>
        )}
      </div>

      {/* Logout Section */}
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
