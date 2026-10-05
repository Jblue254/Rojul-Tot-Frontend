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
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Project Machines
        </h1>

        <p className="text-gray-500 mt-2">
          Assign and manage machines
          across projects.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Total Assignments
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {assignments.length}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Projects Using Machines
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {
              new Set(
                assignments.map(
                  (a) => a.project
                )
              ).size
            }
          </h2>
        </div>

        <div className="bg-white border border-gray-100 border-l-4 border-l-[#1495CC] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Available Machines
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-1">
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

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
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
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
            className="bg-[#1495CC] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
          >
            Assign
          </button>
        </form>
      </div>

      {/* Filters */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              e.target.value
            )
          }
          className="w-full md:w-80 bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1495CC] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Project
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Machine
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map(
              (assignment) => (
                <tr
                  key={assignment.id}
                  className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {assignment.project_name}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {assignment.machine_name}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleDelete(
                          assignment.id
                        )
                      }
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-medium hover:bg-red-100 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
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
                  className="text-center p-10 text-gray-500"
                >
                  No machine assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default ProjectMachinesManagement;