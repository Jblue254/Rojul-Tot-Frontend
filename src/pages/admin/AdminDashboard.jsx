import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Wrench,
  FolderKanban,
  Bell,
  ScrollText,
  ClipboardList,
  DollarSign,
  Star,
} from "lucide-react";

import { getAdminDashboard } from "../../api/analytics";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getAdminDashboard();
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#1495CC] font-medium">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.users || 0,
      icon: Users,
    },
    {
      title: "Machines",
      value: stats.machinery || 0,
      icon: Wrench,
    },
    {
      title: "Projects",
      value: stats.projects || 0,
      icon: FolderKanban,
    },
    {
      title: "Active Projects",
      value: stats.active_projects || 0,
      icon: FolderKanban,
    },
    {
      title: "Completed Projects",
      value: stats.completed_projects || 0,
      icon: FolderKanban,
    },
    {
      title: "Assigned Machines",
      value: stats.assigned_machines || 0,
      icon: Wrench,
    },
    {
      title: "Active Rentals",
      value: stats.active_rentals || 0,
      icon: ClipboardList,
    },
    {
      title: "Drawings",
      value: stats.drawings || 0,
      icon: ScrollText,
    },
    {
      title: "Notifications",
      value: stats.notifications || 0,
      icon: Bell,
    },
    {
      title: "Revenue",
      value: `KES ${Number(
        stats.order_revenue || 0
      ).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Project Budget",
      value: `KES ${Number(
        stats.project_budget || 0
      ).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Average Rating",
      value: Number(
        stats.average_rating || 0
      ).toFixed(1),
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Overview of platform performance and activity.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold text-[#1495CC] mt-2">
                    {card.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#1495CC]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#1495CC]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Recent Activity
        </h2>

        <p className="text-slate-500">
          Recent rentals, projects, notifications and
          orders will appear here.
        </p>
      </div>

      {/* Quick Actions */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-5 gap-4">
          <Link
            to="/admin/users"
            className="
              bg-[#1495CC]
              text-white
              p-4
              rounded-xl
              text-center
              font-medium
              hover:bg-[#1185b5]
              transition
            "
          >
            Manage Users
          </Link>

          <Link
            to="/admin/machines"
            className="
              bg-[#1495CC]
              text-white
              p-4
              rounded-xl
              text-center
              font-medium
              hover:bg-[#1185b5]
              transition
            "
          >
            Manage Machines
          </Link>

          <Link
            to="/admin/drawings"
            className="
              bg-[#1495CC]
              text-white
              p-4
              rounded-xl
              text-center
              font-medium
              hover:bg-[#1185b5]
              transition
            "
          >
            Manage Drawings
          </Link>

          <Link
            to="/admin/projects"
            className="
              bg-[#1495CC]
              text-white
              p-4
              rounded-xl
              text-center
              font-medium
              hover:bg-[#1185b5]
              transition
            "
          >
            Manage Projects
          </Link>

          <Link
            to="/admin/notifications"
            className="
              bg-[#1495CC]
              text-white
              p-4
              rounded-xl
              text-center
              font-medium
              hover:bg-[#1185b5]
              transition
            "
          >
            Notifications
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;