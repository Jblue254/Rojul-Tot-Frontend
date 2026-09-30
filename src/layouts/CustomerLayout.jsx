import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  ScrollText,
  Bell,
  User,
  LogOut,
} from "lucide-react";

function CustomerLayout() {
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
        <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

      </aside>
       

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default CustomerLayout;