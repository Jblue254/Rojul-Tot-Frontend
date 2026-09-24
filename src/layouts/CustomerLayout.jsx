import { Link, Outlet } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  ScrollText,
  Bell,
  User,
} from "lucide-react";

function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold text-[#1495CC] mb-8">
          RojulTot
        </h1>

        <nav className="space-y-3">

          <Link
            to="/customer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/customer/projects"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <FolderKanban size={20} />
            My Projects
          </Link>

          <Link
            to="/customer/rentals"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <Wrench size={20} />
            My Rentals
          </Link>

          <Link
            to="/customer/drawings"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <ScrollText size={20} />
            Drawings
          </Link>

          <Link
            to="/customer/notifications"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <Bell size={20} />
            Notifications
          </Link>

          <Link
            to="/customer/profile"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50"
          >
            <User size={20} />
            Profile
          </Link>

        </nav>

      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default CustomerLayout;