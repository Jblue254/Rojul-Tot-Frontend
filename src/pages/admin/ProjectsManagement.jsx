import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    FolderKanban,
    X,
    Play,
    CheckCircle2,
    PauseCircle,
} from "lucide-react";

import {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
} from "../../api/projects";

import { getUsers } from "../../api/users";

function ProjectsManagement() {
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [editingProject, setEditingProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        manager: "",
        location: "",
        budget: "",
        start_date: "",
        expected_end_date: "",
        status: "PLANNING",
        progress: 0,
    });

    const [loading, setLoading] = useState(true);

    const loadManagers = async () => {
        try {
            const response = await getUsers();
            const managersOnly = response.data.filter(
                (user) =>
                    user.role === "MANAGER" ||
                    user.role === "ADMIN"
            );
            setManagers(managersOnly);
        } catch (error) {
            console.error(error);
        }
    };

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await getProjects();
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
        loadManagers();
    }, []);

    // Filtering
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            project.description
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            project.customer_email
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            selectedStatus === "" ||
            project.status === selectedStatus;

        const matchesLocation =
            selectedLocation === "" ||
            project.location
                .toLowerCase()
                .includes(selectedLocation.toLowerCase());

        return (
            matchesSearch &&
            matchesStatus &&
            matchesLocation
        );
    });

    // Pagination
    const totalPages = Math.ceil(
        filteredProjects.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedProjects = filteredProjects.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // Total Budget Calculation
    const totalBudget = projects.reduce(
        (sum, project) =>
            sum + Number(project.budget || 0),
        0
    );

    // Add
    const handleAdd = () => {
        setEditingProject(null);
        setFormData({
            name: "",
            description: "",
            manager: "",
            location: "",
            budget: "",
            start_date: "",
            expected_end_date: "",
            status: "PLANNING",
            progress: 0,
        });
        setShowModal(true);
    };

    // Edit
    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name || "",
            description: project.description || "",
            manager: project.manager || "",
            location: project.location || "",
            budget: project.budget || "",
            start_date: project.start_date || "",
            expected_end_date:
                project.expected_end_date || "",
            status: project.status || "PLANNING",
            progress: project.progress || 0,
        });
        setShowModal(true);
    };

    // Quick Status Update Action (Auto-syncs progress)
    const handleQuickStatusUpdate = async (project, newStatus) => {
        try {
            let newProgress = project.progress;
            if (newStatus === "PLANNING") newProgress = 0;
            else if (newStatus === "ACTIVE" && project.progress === 0) newProgress = 25;
            else if (newStatus === "COMPLETED") newProgress = 100;
            else if (newStatus === "ON_HOLD") newProgress = project.progress;

            const data = {
                name: project.name,
                description: project.description,
                manager: project.manager || null,
                location: project.location,
                budget: project.budget,
                start_date: project.start_date,
                expected_end_date: project.expected_end_date,
                status: newStatus,
                progress: newProgress,
            };

            await updateProject(project.id, data);
            loadProjects();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    // Input with Automatic Status-to-Progress Sync
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Automatically adjust progress when status changes
            if (name === "status") {
                if (value === "PLANNING") {
                    updated.progress = 0;
                } else if (value === "ACTIVE" && Number(prev.progress) === 0) {
                    updated.progress = 25;
                } else if (value === "COMPLETED") {
                    updated.progress = 100;
                } else if (value === "CANCELLED") {
                    updated.progress = 0;
                }
            }

            return updated;
        });
    };

    // Save
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                name: formData.name,
                description: formData.description,
                manager: formData.manager || null,
                location: formData.location,
                budget: formData.budget,
                start_date: formData.start_date,
                expected_end_date:
                    formData.expected_end_date,
                status: formData.status,
                progress: Number(formData.progress),
            };

            if (editingProject) {
                await updateProject(
                    editingProject.id,
                    data
                );
            } else {
                await createProject(data);
            }

            setShowModal(false);
            setEditingProject(null);
            setCurrentPage(1);
            loadProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            if (error.response?.data) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    // Delete
    const handleDelete = async (project) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteProject(project.id);
            setCurrentPage(1);
            loadProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            if (error.response?.data) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PLANNING":
                return "bg-blue-100 text-blue-700";
            case "ACTIVE":
                return "bg-green-100 text-green-700";
            case "ON_HOLD":
                return "bg-yellow-100 text-yellow-700";
            case "COMPLETED":
                return "bg-purple-100 text-purple-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
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
                        Projects Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage customer construction projects
                    </p>
                </div>
                
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#1495CC] text-white px-5 py-3 rounded-xl hover:bg-[#107da8] transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FolderKanban
                                size={24}
                                className="text-[#1495CC]"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {projects.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-xl font-bold text-gray-800 mt-1 truncate">
                        KES {totalBudget.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Planning</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        {
                            projects.filter(
                                (p) => p.status === "PLANNING"
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {
                            projects.filter(
                                (p) => p.status === "ACTIVE"
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                        {
                            projects.filter(
                                (p) => p.status === "COMPLETED"
                            ).length
                        }
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-3 border border-gray-200 rounded-xl outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="PLANNING">Planning</option>
                        <option value="ACTIVE">Active</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by location..."
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading projects...
                    </div>
                ) : paginatedProjects.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No projects found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Project
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Progress
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Location & Budget
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Quick Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {project.name}
                                                </p>
                                                <p className="text-sm text-gray-500 max-w-xs truncate">
                                                    {project.description || "No description provided."}
                                                </p>
                                            </div>
                                        </td>
                                        
                                        {/* Progress Bar Column */}
                                        <td className="px-6 py-4">
                                            <div className="w-28 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${project.progress || 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {project.progress || 0}% Complete
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-gray-700 font-medium">
                                                {project.location}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                KES {Number(project.budget || 0).toLocaleString()}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status.replace("_", " ")}
                                            </span>
                                        </td>

                                        {/* Quick Status Action Buttons + Edit/Delete */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {project.status === "PLANNING" && (
                                                    <button
                                                        onClick={() => handleQuickStatusUpdate(project, "ACTIVE")}
                                                        className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 flex items-center gap-1"
                                                        title="Start Project"
                                                    >
                                                        <Play size={12} /> Start
                                                    </button>
                                                )}
                                                {project.status === "ACTIVE" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleQuickStatusUpdate(project, "ON_HOLD")}
                                                            className="px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-medium hover:bg-yellow-100 flex items-center gap-1"
                                                            title="Put On Hold"
                                                        >
                                                            <PauseCircle size={12} /> Hold
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickStatusUpdate(project, "COMPLETED")}
                                                            className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 flex items-center gap-1"
                                                            title="Mark Complete"
                                                        >
                                                            <CheckCircle2 size={12} /> Complete
                                                        </button>
                                                    </>
                                                )}
                                                {project.status === "ON_HOLD" && (
                                                    <button
                                                        onClick={() => handleQuickStatusUpdate(project, "ACTIVE")}
                                                        className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 flex items-center gap-1"
                                                        title="Resume Project"
                                                    >
                                                        <Play size={12} /> Resume
                                                    </button>
                                                )}

                                                <div className="h-4 w-[1px] bg-gray-200 mx-1" />

                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                    title="Full Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
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
                                            filteredProjects.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {filteredProjects.length}
                                    </span>{" "}
                                    projects
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
                                        disabled={currentPage === totalPages}
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

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingProject ? "Edit Project" : "Add New Project"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                                <select
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">Select Manager</option>
                                    {managers.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.email || m.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (KES)</label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected End Date</label>
                                    <input
                                        type="date"
                                        name="expected_end_date"
                                        value={formData.expected_end_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status (Auto-sets Progress)</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="PLANNING">Planning (0%)</option>
                                    <option value="ACTIVE">Active ({formData.progress || 25}%)</option>
                                    <option value="ON_HOLD">On Hold ({formData.progress}%)</option>
                                    <option value="COMPLETED">Completed (100%)</option>
                                    <option value="CANCELLED">Cancelled (0%)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#1495CC] text-white rounded-xl hover:bg-[#107da8]"
                                >
                                    Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectsManagement;