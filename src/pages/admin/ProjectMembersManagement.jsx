import { useEffect, useState } from "react";
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

import {
    getProjectMembers,
    createProjectMember,
    updateProjectMember,
    deleteProjectMember,
} from "../../api/projectMembers";

import { getProjects } from "../../api/projects";

const memberRoles = [
    "FOREMAN",
    "WORKER",
    "ELECTRICIAN",
    "PLUMBER",
    "MASON",
    "CARPENTER",
    "PAINTER",
    "WELDER",
];

function ProjectMembersManagement() {
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        project: "",
        full_name: "",
        phone: "",
        role: "WORKER",
    });

    const loadMembers = async () => {
        try {
            setLoading(true);
            const response = await getProjectMembers();
            setMembers(response.data);
        } catch (error) {
            console.error("Error loading project members:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    useEffect(() => {
        loadMembers();
        loadProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingMember) {
                await updateProjectMember(
                    editingMember.id,
                    formData
                );
            } else {
                await createProjectMember(formData);
            }

            setShowModal(false);
            loadMembers();
        } catch (error) {
            console.error("Error saving project member:", error);
        }
    };

    const handleDelete = async (member) => {
        const confirmed = window.confirm(
            `Delete ${member.full_name}?`
        );

        if (!confirmed) return;

        try {
            await deleteProjectMember(member.id);
            loadMembers();
        } catch (error) {
            console.error("Error deleting project member:", error);
        }
    };

    return (
        <div className="p-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-7 h-7 text-indigo-600" />
                        Project Members Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage workers and staff assigned to construction projects.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setFormData({
                            project: "",
                            full_name: "",
                            phone: "",
                            role: "WORKER",
                        });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    New Member
                </button>
            </div>

            {/* Table Content */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">
                    Loading project members...
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Project</th>
                                <th className="px-6 py-3">Member Name</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No project members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {member.project_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {member.full_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {member.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingMember(member);
                                                        setFormData({
                                                            project: member.project || "",
                                                            full_name: member.full_name || "",
                                                            phone: member.phone || "",
                                                            role: member.role || "WORKER",
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                    title="Edit Member"
                                                    className="p-1 text-gray-400 hover:text-blue-600 transition"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member)}
                                                    title="Delete Member"
                                                    className="p-1 text-gray-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingMember ? "Edit Project Member" : "Add Project Member"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                                    Project
                                </label>
                                <select
                                    name="project"
                                    required
                                    value={formData.project}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
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
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    placeholder="e.g. John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="e.g. +254700000000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                >
                                    {memberRoles.map((role) => (
                                        <option
                                            key={role}
                                            value={role}
                                        >
                                            {role
                                                .replace("_", " ")
                                                .toLowerCase()
                                                .replace(/\b\w/g, c => c.toUpperCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                >
                                    {editingMember ? "Update Member" : "Create Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectMembersManagement;