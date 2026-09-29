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
      <h1 className="text-3xl font-bold mb-8">
        Project Milestones
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total
          </p>

          <h2 className="text-3xl font-bold">
            {totalMilestones}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {
              completedMilestones
            }
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-orange-600">
            {
              pendingMilestones
            }
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Completion
          </p>

          <h2 className="text-3xl font-bold">
            {completionRate}%
          </h2>
        </div>

      </div>

      {/* Progress */}

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-4">
          Progress
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{
              width: `${completionRate}%`,
            }}
          />

        </div>
      </div>

      {/* Filter */}

      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <select
          value={
            selectedProject
          }
          onChange={(e) =>
            setSelectedProject(
              e.target.value
            )
          }
          className="border p-3 rounded-lg w-full"
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

      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
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
            className="border p-3 rounded-lg"
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
            className="border p-3 rounded-lg"
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
            className="border p-3 rounded-lg md:col-span-2"
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
            className="border p-3 rounded-lg md:col-span-2"
          />

          <div className="flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
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
                className="bg-gray-500 text-white px-5 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Upcoming */}

      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Upcoming Milestones
        </h2>

        {upcomingMilestones.map(
          (milestone) => (
            <div
              key={
                milestone.id
              }
              className="border-b py-3"
            >
              <p className="font-medium">
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

      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                Project
              </th>

              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Due Date
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
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
                  className="border-b"
                >
                  <td className="p-3">
                    {
                      milestone.project_name
                    }
                  </td>

                  <td className="p-3">
                    {
                      milestone.title
                    }
                  </td>

                  <td className="p-3">
                    {
                      milestone.due_date
                    }
                  </td>

                  <td className="p-3">
                    {milestone.completed ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-orange-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">

                    {!milestone.completed && (
                      <button
                        onClick={() =>
                          handleComplete(
                            milestone
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded"
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
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          milestone.id
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

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default ProjectMilestonesManagement;