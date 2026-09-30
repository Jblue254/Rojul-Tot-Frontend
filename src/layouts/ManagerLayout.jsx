import { NavLink, Outlet } from "react-router-dom";
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

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default ManagerLayout;