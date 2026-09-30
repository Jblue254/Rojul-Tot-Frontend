import { useEffect, useState } from "react";

import {
  getProjectMachines,
  createProjectMachine,
  updateProjectMachine,
  deleteProjectMachine,
} from "../../api/projectMachines";

import { getProjects } from "../../api/projects";
import { getMachines } from "../../api/machines";

function ProjectAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);

  const [formData, setFormData] = useState({
    project: "",
    machine: "",
    quantity: 1,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        assignmentsRes,
        projectsRes,
        machinesRes,
      ] = await Promise.all([
        getProjectMachines(),
        getProjects(),
        getMachines(),
      ]);

      setAssignments(assignmentsRes.data);
      setProjects(projectsRes.data);
      setMachines(machinesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      project: "",
      machine: "",
      quantity: 1,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProjectMachine(
          editingId,
          formData
        );
      } else {
        await createProjectMachine(formData);
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.id);

    setFormData({
      project: assignment.project,
      machine: assignment.machine,
      quantity: assignment.quantity,
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this assignment?"
      )
    ) {
      return;
    }

    try {
      await deleteProjectMachine(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Project Assignments
      </h1>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          {editingId
            ? "Update Assignment"
            : "Assign Machine"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >

          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="border rounded-lg p-3"
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

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
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="border rounded-lg p-3"
          />

          <div className="md:col-span-3 flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              {editingId
                ? "Update Assignment"
                : "Assign Machine"}
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
                Project
              </th>

              <th className="text-left p-4">
                Machine
              </th>

              <th className="text-left p-4">
                Quantity
              </th>

              <th className="text-left p-4">
                Assigned At
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {assignments.map(
              (assignment) => (
                <tr
                  key={assignment.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {assignment.project_name}
                  </td>

                  <td className="p-4">
                    {assignment.machine_name}
                  </td>

                  <td className="p-4">
                    {assignment.quantity}
                  </td>

                  <td className="p-4">
                    {new Date(
                      assignment.assigned_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(
                          assignment
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          assignment.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              )
            )}

            {assignments.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-8 text-gray-500"
                >
                  No project assignments found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ProjectAssignments;