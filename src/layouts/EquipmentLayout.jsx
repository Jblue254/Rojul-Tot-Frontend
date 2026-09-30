import { Outlet, NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Settings,
} from "lucide-react";

function EquipmentLayout() {
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

      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default EquipmentLayout;