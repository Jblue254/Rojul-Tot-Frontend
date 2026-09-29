import { useEffect, useState } from "react";
import {
  Users,
  Wrench,
  FolderKanban,
  ShoppingCart,
  Star,
  Loader2,
  DollarSign,
} from "lucide-react";

import { getAdminDashboard } from "../../api/analytics";

function AnalyticsManagement() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getAdminDashboard();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#1495CC]" size={40} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500">
          Overview of users, machinery, rentals, projects and revenue.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <Users className="mb-2 text-blue-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.users}
            </h2>
          </div>
        </div>

        {/* Machines */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <Wrench className="mb-2 text-green-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Machines</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.machinery}
            </h2>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <Wrench className="mb-2 text-red-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Active Rentals</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.active_rentals}
            </h2>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <FolderKanban className="mb-2 text-purple-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Projects</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.projects}
            </h2>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <ShoppingCart className="mb-2 text-orange-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Orders</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.orders}
            </h2>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <DollarSign className="mb-2 text-emerald-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              KES {Number(stats.order_revenue || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between">
          <Star className="mb-2 text-yellow-500" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {stats.average_rating ? Number(stats.average_rating).toFixed(1) : "0.0"}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsManagement;