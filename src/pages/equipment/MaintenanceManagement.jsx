import { useEffect, useState } from "react";

import {
  getMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from "../../api/maintenance";

import { getMachines } from "../../api/machines";

function MaintenanceManagement() {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    machine: "",
    service_type: "",
    description: "",
    cost: "",
    service_date: "",
    next_service_date: "",
    status: "PENDING",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recordsRes, machinesRes] =
        await Promise.all([
          getMaintenanceRecords(),
          getMachines(),
        ]);

      setRecords(recordsRes.data);
      setMachines(machinesRes.data);
    } catch (error) {
      console.error(error);
    }
    console.log(machines.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      machine: "",
      service_type: "",
      description: "",
      cost: "",
      service_date: "",
      next_service_date: "",
      status: "PENDING",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMaintenanceRecord(
          editingId,
          formData
        );
      } else {
        await createMaintenanceRecord(
          formData
        );
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to save record");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      machine: record.machine,
      service_type: record.service_type,
      description:
        record.description || "",
      cost: record.cost,
      service_date: record.service_date,
      next_service_date:
        record.next_service_date || "",
      status: record.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete maintenance record?"
      );

    if (!confirmed) return;

    try {
      await deleteMaintenanceRecord(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );

      case "IN_PROGRESS":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            In Progress
          </span>
        );

      case "COMPLETED":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
            Completed
          </span>
        );

      default:
        return status;
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Maintenance Management
      </h1>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          {editingId
            ? "Update Maintenance Record"
            : "Create Maintenance Record"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >

          <select
            name="machine"
            value={formData.machine}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          >
            <option value="">
              Select Machine
            </option>

            {machines.map((machine) => (
              <option
                key={machine.id}
                value={machine.id}
              >
                {machine.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="service_type"
            placeholder="Service Type"
            value={formData.service_type}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            step="0.01"
            name="cost"
            placeholder="Cost"
            value={formData.cost}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="PENDING">
              Pending
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>

          <input
            type="date"
            name="service_date"
            value={formData.service_date}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          />

          <input
            type="date"
            name="next_service_date"
            value={formData.next_service_date}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-3 md:col-span-2"
          />

          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              {editingId
                ? "Update Record"
                : "Create Record"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-5 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">
                Machine
              </th>

              <th className="text-left p-4">
                Service Type
              </th>

              <th className="text-left p-4">
                Cost
              </th>

              <th className="text-left p-4">
                Service Date
              </th>

              <th className="text-left p-4">
                Next Service
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {records.map((record) => (
              <tr
                key={record.id}
                className="border-t"
              >
                <td className="p-4">
                  {record.machine_name}
                </td>

                <td className="p-4">
                  {record.service_type}
                </td>

                <td className="p-4">
                  KES{" "}
                  {Number(
                    record.cost
                  ).toLocaleString()}
                </td>

                <td className="p-4">
                  {record.service_date}
                </td>

                <td className="p-4">
                  {record.next_service_date ||
                    "-"}
                </td>

                <td className="p-4">
                  {getStatusBadge(
                    record.status
                  )}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() =>
                      handleEdit(record)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        record.id
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-8 text-gray-500"
                >
                  No maintenance records found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default MaintenanceManagement;