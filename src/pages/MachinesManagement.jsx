import { useState } from "react";

function MachinesManagement() {
  const [machines, setMachines] = useState([]);

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
            <tr>
              <td className="p-4">No machines yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MachinesManagement;