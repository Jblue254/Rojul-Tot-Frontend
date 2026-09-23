import { useEffect, useState } from "react";
import {
  getMachines,
  getCategories,
  createMachine,
  updateMachine,
  deleteMachine,
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
  const [editingMachine, setEditingMachine] = useState(null);
  
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
    loadCategories();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await getMachines();
      setMachines(response.data);
    } catch (error) {
      console.error("Error loading machines:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Handle Create or Update Machine
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMachine) {
        await updateMachine(editingMachine.id, formData);
      } else {
        await createMachine(formData);
      }
      loadMachines();
      setShowModal(false);
      setEditingMachine(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        price_per_day: "",
        quantity: "",
        location: "",
        status: "AVAILABLE",
      });
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  // Handle Delete Machine
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this machine?")) return;
    try {
      await deleteMachine(id);
      setMachines(machines.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  // Category Options derived from unique category names present in machines
  const categoryOptions = [
    ...new Set(machines.map((machine) => machine.category_name).filter(Boolean)),
  ];

  // Filter machines based on search query and category
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name?.toLowerCase().includes(search.toLowerCase());

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Machines Management</h1>

        <button
          onClick={() => {
            setEditingMachine(null);
            setFormData({
              name: "",
              category: "",
              description: "",
              price_per_day: "",
              quantity: "",
              location: "",
              status: "AVAILABLE",
            });
            setShowModal(true);
          }}
          className="bg-[#1495CC] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#1185B5] transition"
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
              <h3 className="text-gray-500">Total Machines</h3>
              <p className="text-3xl font-bold">{machines.length}</p>
            </div>
            <Package size={32} className="text-[#1495CC]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {availableMachines}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Rented</h3>
              <p className="text-3xl font-bold text-blue-600">
                {rentedMachines}
              </p>
            </div>
            <Truck size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Maintenance</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {maintenanceMachines}
              </p>
            </div>
            <Wrench size={32} className="text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
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
            className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-xl px-4 py-3 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
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
                <td className="p-4 font-medium">{machine.name}</td>
                <td className="p-4">{machine.category_name}</td>
                <td className="p-4">Ksh{machine.price_per_day}</td>
                <td className="p-4">{machine.quantity}</td>
                <td className="p-4">{machine.location}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      machine.status === "AVAILABLE"
                        ? "bg-green-500"
                        : machine.status === "RENTED"
                        ? "bg-blue-500"
                        : machine.status === "MAINTENANCE"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {machine.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      title="Edit Machine"
                      onClick={() => {
                        setEditingMachine(machine);
                        setFormData({
                          name: machine.name || "",
                          category: machine.category || "",
                          description: machine.description || "",
                          price_per_day: machine.price_per_day || "",
                          quantity: machine.quantity || "",
                          location: machine.location || "",
                          status: machine.status || "AVAILABLE",
                        });
                        setShowModal(true);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      title="Delete Machine"
                      onClick={() => handleDelete(machine.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingMachine ? "Edit Machine" : "Add Machine"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Machine Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                />

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price Per Day"
                  value={formData.price_per_day}
                  onChange={(e) =>
                    setFormData({ ...formData, price_per_day: e.target.value })
                  }
                  required
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
                  rows="4"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1495CC] text-white rounded-xl hover:bg-[#1185B5]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MachinesManagement;