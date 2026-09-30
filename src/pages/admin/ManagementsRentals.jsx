import { useEffect, useState } from "react";
import {
  getRentals,
  approveRental,
  rejectRental,
  activateRental,
  completeRental,
} from "../../api/rentals";

function ManagementsRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const response = await getRentals();
      setRentals(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRental(id);
      loadRentals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRental(id);
      loadRentals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateRental(id);
      loadRentals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeRental(id);
      loadRentals();
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerName = (rental) => {
    if (rental.customer_name) return rental.customer_name;
    if (rental.customer_full_name) return rental.customer_full_name;

    if (rental.customer && typeof rental.customer === "object") {
      const c = rental.customer;
      const fullName = `${c.first_name || ""} ${c.last_name || ""}`.trim();
      return (
        c.full_name ||
        c.name ||
        fullName ||
        c.username ||
        c.email ||
        "Unknown Customer"
      );
    }

    return rental.customer_email || "Unknown Customer";
  };

  const getMachineName = (rental) => {
    if (rental.machine_name) return rental.machine_name;

    if (rental.machine && typeof rental.machine === "object") {
      return (
        rental.machine.name ||
        rental.machine.title ||
        rental.machine.model ||
        "Unknown Machine"
      );
    }

    return "Unknown Machine";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-purple-100 text-purple-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading rentals...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Rental Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage customer rental requests.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left">
                ID
              </th>

              <th className="px-3 py-3 text-left">
                Customer
              </th>

              <th className="px-3 py-3 text-left">
                Machine
              </th>

              <th className="px-3 py-3 text-left">
                Start Date
              </th>

              <th className="px-3 py-3 text-left">
                End Date
              </th>

              <th className="px-3 py-3 text-left">
                Total
              </th>

              <th className="px-3 py-3 text-left">
                Status
              </th>

              <th className="px-3 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rentals.length > 0 ? (
              rentals.map((rental) => (
                <tr
                  key={rental.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    #{rental.id}
                  </td>

                  <td className="px-3 py-3 font-medium">
                    {getCustomerName(rental)}
                  </td>

                  <td className="px-3 py-3">
                    {getMachineName(rental)}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {rental.start_date}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {rental.end_date}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    $
                    {rental.total_cost ??
                      rental.total_price ??
                      0}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        rental.status
                      )}`}
                    >
                      {rental.status}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {rental.status ===
                        "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(
                                rental.id
                              )
                            }
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleReject(
                                rental.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {rental.status ===
                        "APPROVED" && (
                        <button
                          onClick={() =>
                            handleActivate(
                              rental.id
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          Activate
                        </button>
                      )}

                      {rental.status ===
                        "ACTIVE" && (
                        <button
                          onClick={() =>
                            handleComplete(
                              rental.id
                            )
                          }
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
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
  );
}

export default ManagementsRentals;