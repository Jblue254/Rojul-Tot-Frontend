import { useEffect, useState } from "react";
import {
  FileText,
  FolderTree,
  ShoppingCart,
  DollarSign,
  Star,
  Package,
} from "lucide-react";

import { getArchitecturalDashboard } from "../../api/analytics";

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
      <div className="text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Architectural Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of drawings, orders,
          revenue and reviews.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-2 truncate">
                    {card.value}
                  </h2>
                </div>

                <Icon
                  size={22}
                  className="shrink-0 p-2.5 rounded-xl bg-blue-50 text-[#1495CC] box-content"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1495CC] text-white">
                <th className="text-left px-4 py-3 font-semibold">
                  Order ID
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Customer
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Status
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Amount
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recent_orders?.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500">
                      #{order.id}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.customer}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1495CC] text-xs font-medium whitespace-nowrap">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${order.total_amount}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
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
                    className="text-center py-10 text-gray-500"
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
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Drawing Status Summary
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Available
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {dashboard.available_drawings}
            </h3>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Sold Out
            </p>

            <h3 className="text-3xl font-bold text-orange-600 mt-2">
              {dashboard.sold_out_drawings}
            </h3>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Inactive
            </p>

            <h3 className="text-3xl font-bold text-gray-700 mt-2">
              {dashboard.inactive_drawings}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
