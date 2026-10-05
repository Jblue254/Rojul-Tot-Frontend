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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Costs</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingId ? "Update Cost" : "Add Cost"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30 resize-none md:col-span-2"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[#1495CC] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
            >
              {editingId ? "Update Cost" : "Add Cost"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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
          className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
          className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
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
          className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
        />
      </div>

      {/* Budget Alerts */}
      {budgetPercentage >= 100 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 font-medium">
          Budget exceeded.
        </div>
      )}

      {budgetPercentage >= 80 && budgetPercentage < 100 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-6 font-medium">
          Budget usage exceeds 80%.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">Budget</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            KES {projectBudget.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">Spent</p>
          <h2 className="text-2xl font-bold text-red-600 mt-1">
            KES {totalSpent.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">Remaining</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">
            KES {remainingBudget.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#1495CC]">
          <p className="text-sm text-gray-500">Usage</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {budgetPercentage.toFixed(1)}%
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1495CC] text-white">
              <th className="text-left px-4 py-3 font-semibold">Project</th>
              <th className="text-left px-4 py-3 font-semibold">Title</th>
              <th className="text-left px-4 py-3 font-semibold">Category</th>
              <th className="text-left px-4 py-3 font-semibold">Amount</th>
              <th className="text-left px-4 py-3 font-semibold">Created By</th>
              <th className="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCosts.length > 0 ? (
              filteredCosts.map((cost) => (
                <tr
                  key={cost.id}
                  className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{cost.project_name}</td>
                  <td className="px-4 py-3 text-gray-700">{cost.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1495CC] whitespace-nowrap">
                      {cost.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    KES {Number(cost.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cost.created_by_email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cost)}
                      className="bg-blue-50 text-[#1495CC] px-3 py-1.5 rounded-xl font-medium hover:bg-blue-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cost.id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-medium hover:bg-red-100 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No project costs found matching your criteria.
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

export default ProjectCostsManagement;