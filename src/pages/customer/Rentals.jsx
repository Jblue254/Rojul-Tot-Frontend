import { useEffect, useState } from "react";
import {
  Search,
  X,
  Clock,
  ThumbsUp,
  Tractor,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getMachines,
  getCategories,
  getRentals,
  createRental,
  deleteRental,
} from "../../api/customerRentals";
import {
  initiatePayment,
  getPaymentStatus,
} from "../../api/payments";

const statusIcons = {
  PENDING: Clock,
  APPROVED: ThumbsUp,
  ACTIVE: Tractor,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

function Rentals() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [detailsMachine, setDetailsMachine] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [machines, setMachines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rentals, setRentals] = useState([]);

  // M-Pesa payment state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [rentalData, setRentalData] = useState({
    start_date: "",
    end_date: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadData();
  }, [search, category, location]);

  // Poll payment status every 4 seconds (up to 90 attempts)
  useEffect(() => {
    if (!paymentId) return;

    let cancelled = false;
    let timer;
    let attempts = 0;

    const pollStatus = async () => {
      try {
        const response = await getPaymentStatus(paymentId);

        if (cancelled) return;

        const payment = response.data;

        if (payment.status === "SUCCESS") {
          setPaymentStatus("SUCCESS");
          setPaymentMessage(
            `Payment successful. Receipt: ${
              payment.receipt_number || "confirmed"
            }`
          );

          await loadData();
          return;
        }

        if (payment.status === "FAILED") {
          setPaymentStatus("FAILED");
          setPaymentMessage(
            payment.result_description ||
              "Payment failed. You can try again."
          );
          return;
        }

        setPaymentStatus(payment.status);
        setPaymentMessage(
          "Waiting for M-Pesa confirmation. Complete the prompt on your phone."
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Could not check payment status:", error);
        }
      }

      attempts += 1;

      if (!cancelled && attempts < 90) {
        timer = setTimeout(pollStatus, 4000);
      } else if (!cancelled) {
        setPaymentMessage(
          "Confirmation is taking longer than expected. Check the status before retrying."
        );
      }
    };

    timer = setTimeout(pollStatus, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [paymentId]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    try {
      const machinesResponse = await getMachines({
        search,
        category,
        location,
      });

      const rentalsResponse = await getRentals();

      setMachines(machinesResponse.data);
      setRentals(rentalsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();

    if (rentalData.end_date <= rentalData.start_date) {
      alert("End date must be after start date");
      return;
    }

    try {
      const response = await createRental({
        machine: selectedMachine.id,
        ...rentalData,
      });

      const newRental = response.data;

      setSelectedRentalId(newRental.id);
      setPaymentId(null);
      setPaymentStatus("READY");
      setPaymentMessage(
        `Rental request #${newRental.id} created. You can pay using M-Pesa.`
      );
      setShowPaymentModal(true);

      alert("Rental request submitted successfully. You can now pay with M-Pesa.");

      setShowModal(false);
      loadData();

      setRentalData({
        start_date: "",
        end_date: "",
        quantity: 1,
        notes: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const message = Object.values(
          error.response.data
        ).flat().join("\n");

        alert(message);
      } else {
        alert("Failed to submit rental request.");
      }
    }
  };

  const handleRentalPayment = async (rentalId) => {
    if (!phoneNumber.trim()) {
      setPaymentMessage("Enter your M-Pesa phone number.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentMessage("");

      const response = await initiatePayment({
        payment_type: "rental",
        item_id: rentalId,
        phone_number: phoneNumber.trim(),
      });

      setPaymentId(response.data.payment_id);
      setPaymentStatus(response.data.status);
      setPaymentMessage(
        response.data.message ||
          "Check your phone and complete the M-Pesa prompt."
      );
    } catch (error) {
      console.error(
        "Rental payment error:",
        error.response?.data || error
      );

      // If a payment is already pending, resume checking it.
      const existingPaymentId = error.response?.data?.payment_id;

      if (existingPaymentId) {
        setPaymentId(existingPaymentId);
        setPaymentStatus("PENDING");
        setPaymentMessage(
          "A payment attempt already exists. Checking its status."
        );
      } else {
        setPaymentMessage(
          error.response?.data?.detail ||
            "Could not start payment. Please try again."
        );
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const days =
    rentalData.start_date && rentalData.end_date
      ? Math.max(
          0,
          Math.ceil(
            (new Date(rentalData.end_date) -
              new Date(rentalData.start_date)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const estimatedTotal =
    selectedMachine
      ? Number(selectedMachine.price_per_day) *
        rentalData.quantity *
        days
      : 0;

  const rentalStats = {
    total: rentals.length,
    pending: rentals.filter((r) => r.status === "PENDING").length,
    active: rentals.filter((r) => r.status === "ACTIVE").length,
    completed: rentals.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Rentals
      </h1>

      {/* Filter Layout */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Available Machines
      </h2>

      {machines.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          No machines found.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between"
            >
              <div>
                {machine.image && (
                  <img
                    src={machine.image}
                    alt={machine.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}

                <h3 className="font-bold text-lg mb-1">
                  {machine.name}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {machine.category_name}
                </p>

                <p className="font-semibold text-gray-700">
                  KES {machine.price_per_day}/day
                </p>

                <p className="text-sm text-gray-600">
                  Qty: {machine.quantity}
                </p>

                <p className="text-sm text-gray-600">
                  {machine.location}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  {machine.status}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setDetailsMachine(machine)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setSelectedMachine(machine);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-[#1495CC] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1182b3] transition-colors"
                >
                  Rent Machine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rental Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Total Rentals</p>
          <p className="text-2xl font-bold text-gray-800">
            {rentalStats.total}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {rentalStats.pending}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {rentalStats.active}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-purple-600">
            {rentalStats.completed}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        My Rentals
      </h2>

      {rentals.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          No rentals yet.
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {rental.machine_name}
                </h3>

                <p className="text-sm text-gray-600">
                  {rental.start_date} → {rental.end_date}
                </p>

                <p className="text-sm text-gray-600">
                  Qty: {rental.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-800">
                  KES {rental.total_price}
                </p>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    rental.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : rental.status === "APPROVED"
                      ? "bg-blue-100 text-blue-700"
                      : rental.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : rental.status === "COMPLETED"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {(() => {
                    const StatusIcon = statusIcons[rental.status] || XCircle;
                    return <StatusIcon size={14} />;
                  })()}
                  {rental.status}
                </span>

                {["PENDING", "APPROVED"].includes(rental.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRentalId(rental.id);
                      setShowPaymentModal(true);
                      setPaymentId(null);
                      setPaymentStatus("READY");
                      setPaymentMessage(
                        `Pay KES ${rental.total_price} for rental #${rental.id}.`
                      );
                    }}
                    className="mt-2 block rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Pay with M-Pesa
                  </button>
                )}

                {rental.status === "PENDING" && (
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm(
                        "Cancel this rental request?"
                      );

                      if (!confirmed) return;

                      try {
                        await deleteRental(rental.id);
                        loadData();
                        alert("Rental cancelled successfully");
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    className="block mt-2 bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600"
                  >
                    Cancel Rental
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* M-Pesa Payment Modal */}
      {showPaymentModal && selectedRentalId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Pay Rental with M-Pesa</h2>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600">
              Rental #{selectedRentalId}
            </p>

            {paymentStatus === "SUCCESS" ? (
              <>
                {paymentMessage && (
                  <p className="mt-4 text-sm text-green-700" role="status">
                    {paymentMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <label className="mt-4 block text-sm font-medium">
                  M-Pesa phone number
                </label>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="0712345678"
                  className="mt-2 w-full rounded-xl border p-3"
                />

                <button
                  type="button"
                  disabled={
                    paymentLoading ||
                    paymentStatus === "PENDING" ||
                    paymentStatus === "INITIATED"
                  }
                  onClick={() => handleRentalPayment(selectedRentalId)}
                  className="mt-4 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentLoading
                    ? "Starting payment..."
                    : ["PENDING", "INITIATED"].includes(paymentStatus)
                      ? "Waiting for confirmation..."
                      : "Send M-Pesa Prompt"}
                </button>

                {paymentMessage && (
                  <p className="mt-4 text-sm text-gray-700" role="status">
                    {paymentMessage}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Machine Details Modal */}
      {detailsMachine && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {detailsMachine.name}
              </h2>
              <button
                onClick={() => setDetailsMachine(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {detailsMachine.image && (
              <img
                src={detailsMachine.image}
                alt={detailsMachine.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            <div className="space-y-3 text-sm">
              <p>
                <strong>Description:</strong>{" "}
                {detailsMachine.description || "No description provided."}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {detailsMachine.category_name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {detailsMachine.location}
              </p>

              <p>
                <strong>Quantity Available:</strong>{" "}
                {detailsMachine.quantity}
              </p>

              <p>
                <strong>Price Per Day:</strong> KES{" "}
                {Number(detailsMachine.price_per_day).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedMachine(detailsMachine);
                setDetailsMachine(null);
                setShowModal(true);
              }}
              className="mt-6 w-full bg-[#1495CC] text-white p-3 rounded-xl font-semibold hover:bg-[#1182b3] transition-colors"
            >
              Rent Machine
            </button>
          </div>
        </div>
      )}

      {showModal && selectedMachine && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Rent {selectedMachine.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleRentalSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={rentalData.start_date}
                  onChange={(e) =>
                    setRentalData({
                      ...rentalData,
                      start_date: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={rentalData.end_date}
                  onChange={(e) =>
                    setRentalData({
                      ...rentalData,
                      end_date: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={rentalData.quantity}
                  onChange={(e) =>
                    setRentalData({
                      ...rentalData,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  placeholder="Additional notes..."
                  value={rentalData.notes}
                  onChange={(e) =>
                    setRentalData({
                      ...rentalData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  rows="3"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                <p className="text-sm text-gray-600">
                  Price Per Day: KES {selectedMachine.price_per_day}
                </p>

                <p className="text-sm text-gray-600">
                  Days: {days}
                </p>

                <p className="font-bold text-gray-800 text-base">
                  Estimated Total: KES {Number(estimatedTotal).toLocaleString()}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1495CC] text-white p-3 rounded-xl font-semibold hover:bg-[#1182b3] transition-colors"
              >
                Submit Rental Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rentals;