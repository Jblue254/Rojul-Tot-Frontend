import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Settings,
} from "lucide-react";

function EquipmentLayout() {
   const navigate = useNavigate();

    const handleLogout = () => {
        // Clear your auth tokens or user data from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Or if you store a generic user object:
        localStorage.removeItem("user");

        // Redirect to login page
        navigate("/"); // Adjust this path if your login route is different
    };
  const links = [
    {
      name: "Dashboard",
      path: "/equipment",
      icon: LayoutDashboard,
    },
    {
      name: "Machines",
      path: "/equipment/machines",
      icon: Wrench,
    },
    {
      name: "Rentals",
      path: "/equipment/rentals",
      icon: ClipboardList,
    },
    {
      name: "Maintenance",
      path: "/equipment/maintenance",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-8">
          Equipment Manager
        </h2>

        <nav className="space-y-2">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/equipment"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            );
          })}

        </nav>

      </aside>
       <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default EquipmentLayout;