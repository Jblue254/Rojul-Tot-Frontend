import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Wrench,
  DollarSign,
  Flag,
  Star,
  FileText,
  User,
} from "lucide-react";

function ManagerLayout() {
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
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 bg-white border-r p-5">
        <h2 className="text-2xl font-bold mb-8">
          Manager Panel
        </h2>

        <nav className="space-y-2">
          <NavLink
            to="/manager"
            end
            className={linkClass}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/manager/projects"
            className={linkClass}
          >
            <FolderKanban size={18} />
            Projects
          </NavLink>

          <NavLink
            to="/manager/members"
            className={linkClass}
          >
            <Users size={18} />
            Team Members
          </NavLink>

          <NavLink
            to="/manager/machines"
            className={linkClass}
          >
            <Wrench size={18} />
            Machines
          </NavLink>

          <NavLink
            to="/manager/costs"
            className={linkClass}
          >
            <DollarSign size={18} />
            Project Costs
          </NavLink>

          <NavLink
            to="/manager/milestones"
            className={linkClass}
          >
            <Flag size={18} />
            Milestones
          </NavLink>

          <NavLink
            to="/manager/reviews"
            className={linkClass}
          >
            <Star size={18} />
            Reviews
          </NavLink>

          <NavLink
            to="/manager/reports"
            className={linkClass}
          >
            <FileText size={18} />
            Reports
          </NavLink>

          <NavLink
            to="/manager/profile"
            className={linkClass}
          >
            <User size={18} />
            Profile
          </NavLink>
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

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default ManagerLayout;