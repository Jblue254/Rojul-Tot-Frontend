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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome Admin
      </h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <Users className="mb-2 text-blue-500" />
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold">
            {stats.users}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Wrench className="mb-2 text-green-500" />
          <p className="text-gray-500 text-sm">Machines</p>
          <h2 className="text-3xl font-bold">
            {stats.machinery}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <ScrollText className="mb-2 text-purple-500" />
          <p className="text-gray-500 text-sm">Drawings</p>
          <h2 className="text-3xl font-bold">
            {stats.drawings}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <FolderKanban className="mb-2 text-indigo-500" />
          <p className="text-gray-500 text-sm">Active Projects</p>
          <h2 className="text-3xl font-bold">
            {stats.active_projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <ClipboardList className="mb-2 text-orange-500" />
          <p className="text-gray-500 text-sm">Active Rentals</p>
          <h2 className="text-3xl font-bold">
            {stats.active_rentals}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <DollarSign className="mb-2 text-emerald-500" />
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-3xl font-bold">
            KES {Number(stats.order_revenue || 0).toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Star className="mb-2 text-yellow-500" />
          <p className="text-gray-500 text-sm">Average Rating</p>
          <h2 className="text-3xl font-bold">
            {Number(stats.average_rating || 0).toFixed(1)}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <FolderKanban className="mb-2 text-purple-500" />
          <p className="text-gray-500 text-sm">Projects</p>
          <h2 className="text-3xl font-bold">
            {stats.projects}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <Bell className="mb-2 text-yellow-500" />
          <p className="text-gray-500 text-sm">Notifications</p>
          <h2 className="text-3xl font-bold">
            {stats.notifications ?? 0}
          </h2>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-bold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          Recent notifications, rentals, projects and orders
          will appear here.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-5 gap-4">
          <Link
            to="/admin/users"
            className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-center font-medium text-blue-700 transition-colors"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/machines"
            className="p-4 rounded-xl bg-green-50 hover:bg-green-100 text-center font-medium text-green-700 transition-colors"
          >
            Manage Machines
          </Link>

          <Link
            to="/admin/drawings"
            className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-center font-medium text-purple-700 transition-colors"
          >
            Manage Drawings
          </Link>

          <Link
            to="/admin/projects"
            className="p-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-center font-medium text-orange-700 transition-colors"
          >
            Manage Projects
          </Link>

          <Link
            to="/admin/notifications"
            className="p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-center font-medium text-yellow-700 transition-colors"
          >
            Notifications
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;