import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Tags,
  X,
} from "lucide-react";

import {
  getDrawingCategories,
  createDrawingCategory,
  updateDrawingCategory,
  deleteDrawingCategory,
} from "../../api/drawings";

function DrawingCategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await getDrawingCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading drawing categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description || "",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateDrawingCategory(
          editingCategory.id,
          formData
        );
      } else {
        await createDrawingCategory(formData);
      }

      setShowModal(false);
      setEditingCategory(null);

      setFormData({
        name: "",
        description: "",
      });

      loadCategories();
    } catch (error) {
      console.error(
        "Error saving drawing category:",
        error
      );

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      }
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDrawingCategory(category.id);
      loadCategories();
    } catch (error) {
      console.error(
        "Error deleting drawing category:",
        error
      );

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Drawing Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Manage categories for architectural drawings
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[#1495CC] text-white px-5 py-3 rounded-xl hover:bg-[#0f7eaf]"
        >
          <Plus size={20} />
          Add Category
        </button>

      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Tags
              size={24}
              className="text-[#1495CC]"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Drawing Categories
            </p>

            <p className="text-2xl font-bold text-gray-800">
              {categories.length}
            </p>
          </div>

        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search drawing categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No drawing categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Description
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Created
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Tags
                            size={18}
                            className="text-[#1495CC]"
                          />
                        </div>

                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {category.description ||
                        "No description"}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {category.created_at
                        ? new Date(
                            category.created_at
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            handleEdit(category)
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Edit category"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(category)
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete category"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingCategory
                    ? "Edit Drawing Category"
                    : "Add Drawing Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingCategory
                    ? "Update category details"
                    : "Create a new drawing category"}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Residential"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this drawing category..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#1495CC] text-white hover:bg-[#0f7eaf]"
                >
                  {editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default DrawingCategoriesManagement;