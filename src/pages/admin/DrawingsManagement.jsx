import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ScrollText,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

import {
  getDrawings,
  createDrawing,
  updateDrawing,
  deleteDrawing,
  getDrawingCategories,
} from "../../api/drawings";

function DrawingsManagement() {
  const [drawings, setDrawings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState(null);

  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    preview_image: null,
    drawing_file: null,
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(true);

  // Load drawings
  const loadDrawings = async () => {
    try {
      setLoading(true);

      const response = await getDrawings();
      setDrawings(response.data);
    } catch (error) {
      console.error("Error loading drawings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await getDrawingCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading drawing categories:", error);
    }
  };

  useEffect(() => {
    loadDrawings();
    loadCategories();
  }, []);

  // Category name from ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category ? category.name : "Uncategorized";
  };

  // Search and filters
  const filteredDrawings = drawings.filter((drawing) => {
    const matchesSearch =
      drawing.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      drawing.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      String(drawing.category) === String(selectedCategory);

    const matchesStatus =
      selectedStatus === "" ||
      drawing.status === selectedStatus;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredDrawings.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedDrawings = filteredDrawings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset pagination
  const resetPage = () => {
    setCurrentPage(1);
  };

  // Add drawing
  const handleAdd = () => {
    setEditingDrawing(null);

    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      preview_image: null,
      drawing_file: null,
      status: "AVAILABLE",
    });

    setPreview(null);
    setShowModal(true);
  };

  // Edit drawing
  const handleEdit = (drawing) => {
    setEditingDrawing(drawing);

    setFormData({
      title: drawing.title || "",
      description: drawing.description || "",
      category: drawing.category || "",
      price: drawing.price || "",
      preview_image: null,
      drawing_file: null,
      status: drawing.status || "AVAILABLE",
    });

    setPreview(drawing.preview_image || null);
    setShowModal(true);
  };

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // File changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    const file = files[0];

    setFormData((prev) => ({
      ...prev,
      [name]: file || null,
    }));

    if (name === "preview_image" && file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Create / update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("status", formData.status);

      if (formData.preview_image) {
        data.append(
          "preview_image",
          formData.preview_image
        );
      }

      if (formData.drawing_file) {
        data.append(
          "drawing_file",
          formData.drawing_file
        );
      }

      if (editingDrawing) {
        await updateDrawing(editingDrawing.id, data);
      } else {
        await createDrawing(data);
      }

      setShowModal(false);
      setEditingDrawing(null);
      setPreview(null);

      setCurrentPage(1);

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        preview_image: null,
        drawing_file: null,
        status: "AVAILABLE",
      });

      loadDrawings();
    } catch (error) {
      console.error("Error saving drawing:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      }
    }
  };

  // Delete
  const handleDelete = async (drawing) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${drawing.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDrawing(drawing.id);

      setCurrentPage(1);
      loadDrawings();
    } catch (error) {
      console.error("Error deleting drawing:", error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";

      case "SOLD_OUT":
        return "bg-yellow-100 text-yellow-700";

      case "INACTIVE":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Drawings Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage architectural drawings and plans
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[#1495CC] text-white px-5 py-3 rounded-xl hover:bg-[#0f7eaf]"
        >
          <Plus size={20} />
          Add Drawing
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <ScrollText
                size={24}
                className="text-[#1495CC]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Drawings
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {drawings.length}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">
            Available
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              drawings.filter(
                (drawing) =>
                  drawing.status === "AVAILABLE"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">
            Sold Out
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {
              drawings.filter(
                (drawing) =>
                  drawing.status === "SOLD_OUT"
              ).length
            }
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}
          <div className="relative">

            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search drawings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              resetPage();
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              resetPage();
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">
              All Statuses
            </option>

            <option value="AVAILABLE">
              Available
            </option>

            <option value="SOLD_OUT">
              Sold Out
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading drawings...
          </div>
        ) : paginatedDrawings.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No drawings found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Drawing
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {paginatedDrawings.map((drawing) => (
                  <tr
                    key={drawing.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >

                    {/* Drawing */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        {drawing.preview_image ? (
                          <img
                            src={drawing.preview_image}
                            alt={drawing.title}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageIcon
                              size={22}
                              className="text-gray-400"
                            />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-800">
                            {drawing.title}
                          </p>

                          <p className="text-sm text-gray-500 max-w-xs truncate">
                            {drawing.description}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-600">
                      {getCategoryName(drawing.category)}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-medium text-gray-800">
                      KES{" "}
                      {Number(drawing.price).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          drawing.status
                        )}`}
                      >
                        {drawing.status.replace("_", " ")}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            handleEdit(drawing)
                          }
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Edit drawing"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(drawing)
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete drawing"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredDrawings.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredDrawings.length}
                  </span>{" "}
                  drawings
                </p>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(page - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="px-3 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingDrawing
                    ? "Edit Drawing"
                    : "Add Drawing"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingDrawing
                    ? "Update drawing details"
                    : "Create a new architectural drawing"}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Modern 3 Bedroom House Plan"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe the architectural drawing..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (KES)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="AVAILABLE">
                    Available
                  </option>

                  <option value="SOLD_OUT">
                    Sold Out
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Preview image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Image
                </label>

                <input
                  type="file"
                  name="preview_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-xl p-3"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 w-32 h-32 object-cover rounded-xl border"
                  />
                )}
              </div>

              {/* Drawing file */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drawing File
                </label>

                <div className="flex items-center gap-3 mb-2 text-sm text-gray-500">
                  <FileText size={18} />
                  Upload the architectural drawing file
                </div>

                <input
                  type="file"
                  name="drawing_file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-xl p-3"
                />

                {editingDrawing &&
                  editingDrawing.drawing_file && (
                    <p className="text-sm text-gray-500 mt-2">
                      Existing drawing file is already uploaded.
                    </p>
                  )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

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
                  {editingDrawing
                    ? "Update Drawing"
                    : "Create Drawing"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default DrawingsManagement;