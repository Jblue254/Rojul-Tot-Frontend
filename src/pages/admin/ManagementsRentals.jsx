import { useEffect, useState } from "react";
import {
  getRentals,
  approveRental,
  rejectRental,
  activateRental,
  completeRental,
} from "../../api/rentals";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-red-100 text-red-700",
};

// Which actions are available for each status
const ACTIONS = {
  PENDING: [
    { label: "Approve", api: approveRental, color: "bg-green-600" },
    { label: "Reject", api: rejectRental, color: "bg-red-600" },
  ],
  APPROVED: [
    { label: "Activate", api: activateRental, color: "bg-blue-600" },
  ],
  ACTIVE: [
    { label: "Complete", api: completeRental, color: "bg-purple-600" },
  ],
};

function ManagementsRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const response = await getRentals();
      setRentals(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  const runAction = async (apiCall, id) => {
    if (busyId) return; // ignore clicks while a request is in flight

    setBusyId(id);
    setError("");

    try {
      await apiCall(id);
      await loadRentals();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Action failed. You may not have permission, or the rental status changed."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Adjust these two to match what your RentalSerializer actually returns
  const getCustomerName = (rental) =>
    rental.customer_name ||
    rental.customer_full_name ||
    rental.customer_email ||
    "Unknown Customer";

  const getMachineName = (rental) =>
    rental.machine_name || "Unknown Machine";

  if (loading) {
    return <div className="p-6">Loading rentals...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rental Management</h1>
        <p className="text-gray-500 mt-2">
          Manage customer rental requests.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 p-3"
        >
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ID",
                "Customer",
                "Machine",
                "Start Date",
                "End Date",
                "Total",
                "Status",
                "Actions",
              ].map((heading) => (
                <th key={heading} className="px-3 py-3 text-left">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rentals.length > 0 ? (
              rentals.map((rental) => (
                <tr key={rental.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap">
                    #{rental.id}
                  </td>

                  <td className="px-3 py-3 font-medium">
                    {getCustomerName(rental)}
                  </td>

                  <td className="px-3 py-3">{getMachineName(rental)}</td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {rental.start_date}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {rental.end_date}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    ${rental.total_cost ?? rental.total_price ?? 0}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        STATUS_COLORS[rental.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {(ACTIONS[rental.status] || []).map(
                        ({ label, api, color }) => (
                          <button
                            key={label}
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => runAction(api, rental.id)}
                            className={`${color} text-white px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {busyId === rental.id ? "..." : label}
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  No rentals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagementsRentals;