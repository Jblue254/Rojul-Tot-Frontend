import { useEffect, useState } from "react";
import { getMachines } from "../../api/machines";
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


  useEffect(() => {
    loadMachines();
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
  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Stats */ }
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

  {/* Search */ }
  <div className="relative mb-6">
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
      focus:outline-none
      focus:ring-2
      focus:ring-[#1495CC]
    "
    />
  </div>

  {/* Table */ }
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
            <td className="p-4">{machine.status}</td>
            <td className="p-4">Edit | Delete</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </div >
  );
}

export default MachinesManagement;