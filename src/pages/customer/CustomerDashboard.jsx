import { useEffect, useState } from "react";

import { getProjects } from "../../api/projects";
import { getRentals } from "../../api/rentals";
import { getOrders } from "../../api/orders";
import { getReviews } from "../../api/reviews";

function CustomerDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    activeProjects: 0,
    rentals: 0,
    activeRentals: 0,
    orders: 0,
    reviews: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);

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
        projects.slice(0, 5)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Customer Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            My Projects
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.projects}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            Active Projects
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.activeProjects}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            Rentals
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.rentals}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            Active Rentals
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.activeRentals}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            Orders
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.orders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">
            Reviews Given
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.reviews}
          </p>
        </div>

      </div>

      {/* Recent Projects */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Projects
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">
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

              {recentProjects.map(
                (project) => (
                  <tr
                    key={project.id}
                    className="border-b"
                  >
                    <td className="p-3">
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
                        project.budget
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}

              {recentProjects.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    No projects found.
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