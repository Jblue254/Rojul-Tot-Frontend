import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    FolderKanban,
    X,
} from "lucide-react";

import {
    createProject,
    updateProject,
    deleteProject,
} from "../../api/projects";

import { getUsers } from "../../api/users";
import { getProjects } from "../../api/projects";




function ProjectsManagement() {
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const [editingProject, setEditingProject] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        manager: "",
        location: "",
        budget: "",
        start_date: "",
        expected_end_date: "",
        status: "PLANNING",
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

    // Load projects
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
        });

        setShowModal(true);
    };

    // Input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            };

            if (editingProject) {
                await updateProject(
                    editingProject.id,
                    data
                );
            } else {
                /*
                 * Customer is NOT sent here.
                 * Backend automatically sets customer
                 * to the authenticated user.
                 */
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

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

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
                    <p className="text-sm text-gray-500">
                        Planning
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        {
                            projects.filter(
                                (p) => p.status === "PLANNING"
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Active
                    </p>

                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {
                            projects.filter(
                                (p) => p.status === "ACTIVE"
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Completed
                    </p>

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

                    {/* Search */}
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

                    {/* Status */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-3 border border-gray-200 rounded-xl outline-none"
                    >
                        <option value="">
                            All Statuses
                        </option>

                        <option value="PLANNING">
                            Planning
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="ON_HOLD">
                            On Hold
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>
                    </select>

                    {/* Location */}
                    <input
                        type="text"
                        placeholder="Filter by location..."
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
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
                                        Customer
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Location
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Budget
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Manager
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

                                {paginatedProjects.map((project) => (

                                    <tr
                                        key={project.id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        {/* Project */}
                                        <td className="px-6 py-4">

                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {project.name}
                                                </p>

                                                <p className="text-sm text-gray-500 max-w-xs truncate">
                                                    {project.description}
                                                </p>
                                            </div>

                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-4">

                                            <p className="text-gray-700">
                                                {project.customer_email ||
                                                    "Unknown"}
                                            </p>

                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {project.location}
                                        </td>

                                        {/* Budget */}
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            KES{" "}
                                            {Number(
                                                project.budget
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {project.manager_email || "Unassigned"}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>

                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(project)
                                                    }
                                                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                                    title="Edit project"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(project)
                                                    }
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Delete project"
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
                                        Page {currentPage} of{" "}
                                        {totalPages}
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


        </div>
    );
}

export default ProjectsManagement;