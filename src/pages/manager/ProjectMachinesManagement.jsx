import { useEffect, useState } from "react";
import {
  getProjectMachines,
  createProjectMachine,
  deleteProjectMachine,
} from "../../api/projectMachines";

import { getProjects } from "../../api/projects";
import { getMachines } from "../../api/machines";

function ProjectMachinesManagement() {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);

  const [selectedProject, setSelectedProject] =
    useState("");

  const [form, setForm] = useState({
    project: "",
    machine: "",
  });

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

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createProjectMachine(form);

      setForm({
        project: "",
        machine: "",
      });

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to assign machine.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Remove machine assignment?"
    );

    if (!confirmed) return;

    try {
      await deleteProjectMachine(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAssignments =
    selectedProject === ""
      ? assignments
      : assignments.filter(
          (assignment) =>
            String(assignment.project) ===
            selectedProject
        );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Project Machines
        </h1>

        <p className="text-gray-500 mt-2">
          Assign and manage machines
          across projects.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Total Assignments
          </p>

          <h2 className="text-3xl font-bold">
            {assignments.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Projects Using Machines
          </p>

          <h2 className="text-3xl font-bold">
            {
              new Set(
                assignments.map(
                  (a) => a.project
                )
              ).size
            }
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Available Machines
          </p>

          <h2 className="text-3xl font-bold">
            {
              machines.filter(
                (m) =>
                  m.status === "AVAILABLE"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Create Assignment */}

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Assign Machine
        </h2>

        <form
          onSubmit={handleCreate}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
            value={form.project}
            onChange={(e) =>
              setForm({
                ...form,
                project: e.target.value,
              })
            }
            className="border rounded-lg p-3"
            required
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
            value={form.machine}
            onChange={(e) =>
              setForm({
                ...form,
                machine: e.target.value,
              })
            }
            className="border rounded-lg p-3"
            required
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

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-5"
          >
            Assign
          </button>
        </form>
      </div>

      {/* Filters */}

      <div className="bg-white border rounded-xl p-5">
        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              e.target.value
            )
          }
          className="border rounded-lg p-3"
        >
          <option value="">
            All Projects
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
      </div>

      {/* Assignments Table */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Project
              </th>

              <th className="p-3 text-left">
                Machine
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map(
              (assignment) => (
                <tr
                  key={assignment.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {assignment.project_name}
                  </td>

                  <td className="p-3">
                    {assignment.machine_name}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleDelete(
                          assignment.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredAssignments.length ===
              0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-8 text-gray-500"
                >
                  No machine assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectMachinesManagement;