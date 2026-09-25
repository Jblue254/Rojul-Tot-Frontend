import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import {
  getMachines,
  getRentals,
  createRental,
} from "../../api/customerRentals";

function Rentals() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [machines, setMachines] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [rentalData, setRentalData] = useState({
    start_date: "",
    end_date: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, [search, category, location]);

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
      await createRental({
        machine: selectedMachine.id,
        ...rentalData,
      });

      alert("Rental request submitted successfully");

      setShowModal(false);
      loadData();

      setRentalData({
        start_date: "",
        end_date: "",
        quantity: 1,
        notes: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.machine ||
        error.response?.data?.quantity ||
        "Failed to create rental"
      );

      console.error(error);
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

        <input
          type="number"
          placeholder="Category ID"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        />

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

              <button
                onClick={() => {
                  setSelectedMachine(machine);
                  setShowModal(true);
                }}
                className="mt-4 bg-[#1495CC] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1182b3] transition-colors"
              >
                Rent Machine
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-4">
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
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
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
                  {rental.status}
                </span>
              </div>
            </div>
          ))}
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
                  Estimated Total: KES {estimatedTotal}
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