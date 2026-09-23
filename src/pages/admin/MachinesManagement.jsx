import { useEffect, useState } from "react";
import { getMachines } from "../../api/machines";

function MachinesManagement() {
  const [machines, setMachines] = useState([]);


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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Machines Management
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Total Machines</h3>
          <p className="text-3xl font-bold">
            {machines.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search machines..."
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1495CC] text-white">
            <tr>
              <th className="p-4 text-left">Machine</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tbody>
              {machines.map((machine) => (
                <tr key={machine.id} className="border-b">
                  <td className="p-4">
                    {machine.name}
                  </td>

                  <td className="p-4">
                    {machine.category_name}
                  </td>

                  <td className="p-4">
                    R{machine.price_per_day}
                  </td>

                  <td className="p-4">
                    {machine.quantity}
                  </td>

                  <td className="p-4">
                    {machine.location}
                  </td>

                  <td className="p-4">
                    {machine.status}
                  </td>

                  <td className="p-4">
                    Edit | Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MachinesManagement;