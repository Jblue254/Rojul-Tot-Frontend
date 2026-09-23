import { useEffect, useState } from "react";
import {
  getMachines,
  getCategories,
  createMachine,
} from "../../api/machines";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Package,
  Wrench,
  Truck,
} from "lucide-react";

function MachinesManagement() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price_per_day: "",
    quantity: "",
    location: "",
    status: "AVAILABLE",
  });


  useEffect(() => {
    loadMachines();
    categories();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await getMachines();
      setMachines(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter machines based on search query
  const categoryOptions = [
    ...new Set(
      machines.map((machine) => machine.category_name)
    ),
  ];
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      machine.category_name === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  // Calculate machine status counts
  const availableMachines = machines.filter(
    (m) => m.status === "AVAILABLE"
  ).length;

  const rentedMachines = machines.filter(
    (m) => m.status === "RENTED"
  ).length;

  const maintenanceMachines = machines.filter(
    (m) => m.status === "MAINTENANCE"
  ).length;

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Machines Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="
    bg-[#1495CC]
    text-white
    px-5
    py-3
    rounded-xl
    flex
    items-center
    gap-2
    hover:bg-[#1185B5]
    transition
  "
        >
          <Plus size={18} />
          Add Machine
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">
                Total Machines
              </h3>

              <p className="text-3xl font-bold">
                {machines.length}
              </p>
            </div>

            <Package
              size={32}
              className="text-[#1495CC]"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">
                Available
              </h3>

              <p className="text-3xl font-bold text-green-600">
                {availableMachines}
              </p>
            </div>

            <CheckCircle
              size={32}
              className="text-green-600"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">
                Rented
              </h3>

              <p className="text-3xl font-bold text-blue-600">
                {rentedMachines}
              </p>
            </div>

            <Truck
              size={32}
              className="text-blue-600"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">
                Maintenance
              </h3>

              <p className="text-3xl font-bold text-yellow-600">
                {maintenanceMachines}
              </p>
            </div>

            <Wrench
              size={32}
              className="text-yellow-600"
            />
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        w-full
        border
        rounded-xl
        pl-12
        pr-4
        py-3
      "
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="
      border
      rounded-xl
      px-4
      py-3
      min-w-[220px]
    "
        >
          <option value="">
            All Categories
          </option>

          {categoryOptions.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

      </div>
      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1495CC] text-white">
            <tr>
              <th className="p-4 text-left">Machine</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price/Day</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.map((machine) => (
              <tr key={machine.id} className="border-b">
                <td className="p-4">{machine.name}</td>
                <td className="p-4">{machine.category_name}</td>
                <td className="p-4">R{machine.price_per_day}</td>
                <td className="p-4">{machine.quantity}</td>
                <td className="p-4">{machine.location}</td>
                <td className="p-4">
                  <span
                    className={`
      px-3 py-1 rounded-full text-white text-sm font-medium
      ${machine.status === "AVAILABLE"
                        ? "bg-green-500"
                        : machine.status === "RENTED"
                          ? "bg-blue-500"
                          : machine.status === "MAINTENANCE"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
    `}
                  >
                    {machine.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">

                    <button title="Edit Machine"
                      className="
        p-2
        bg-blue-500
        text-white
        rounded-lg
        hover:bg-blue-600
      "
                    >
                      <Pencil size={16} />
                    </button>
                    <button title="Delete Machine"
                      className="
        p-2
        bg-red-500
        text-white
        rounded-lg
        hover:bg-red-600
      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Add Machine
            </h2>
            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Machine Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price Per Day"
                value={formData.price_per_day}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_per_day: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="border rounded-xl p-3"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="border rounded-xl p-3 md:col-span-2"
                rows="4"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}
    </div >
  );
}

export default MachinesManagement;