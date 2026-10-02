import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { logoutUser } from "../../api/authapi";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Medicines",
      path: "/medicines",
      icon: Pill,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      // Call backend logout API
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend authentication data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect to login
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo / Pharmacy */}
      <div className="h-20 px-6 flex items-center border-b border-gray-200">
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Pill className="w-5 h-5 text-green-600" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              MediCare
            </h1>

            <p className="text-xs text-gray-500">
              Pharmacy
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5" />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full cursor-pointer flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;