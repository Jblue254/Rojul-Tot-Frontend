import { useEffect, useState } from "react";

import {
  getProjectCosts,
  createProjectCost,
  updateProjectCost,
  deleteProjectCost,
} from "../../api/projectCosts";

import { getProjects } from "../../api/projects";

function ProjectCostsManagement() {
  const [costs, setCosts] = useState([]);
  const [projects, setProjects] = useState([]);

  // New filter and search states
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    project: "",
    title: "",
    category: "MATERIALS",
    amount: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCosts();
    loadProjects();
  }, []);

  const loadCosts = async () => {
    try {
      const response = await getProjectCosts();
      setCosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
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
      title: "",
      category: "MATERIALS",
      amount: "",
      notes: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProjectCost(editingId, formData);
      } else {
        await createProjectCost(formData);
      }

      resetForm();
      loadCosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (cost) => {
    setEditingId(cost.id);

    setFormData({
      project: cost.project,
      title: cost.title,
      category: cost.category,
      amount: cost.amount,
      notes: cost.notes || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this cost?");

    if (!confirmed) return;

    try {
      await deleteProjectCost(id);
      loadCosts();
    } catch (error) {
      console.error(error);
    }
  };

  // Budget Calculations
  const project = projects.find(
    (p) => p.id === Number(selectedProject)
  );

  // If a specific project is selected, use its budget. Otherwise, sum all project budgets.
  const projectBudget = selectedProject
    ? project?.budget || 0
    : projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);

  // Filter costs by selected project for budget stats
  const projectCosts = costs.filter(
    (cost) =>
      !selectedProject ||
      cost.project === Number(selectedProject)
  );

  const totalSpent = projectCosts.reduce(
    (sum, cost) => sum + Number(cost.amount),
    0
  );

  const remainingBudget = projectBudget - totalSpent;

  const budgetPercentage =
    projectBudget > 0 ? (totalSpent / projectBudget) * 100 : 0;

  // Further filter costs for the table by category and search term
  const filteredCosts = projectCosts.filter((cost) => {
    const matchesCategory =
      !selectedCategory || cost.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      cost.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cost.notes && cost.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Costs</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Update Cost" : "Add Cost"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            placeholder="Cost Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="MATERIALS">Materials</option>
            <option value="LABOUR">Labour</option>
            <option value="MACHINERY">Machinery</option>
            <option value="TRANSPORT">Transport</option>
            <option value="FUEL">Fuel</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              {editingId ? "Update Cost" : "Add Cost"}
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

      {/* Filters Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border p-3 rounded-lg bg-white shadow-sm"
        >
          <option value="">All Projects</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-3 rounded-lg bg-white shadow-sm"
        >
          <option value="">All Categories</option>
          <option value="MATERIALS">Materials</option>
          <option value="LABOUR">Labour</option>
          <option value="MACHINERY">Machinery</option>
          <option value="TRANSPORT">Transport</option>
          <option value="FUEL">Fuel</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="text"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-lg bg-white shadow-sm"
        />
      </div>

      {/* Budget Alerts */}
      {budgetPercentage >= 100 && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-medium">
          Budget exceeded.
        </div>
      )}

      {budgetPercentage >= 80 && budgetPercentage < 100 && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-xl mb-6 font-medium">
          Budget usage exceeds 80%.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Budget</p>
          <h2 className="text-2xl font-bold">
            KES {projectBudget.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Spent</p>
          <h2 className="text-2xl font-bold text-red-600">
            KES {totalSpent.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Remaining</p>
          <h2 className="text-2xl font-bold text-green-600">
            KES {remainingBudget.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Usage</p>
          <h2 className="text-2xl font-bold">
            {budgetPercentage.toFixed(1)}%
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              budgetPercentage >= 100
                ? "bg-red-600"
                : budgetPercentage >= 80
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Costs Table */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Project</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Created By</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCosts.length > 0 ? (
              filteredCosts.map((cost) => (
                <tr key={cost.id} className="border-b">
                  <td className="p-3">{cost.project_name}</td>
                  <td className="p-3">{cost.title}</td>
                  <td className="p-3">{cost.category}</td>
                  <td className="p-3">
                    KES {Number(cost.amount).toLocaleString()}
                  </td>
                  <td className="p-3">{cost.created_by_email}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(cost)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cost.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No project costs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectCostsManagement;