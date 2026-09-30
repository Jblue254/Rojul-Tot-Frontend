import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  ShoppingCart,
} from "lucide-react";

import {
  getOrders,
  updateOrder,
} from "../../api/orders";

export default function ArchitectOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } =
        await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id,
    status
  ) => {
    try {
      await updateOrder(id, {
        status,
      });

      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(
    (order) => {
      const matchesSearch =
        !filters.search ||
        String(order.id).includes(
          filters.search
        ) ||
        order.customer_email
          ?.toLowerCase()
          .includes(
            filters.search.toLowerCase()
          );

      const matchesStatus =
        !filters.status ||
        order.status === filters.status;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  if (loading) {
    return (
      <div className="p-6">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Drawing Orders
        </h1>

        <p className="text-gray-500 mt-2">
          Manage architectural drawing
          purchases and deliveries.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search order..."
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
              className="w-full border rounded-lg pl-10 p-2"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          >
            <option value="">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4">
                  ID
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
                  Items
                </th>

                <th className="text-left p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {
                        order.customer_email
                      }
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full bg-gray-100">
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      $
                      {
                        order.total_amount
                      }
                    </td>

                    <td className="p-4">
                      {
                        order.items
                          ?.length
                      }
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="p-2 border rounded-lg"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}

              {!filteredOrders.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                Order #
                {selectedOrder.id}
              </h2>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {
                  selectedOrder.customer_email
                }
              </p>

              <p>
                <strong>
                  Total:
                </strong>{" "}
                $
                {
                  selectedOrder.total_amount
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  selectedOrder.status
                }
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Ordered Drawings
              </h3>

              <div className="space-y-2">
                {selectedOrder.items?.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {
                            item.drawing_title
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p>
                        $
                        {
                          item.subtotal
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-6">
              <select
                value={
                  selectedOrder.status
                }
                onChange={(e) =>
                  handleStatusUpdate(
                    selectedOrder.id,
                    e.target.value
                  )
                }
                className="border rounded-lg p-2"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}