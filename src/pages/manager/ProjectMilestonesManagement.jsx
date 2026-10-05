import { useEffect, useState } from "react";

import {
  getProjectMilestones,
  createProjectMilestone,
  updateProjectMilestone,
  deleteProjectMilestone,
} from "../../api/projectMilestones";

import { getProjects } from "../../api/projects";

function ProjectMilestonesManagement() {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] =
    useState("");

  const [formData, setFormData] = useState({
    project: "",
    title: "",
    description: "",
    due_date: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {
    loadMilestones();
    loadProjects();
  }, []);

  const loadMilestones = async () => {
    try {
      const response =
        await getProjectMilestones();

      setMilestones(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProjects = async () => {
    try {
      const response =
        await getProjects();

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      project: "",
      title: "",
      description: "",
      due_date: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProjectMilestone(
          editingId,
          formData
        );
      } else {
        await createProjectMilestone(
          formData
        );
      }

      resetForm();
      loadMilestones();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (milestone) => {
    setEditingId(milestone.id);

    setFormData({
      project: milestone.project,
      title: milestone.title,
      description:
        milestone.description || "",
      due_date:
        milestone.due_date,
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete milestone?"
      )
    )
      return;

    try {
      await deleteProjectMilestone(
        id
      );

      loadMilestones();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (
    milestone
  ) => {
    try {
      await updateProjectMilestone(
        milestone.id,
        {
          completed: true,
        }
      );

      loadMilestones();

    } catch (error) {
      console.error(error);
    }
  };

  const filteredMilestones =
    milestones.filter((m) => {
      if (
        selectedProject &&
        m.project !==
          Number(selectedProject)
      ) {
        return false;
      }

      return true;
    });

  const totalMilestones =
    filteredMilestones.length;

  const completedMilestones =
    filteredMilestones.filter(
      (m) => m.completed
    ).length;

  const pendingMilestones =
    totalMilestones -
    completedMilestones;

  const completionRate =
    totalMilestones > 0
      ? (
          (completedMilestones /
            totalMilestones) *
          100
        ).toFixed(1)
      : 0;

  const upcomingMilestones =
    [...filteredMilestones]
      .filter((m) => !m.completed)
      .sort(
        (a, b) =>
          new Date(
            a.due_date
          ) -
          new Date(
            b.due_date
          )
      )
      .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Project Milestones
      </h1>

      {/* Stats */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {totalMilestones}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-1">
            {
              completedMilestones
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-1">
            {
              pendingMilestones
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">
            Completion
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {completionRate}%
          </h2>
        </div>

      </div>

      {/* Progress */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">
          Progress
        </h2>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">

          <div
            className="bg-[#1495CC] h-3 rounded-full transition-all"
            style={{
              width: `${completionRate}%`,
            }}
          />

        </div>
      </div>

      {/* Filter */}

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">

        <select
          value={
            selectedProject
          }
          onChange={(e) =>
            setSelectedProject(
              e.target.value
            )
          }
          className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
        >
          <option value="">
            All Projects
          </option>

          {projects.map(
            (project) => (
              <option
                key={
                  project.id
                }
                value={
                  project.id
                }
              >
                {
                  project.name
                }
              </option>
            )
          )}
        </select>

      </div>

      {/* Form */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingId
            ? "Update Milestone"
            : "Create Milestone"}
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          className="grid md:grid-cols-2 gap-4"
        >

          <select
            name="project"
            value={
              formData.project
            }
            onChange={
              handleChange
            }
            required
            className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
          >
            <option value="">
              Select Project
            </option>

            {projects.map(
              (project) => (
                <option
                  key={
                    project.id
                  }
                  value={
                    project.id
                  }
                >
                  {
                    project.name
                  }
                </option>
              )
            )}
          </select>

          <input
            type="date"
            name="due_date"
            value={
              formData.due_date
            }
            onChange={
              handleChange
            }
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
          />

          <input
            type="text"
            name="title"
            placeholder="Milestone Title"
            value={
              formData.title
            }
            onChange={
              handleChange
            }
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30 md:col-span-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30 resize-none md:col-span-2"
          />

          <div className="flex gap-3">

            <button
              type="submit"
              className="bg-[#1495CC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
            >
              {editingId
                ? "Update"
                : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={
                  resetForm
                }
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Upcoming */}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Milestones
        </h2>

        {upcomingMilestones.map(
          (milestone) => (
            <div
              key={
                milestone.id
              }
              className="border-b border-gray-100 last:border-b-0 py-3"
            >
              <p className="font-medium text-gray-900">
                {
                  milestone.title
                }
              </p>

              <p className="text-sm text-gray-500">
                Due:
                {" "}
                {
                  milestone.due_date
                }
              </p>
            </div>
          )
        )}

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#1495CC] text-white">

              <th className="px-4 py-3 text-left font-semibold">
                Project
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Title
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Due Date
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Status
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredMilestones.map(
              (
                milestone
              ) => (
                <tr
                  key={
                    milestone.id
                  }
                  className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {
                      milestone.project_name
                    }
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {
                      milestone.title
                    }
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {
                      milestone.due_date
                    }
                  </td>

                  <td className="px-4 py-3">
                    {milestone.completed ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex gap-2">

                    {!milestone.completed && (
                      <button
                        onClick={() =>
                          handleComplete(
                            milestone
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleEdit(
                          milestone
                        )
                      }
                      className="bg-blue-50 text-[#1495CC] px-3 py-1.5 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          milestone.id
                        )
                      }
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>

                    </div>

                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

        </div>

      </div>
    </div>
  );
}

export default ProjectMilestonesManagement;