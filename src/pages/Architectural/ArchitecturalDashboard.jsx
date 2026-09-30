import { useEffect, useState } from "react";
import {
  FileText,
  FolderTree,
  ShoppingCart,
  DollarSign,
  Star,
  Package,
} from "lucide-react";

import { getArchitecturalDashboard } from "../../services/analytics";

export default function ArchitecturalDashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    total_drawings: 0,
    available_drawings: 0,
    sold_out_drawings: 0,
    inactive_drawings: 0,
    categories: 0,
    orders: 0,
    completed_orders: 0,
    pending_orders: 0,
    revenue: 0,
    reviews: 0,
    average_rating: 0,
    recent_orders: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } =
        await getArchitecturalDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Drawings",
      value: dashboard.total_drawings,
      icon: FileText,
    },
    {
      title: "Available Drawings",
      value: dashboard.available_drawings,
      icon: Package,
    },
    {
      title: "Sold Out",
      value: dashboard.sold_out_drawings,
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      value: dashboard.categories,
      icon: FolderTree,
    },
    {
      title: "Orders",
      value: dashboard.orders,
      icon: ShoppingCart,
    },
    {
      title: "Completed Orders",
      value: dashboard.completed_orders,
      icon: ShoppingCart,
    },
    {
      title: "Pending Orders",
      value: dashboard.pending_orders,
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: `$${dashboard.revenue}`,
      icon: DollarSign,
    },
    {
      title: "Reviews",
      value: dashboard.reviews,
      icon: Star,
    },
    {
      title: "Average Rating",
      value: Number(
        dashboard.average_rating
      ).toFixed(1),
      icon: Star,
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Architectural Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of drawings, orders,
          revenue and reviews.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <Icon
                  size={30}
                  className="text-blue-600"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4">
                  Order ID
                </th>

                <th className="text-left p-4">
                  Customer
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Amount
                </th>

                <th className="text-left p-4">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recent_orders?.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {order.customer}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-sm">
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      ${order.total_amount}
                    </td>

                    <td className="p-4">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}

              {!dashboard.recent_orders?.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawing Status */}
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <h2 className="text-xl font-semibold mb-4">
          Drawing Status Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">
              Available
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {dashboard.available_drawings}
            </h3>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500">
              Sold Out
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {dashboard.sold_out_drawings}
            </h3>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500">
              Inactive
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {dashboard.inactive_drawings}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}