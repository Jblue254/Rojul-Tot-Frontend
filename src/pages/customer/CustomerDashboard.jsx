import { useEffect, useState } from "react";
import {
  FolderKanban,
  Wrench,
  Activity,
  ShoppingCart,
  Star,
  Loader2,
} from "lucide-react";

import { getProjects } from "../../api/projects";
import { getRentals } from "../../api/rentals";
import { getOrders } from "../../api/orders";
import { getReviews } from "../../api/reviews";

function CustomerDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    projects: 0,
    activeProjects: 0,
    rentals: 0,
    activeRentals: 0,
    orders: 0,
    reviews: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentRentals, setRecentRentals] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        projectsRes,
        rentalsRes,
        ordersRes,
        reviewsRes,
      ] = await Promise.all([
        getProjects(),
        getRentals(),
        getOrders(),
        getReviews(),
      ]);

      const projects = projectsRes.data || [];
      const rentals = rentalsRes.data || [];
      const orders = ordersRes.data || [];
      const reviews = reviewsRes.data || [];

      setStats({
        projects: projects.length,

        activeProjects: projects.filter(
          (p) => p.status === "ACTIVE"
        ).length,

        rentals: rentals.length,

        activeRentals: rentals.filter(
          (r) =>
            r.status === "ACTIVE" ||
            r.status === "APPROVED"
        ).length,

        orders: orders.length,

        reviews: reviews.length,
      });

      setRecentProjects(
        [...projects]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
      );

      setRecentRentals(
        [...rentals]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRentalStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-purple-100 text-purple-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>
        </div>

        <div className="bg-[#1495CC]/10 p-3 rounded-xl">
          <Icon
            size={24}
            className="text-[#1495CC]"
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2
          size={40}
          className="animate-spin text-[#1495CC]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Customer Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of your projects,
          rentals and orders.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard
          title="Projects"
          value={stats.projects}
          icon={FolderKanban}
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Activity}
        />

        <StatCard
          title="Rentals"
          value={stats.rentals}
          icon={Wrench}
        />

        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={Activity}
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={ShoppingCart}
        />

        <StatCard
          title="Reviews"
          value={stats.reviews}
          icon={Star}
        />
      </div>

      {/* Recent Projects */}

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Recent Projects
          </h2>

          <span className="text-sm text-gray-500">
            Latest project activity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3">
                  Project
                </th>

                <th className="text-left p-3">
                  Location
                </th>

                <th className="text-left p-3">
                  Status
                </th>

                <th className="text-left p-3">
                  Budget
                </th>
              </tr>
            </thead>

            <tbody>
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {project.name}
                    </td>

                    <td className="p-3">
                      {project.location}
                    </td>

                    <td className="p-3">
                      {project.status}
                    </td>

                    <td className="p-3">
                      KES{" "}
                      {Number(
                        project.budget || 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-8 text-gray-500"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Rentals */}

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Recent Rentals
          </h2>

          <span className="text-sm text-gray-500">
            Latest rental activity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3">
                  Machine
                </th>

                <th className="text-left p-3">
                  Start Date
                </th>

                <th className="text-left p-3">
                  End Date
                </th>

                <th className="text-left p-3">
                  Total
                </th>

                <th className="text-left p-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentRentals.length > 0 ? (
                recentRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {rental.machine_name ||
                        rental.machine?.name ||
                        "Machine"}
                    </td>

                    <td className="p-3">
                      {rental.start_date}
                    </td>

                    <td className="p-3">
                      {rental.end_date}
                    </td>

                    <td className="p-3">
                      KES{" "}
                      {Number(
                        rental.total_price || 0
                      ).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRentalStatusColor(
                          rental.status
                        )}`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No rentals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default CustomerDashboard;