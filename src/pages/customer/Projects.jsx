import { useEffect, useState } from "react";
import { Plus, FolderKanban, X, Pencil, Trash2 } from "lucide-react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/customerProjects";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    budget: "",
    start_date: "",
    expected_end_date: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that expected end date is after start date
    if (
      formData.start_date &&
      formData.expected_end_date &&
      formData.expected_end_date <= formData.start_date
    ) {
      alert("Expected end date must be after the start date.");
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }

      setShowModal(false);
      setEditingProject(null);
      loadProjects();
      setFormData({
        name: "",
        description: "",
        location: "",
        budget: "",
        start_date: "",
        expected_end_date: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.expected_end_date ||
        error.response?.data?.budget ||
        "Failed to save project."
      );
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      location: project.location || "",
      budget: project.budget || "",
      start_date: project.start_date || "",
      expected_end_date: project.expected_end_date || "",
    });

    setShowModal(true);
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      location: "",
      budget: "",
      start_date: "",
      expected_end_date: "",
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My Projects
        </h1>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#1495CC] text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h2 className="text-xl font-semibold mb-2">
              No Projects Yet
            </h2>
            <p className="text-gray-500">
              Create your first project request.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FolderKanban />
                  <h2 className="font-bold text-xl">
                    {project.name}
                  </h2>
                </div>

                <p className="text-gray-600 mb-3">
                  {project.description}
                </p>

                <div className="mt-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "PLANNING"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : project.status === "ON_HOLD"
                        ? "bg-yellow-100 text-yellow-700"
                        : project.status === "COMPLETED"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p>
                  <strong>Budget:</strong> KES {project.budget}
                </p>

                <p>
                  <strong>Location:</strong> {project.location}
                </p>

                <p>
                  <strong>Start Date:</strong> {project.start_date}
                </p>

                <p>
                  <strong>Expected End:</strong> {project.expected_end_date}
                </p>
              </div>

              {project.status === "PLANNING" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
                rows="3"
                required
              />

              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="number"
                placeholder="Budget (KES)"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      start_date: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected End Date
                </label>
                <input
                  type="date"
                  value={formData.expected_end_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expected_end_date: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1495CC] text-white p-3 rounded-xl font-semibold"
              >
                {editingProject ? "Update Project" : "Submit Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;