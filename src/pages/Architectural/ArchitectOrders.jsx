import { useEffect, useState } from "react";
import {
  getArchitectOrders,
  updateOrder,
} from "../../api/orders";

function ArchitectOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response =
        await getArchitectOrders();

      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId,
    status
  ) => {
    try {
      await updateOrder(orderId, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update order.");
    }
  };

  const filteredOrders = orders.filter(
    (order) => {
      const matchesSearch =
        order.customer_email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        String(order.id).includes(search);

      const matchesStatus =
        !statusFilter ||
        order.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    }
  );

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "PAID":
        return "bg-blue-100 text-blue-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Orders Management
          </h1>

          <p className="text-gray-500">
            Manage drawing orders
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="bg-[#1495CC] text-white px-5 py-2 rounded-xl"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by Order ID or Email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
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

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow">
          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2">
            Orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <h2 className="font-bold text-xl">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-600">
                    {order.customer_email}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Total:
                    {" "}
                    ${order.total_amount}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold mb-3">
                    Items
                  </h3>

                  <div className="space-y-2">
                    {order.items.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-xl p-3 flex justify-between"
                        >
                          <span>
                            {
                              item.drawing_title
                            }
                          </span>

                          <span>
                            Qty:
                            {" "}
                            {
                              item.quantity
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() =>
                    handleStatusUpdate(
                      order.id,
                      "PAID"
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Paid
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      order.id,
                      "PROCESSING"
                    )
                  }
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Processing
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      order.id,
                      "COMPLETED"
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Complete
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      order.id,
                      "CANCELLED"
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchitectOrders;