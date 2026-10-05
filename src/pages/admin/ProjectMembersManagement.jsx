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
        <div>
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#1495CC]" />
                        Project Members Management
                    </h1>
                    <p className="text-gray-500 mt-2">
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
                    className="flex items-center justify-center gap-2 bg-[#1495CC] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
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
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1495CC] text-white text-sm font-semibold">
                                    <th className="px-4 py-3">Project</th>
                                    <th className="px-4 py-3">Member Name</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">
                                            No project members found.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {member.project_name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-800">
                                                {member.full_name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {member.phone || "N/A"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1495CC] whitespace-nowrap">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
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
                                                        className="p-2 rounded-xl text-[#1495CC] hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(member)}
                                                        title="Delete Member"
                                                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
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
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingMember ? "Edit Project Member" : "Add Project Member"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Project
                                </label>
                                <select
                                    name="project"
                                    required
                                    value={formData.project}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30 bg-white"
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
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    placeholder="e.g. John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="e.g. +254700000000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30 bg-white"
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

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#1495CC] text-white rounded-xl text-sm font-semibold hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
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