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
    Wrench,
    UserPlus,
    Flag,
} from "lucide-react";

import {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
} from "../../api/projects";
import {
    getProjectMembers,
    createProjectMember,
    deleteProjectMember,
} from "../../api/projectMembers";
import { getUsers } from "../../api/users";
import { getMachines } from "../../api/machines";
import {
    getProjectMachines,
    createProjectMachine,
    deleteProjectMachine,
} from "../../api/projectMachines";
import {
    getProjectExpenses,
    createProjectExpense,
} from "../../api/projectExpenses";
import {
    getProjectMilestones,
    createProjectMilestone,
    updateProjectMilestone,
} from "../../api/projectMilestones";

const EMPTY_PROJECT = {
    name: "",
    description: "",
    manager: "",
    location: "",
    budget: "",
    start_date: "",
    expected_end_date: "",
    status: "PLANNING",
    progress: 0,
};

const EMPTY_MEMBER = { full_name: "", phone: "", role: "WORKER" };
const EMPTY_MACHINE = { machine: "", quantity: 1 };

const inputCls =
    "w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200";
const thCls = "text-left px-3 py-3 text-sm font-semibold text-gray-600";

function ProjectsManagement() {
    // ---------- State: data ----------
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [machines, setMachines] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [milestones, setMilestones] = useState([]);

    // ---------- State: filters & pagination ----------
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // ---------- State: selection ----------
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProjectMilestones, setSelectedProjectMilestones] =
        useState([]);

    // ---------- State: modals ----------
    const [showModal, setShowModal] = useState(false);
    const [showMachineModal, setShowMachineModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [showMilestoneListModal, setShowMilestoneListModal] =
        useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // ---------- State: forms ----------
    const [formData, setFormData] = useState(EMPTY_PROJECT);
    const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
    const [machineForm, setMachineForm] = useState(EMPTY_MACHINE);

    const [milestoneForm, setMilestoneForm] = useState({
        project: "",
        title: "",
        description: "",
        due_date: "",
    });

    const [expenseForm, setExpenseForm] = useState({
        project: "",
        title: "",
        category: "MATERIALS",
        amount: "",
        notes: "",
    });

    // ---------- Loaders ----------
    const loadManagers = async () => {
        try {
            const response = await getUsers();
            setManagers(
                response.data.filter(
                    (u) => u.role === "MANAGER" || u.role === "ADMIN"
                )
            );
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

    const loadMachines = async () => {
        try {
            const response = await getMachines();
            setMachines(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadAssignments = async () => {
        try {
            const response = await getProjectMachines();
            setAssignments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadMembers = async () => {
        try {
            const response = await getProjectMembers();
            setMembers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Was declared inside handleRemoveMember, so useEffect could not see it
    const loadExpenses = async () => {
        try {
            const response =
                await getProjectExpenses();

            setExpenses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadMilestones = async () => {
        try {
            const response =
                await getProjectMilestones();

            setMilestones(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadProjects();
        loadManagers();
        loadMachines();
        loadAssignments();
        loadMembers(); // was missing, so no team members were loading
        loadExpenses();
        loadMilestones();
    }, []);

    // ---------- Helpers ----------
    const getAssignedMachines = (projectId) =>
        assignments.filter((a) => a.project === projectId);

    const getAssignedMembers = (projectId) =>
        members.filter((m) => m.project === projectId);

    const getManagerName = (project) => {
        if (project.manager_name) return project.manager_name;
        const m = managers.find((u) => u.id === project.manager);
        return m ? m.email || m.username : "Unassigned";
    };

    // "FOREMAN" -> "Foreman"
    const formatRole = (role) =>
        role ? role.charAt(0) + role.slice(1).toLowerCase() : "";

    const showApiError = (error) => {
        if (error.response?.data) {
            alert(JSON.stringify(error.response.data));
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

    // ---------- Expense helpers ----------
    const getProjectExpensesTotal = (
        projectId
    ) => {
        return expenses
            .filter(
                (expense) =>
                    expense.project === projectId
            )
            .reduce(
                (sum, expense) =>
                    sum +
                    Number(expense.amount || 0),
                0
            );
    };

    const getRemainingBudget = (
        project
    ) => {
        return (
            Number(project.budget || 0) -
            getProjectExpensesTotal(project.id)
        );
    };

    const openExpenseModal = (project) => {
        setExpenseForm({
            project: project.id,
            title: "",
            category: "MATERIALS",
            amount: "",
            notes: "",
        });

        setShowExpenseModal(true);
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();

        try {
            await createProjectExpense(
                expenseForm
            );

            setShowExpenseModal(false);

            loadExpenses();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    // ---------- Milestone helpers ----------
    // Progress = completed milestones / all milestones (0 if none)
    const getProjectProgress = (projectId) => {
        const projectMilestones =
            milestones.filter(
                (m) => m.project === projectId
            );

        if (!projectMilestones.length)
            return 0;

        const completed =
            projectMilestones.filter(
                (m) => m.completed
            ).length;

        return Math.round(
            (completed /
                projectMilestones.length) *
            100
        );
    };

    const openMilestones = (project) => {
        setSelectedProject(project);

        setSelectedProjectMilestones(
            milestones.filter(
                (m) => m.project === project.id
            )
        );

        setShowMilestoneListModal(true);
    };

    // Status + progress follow the milestones automatically:
    //   no milestones            -> PLANNING (0%)
    //   some milestones done     -> ACTIVE (done / total %)
    //   all milestones done      -> COMPLETED (100%)
    // ON_HOLD and CANCELLED are set by hand, so they are never overwritten
    const syncProjectStatus = async (project, projectMilestones) => {
        // Use the latest copy of the project, not the modal's old snapshot
        const current =
            projects.find((p) => p.id === project.id) || project;

        if (
            current.status === "ON_HOLD" ||
            current.status === "CANCELLED"
        )
            return;

        const total = projectMilestones.length;
        const done = projectMilestones.filter(
            (m) => m.completed
        ).length;

        let newStatus = "PLANNING";
        let newProgress = 0;

        if (total > 0) {
            newProgress = Math.round((done / total) * 100);
            newStatus = done === total ? "COMPLETED" : "ACTIVE";
        }

        // Nothing changed, so skip the extra API call
        if (
            newStatus === current.status &&
            newProgress === current.progress
        )
            return;

        try {
            await updateProject(current.id, {
                name: current.name,
                description: current.description,
                manager: current.manager || null,
                location: current.location,
                budget: current.budget,
                start_date: current.start_date,
                expected_end_date: current.expected_end_date,
                status: newStatus,
                progress: newProgress,
            });

            loadProjects();
        } catch (error) {
            console.error("Error syncing status:", error);
            showApiError(error);
        }
    };

    const handleMilestoneSubmit = async (
        e
    ) => {
        e.preventDefault();

        try {
            const response =
                await createProjectMilestone(
                    milestoneForm
                );

            // Show the new milestone in the open list straight away
            setSelectedProjectMilestones([
                ...selectedProjectMilestones,
                response.data,
            ]);

            setShowMilestoneModal(false);

            // Inserting a milestone moves the project to ACTIVE
            // (or back from COMPLETED, since it now has unfinished work)
            syncProjectStatus(selectedProject, [
                ...selectedProjectMilestones,
                response.data,
            ]);

            loadMilestones();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    // Was a stray call at the bottom of handleMilestoneSubmit
    // (milestone was undefined there), and completeMilestone did not exist
    const completeMilestone = async (milestone) => {
        try {
            await updateProjectMilestone(
                milestone.id,
                {
                    completed: true,
                }
            );

            setSelectedProjectMilestones(
                selectedProjectMilestones.map((m) =>
                    m.id === milestone.id
                        ? { ...m, completed: true }
                        : m
                )
            );

            // Completing the last milestone moves the project to COMPLETED
            syncProjectStatus(
                selectedProject,
                selectedProjectMilestones.map((m) =>
                    m.id === milestone.id
                        ? { ...m, completed: true }
                        : m
                )
            );

            loadMilestones();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    // ---------- Filtering & pagination ----------
    const q = search.toLowerCase();
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            (project.name || "").toLowerCase().includes(q) ||
            (project.description || "").toLowerCase().includes(q) ||
            (project.customer_email || "").toLowerCase().includes(q);

        const matchesStatus =
            selectedStatus === "" || project.status === selectedStatus;

        const matchesLocation =
            selectedLocation === "" ||
            (project.location || "")
                .toLowerCase()
                .includes(selectedLocation.toLowerCase());

        return matchesSearch && matchesStatus && matchesLocation;
    });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = filteredProjects.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const totalBudget = projects.reduce(
        (sum, p) => sum + Number(p.budget || 0),
        0
    );

    // ---------- Project handlers ----------
    const handleAdd = () => {
        setEditingProject(null);
        setFormData(EMPTY_PROJECT);
        setShowModal(true);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name || "",
            description: project.description || "",
            manager: project.manager || "",
            location: project.location || "",
            budget: project.budget || "",
            start_date: project.start_date || "",
            expected_end_date: project.expected_end_date || "",
            status: project.status || "PLANNING",
            progress: getProjectProgress(project.id),
        });
        setShowModal(true);
    };

    const handleQuickStatusUpdate = async (project, newStatus) => {
        try {
            let newProgress = project.progress;
            if (newStatus === "PLANNING") newProgress = 0;
            else if (newStatus === "ACTIVE" && project.progress === 0)
                newProgress = 25;
            else if (newStatus === "COMPLETED") newProgress = 100;

            await updateProject(project.id, {
                name: project.name,
                description: project.description,
                manager: project.manager || null,
                location: project.location,
                budget: project.budget,
                start_date: project.start_date,
                expected_end_date: project.expected_end_date,
                status: newStatus,
                progress: newProgress,
            });
            loadProjects();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "status") {
                if (value === "PLANNING" || value === "CANCELLED")
                    updated.progress = 0;
                else if (value === "ACTIVE" && Number(prev.progress) === 0)
                    updated.progress = 25;
                else if (value === "COMPLETED") updated.progress = 100;
            }
            return updated;
        });
    };

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
                expected_end_date: formData.expected_end_date,
                status: formData.status,
                progress: Number(formData.progress),
            };

            if (editingProject) {
                await updateProject(editingProject.id, data);
            } else {
                await createProject(data);
            }

            setShowModal(false);
            setEditingProject(null);
            setCurrentPage(1);
            loadProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            showApiError(error);
        }
    };

    const handleDelete = async (project) => {
        if (!window.confirm(`Are you sure you want to delete "${project.name}"?`))
            return;

        try {
            await deleteProject(project.id);
            setCurrentPage(1);
            loadProjects();
            loadAssignments();
            loadMembers();
            loadExpenses();
            loadMilestones();
        } catch (error) {
            console.error("Error deleting project:", error);
            showApiError(error);
        }
    };

    // ---------- Machine handlers ----------
    const openMachineModal = (project) => {
        setSelectedProject(project);
        setMachineForm(EMPTY_MACHINE);
        setShowMachineModal(true);
    };

    const handleAssignMachine = async (e) => {
        e.preventDefault();
        try {
            await createProjectMachine({
                project: selectedProject.id,
                machine: machineForm.machine,
                quantity: Number(machineForm.quantity),
            });
            setShowMachineModal(false);
            setMachineForm(EMPTY_MACHINE);
            loadAssignments();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    const handleRemoveMachine = async (assignmentId) => {
        if (!window.confirm("Remove this machine assignment?")) return;
        try {
            await deleteProjectMachine(assignmentId);
            loadAssignments();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    // ---------- Member handlers ----------
    const openMemberModal = (project) => {
        setSelectedProject(project);
        setMemberForm(EMPTY_MEMBER);
        setShowMemberModal(true);
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();
        try {
            await createProjectMember({
                project: selectedProject.id,
                full_name: memberForm.full_name,
                phone: memberForm.phone,
                role: memberForm.role,
            });
            setShowMemberModal(false);
            setMemberForm(EMPTY_MEMBER);
            loadMembers();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Remove this team member?")) return;
        try {
            await deleteProjectMember(memberId);
            loadMembers();
        } catch (error) {
            console.error(error);
            showApiError(error);
        }
    };

    // ---------- Render ----------
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
                            <FolderKanban size={24} className="text-[#1495CC]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Projects</p>
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
                        {projects.filter((p) => p.status === "PLANNING").length}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {projects.filter((p) => p.status === "ACTIVE").length}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                        {projects.filter((p) => p.status === "COMPLETED").length}
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
                    <div>
                        <table className="w-full table-fixed">
                            {/* Widths add up to 100%: 22 + 16 + 14 + 14 + 8 + 12 + 14 */}
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className={`${thCls} w-[22%]`}>Project</th>
                                    <th className={`${thCls} w-[16%]`}>Team</th>
                                    <th className={`${thCls} w-[14%]`}>Budget</th>
                                    <th className={`${thCls} w-[14%]`}>Machines</th>
                                    <th className={`${thCls} w-[8%]`}>Milestones</th>
                                    <th className={`${thCls} w-[12%]`}>Status</th>
                                    <th className={`${thCls} w-[14%] !text-right`}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedProjects.map((project) => {
                                    const projectMembers = getAssignedMembers(project.id);
                                    const projectMachines = getAssignedMachines(project.id);

                                    return (
                                        <tr
                                            key={project.id}
                                            className="border-b last:border-b-0 hover:bg-gray-50 align-top"
                                        >
                                            {/* Project + manager, location, budget */}
                                            <td className="px-3 py-3">
                                                <p className="font-medium text-gray-800 truncate">
                                                    {project.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {project.description || "No description provided."}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1 truncate">
                                                    {getManagerName(project)} · {project.location}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    KES {Number(project.budget || 0).toLocaleString()}
                                                </p>
                                            </td>

                                            {/* Team */}
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {projectMembers.map((m) => (
                                                        <span
                                                            key={m.id}
                                                            className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                                                        >
                                                            {m.full_name} - {formatRole(m.role)}
                                                            <button
                                                                onClick={() => handleRemoveMember(m.id)}
                                                                className="hover:text-red-600"
                                                                title="Remove member"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    {projectMembers.length === 0 && (
                                                        <span className="text-xs text-gray-400">No workers</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Budget / Spent / Remaining + Add expense */}
                                            <td className="px-3 py-3">
                                                <div className="text-sm">
                                                    <div>
                                                        Budget:
                                                        KES {Number(project.budget)
                                                            .toLocaleString()}
                                                    </div>

                                                    <div className="text-red-600">
                                                        Spent:
                                                        KES {getProjectExpensesTotal(
                                                            project.id
                                                        ).toLocaleString()}
                                                    </div>

                                                    <div className="text-green-600">
                                                        Remaining:
                                                        KES {getRemainingBudget(
                                                            project
                                                        ).toLocaleString()}
                                                    </div>

                                                    {/* Moved here from the machine chip so it shows once per project */}
                                                    <button
                                                        onClick={() => openExpenseModal(project)}
                                                        className="text-xs text-blue-600 hover:underline mt-1"
                                                    >
                                                        + Add expense
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Machines */}
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {projectMachines.map((a) => (
                                                        <span
                                                            key={a.id}
                                                            className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                                                        >
                                                            {a.machine_name} ×{a.quantity}
                                                            <button
                                                                onClick={() => handleRemoveMachine(a.id)}
                                                                className="hover:text-red-600"
                                                                title="Remove machine"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    {projectMachines.length === 0 && (
                                                        <span className="text-xs text-gray-400">None</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Milestones: completed / total */}
                                            <td className="px-3 py-3 text-sm">
                                                {
                                                    milestones.filter(
                                                        (m) =>
                                                            m.project === project.id &&
                                                            m.completed
                                                    ).length
                                                }
                                                /
                                                {
                                                    milestones.filter(
                                                        (m) =>
                                                            m.project === project.id
                                                    ).length
                                                }
                                            </td>

                                            {/* Status + progress */}
                                            <td className="px-3 py-3">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
                                                        project.status
                                                    )}`}
                                                >
                                                    {project.status.replace("_", " ")}
                                                </span>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                                        style={{ width: `${project.progress || 0}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {project.progress || 0}%
                                                </p>
                                            </td>

                                            {/* Actions (icon-only, wraps if needed) */}
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap items-center justify-end gap-1">
                                                    {project.status === "PLANNING" && (
                                                        <button
                                                            onClick={() => handleQuickStatusUpdate(project, "ACTIVE")}
                                                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                            title="Start Project"
                                                        >
                                                            <Play size={14} />
                                                        </button>
                                                    )}
                                                    {project.status === "ACTIVE" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickStatusUpdate(project, "ON_HOLD")}
                                                                className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                                                title="Put On Hold"
                                                            >
                                                                <PauseCircle size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickStatusUpdate(project, "COMPLETED")}
                                                                className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
                                                                title="Mark Complete"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {project.status === "ON_HOLD" && (
                                                        <button
                                                            onClick={() => handleQuickStatusUpdate(project, "ACTIVE")}
                                                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                                            title="Resume Project"
                                                        >
                                                            <Play size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openMemberModal(project)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                        title="Add Team Member"
                                                    >
                                                        <UserPlus size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openMachineModal(project)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600"
                                                        title="Assign Machine"
                                                    >
                                                        <Wrench size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openMilestones(project)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                        title="Milestones"
                                                    >
                                                        <Flag size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                        title="Full Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                                    <span className="font-medium">
                                        {Math.min(startIndex + itemsPerPage, filteredProjects.length)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">{filteredProjects.length}</span>{" "}
                                    projects
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                                            setCurrentPage((p) => Math.min(p + 1, totalPages))
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

            {/* Milestone List Modal (your milestone list, now inside a modal) */}
            {showMilestoneListModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-1">Milestones</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedProject?.name}
                        </p>

                        {selectedProjectMilestones.length === 0 && (
                            <p className="text-sm text-gray-400">
                                No milestones yet.
                            </p>
                        )}

                        {selectedProjectMilestones.map(
                            (milestone) => (
                                <div
                                    key={milestone.id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {milestone.title}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Due:
                                            {milestone.due_date}
                                        </div>
                                    </div>

                                    {!milestone.completed && (
                                        <button
                                            onClick={() =>
                                                completeMilestone(
                                                    milestone
                                                )
                                            }
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Complete
                                        </button>
                                    )}

                                    {milestone.completed && (
                                        <span className="text-green-600">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            )
                        )}

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => {
                                    setMilestoneForm({
                                        project: selectedProject.id,
                                        title: "",
                                        description: "",
                                        due_date: "",
                                    });

                                    setShowMilestoneModal(true);
                                }}
                                className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
                            >
                                Add Milestone
                            </button>
                            <button
                                onClick={() => setShowMilestoneListModal(false)}
                                className="px-4 py-2 border rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Milestone Modal */}
            {showMilestoneModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add Milestone</h2>

                        <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={milestoneForm.title}
                                onChange={(e) =>
                                    setMilestoneForm({ ...milestoneForm, title: e.target.value })
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <textarea
                                placeholder="Description"
                                value={milestoneForm.description}
                                onChange={(e) =>
                                    setMilestoneForm({ ...milestoneForm, description: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <input
                                type="date"
                                value={milestoneForm.due_date}
                                onChange={(e) =>
                                    setMilestoneForm({ ...milestoneForm, due_date: e.target.value })
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMilestoneModal(false)}
                                    className="px-4 py-2 border rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
                                >
                                    Save Milestone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {showExpenseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add Expense</h2>

                        <form onSubmit={handleExpenseSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={expenseForm.title}
                                onChange={(e) =>
                                    setExpenseForm({ ...expenseForm, title: e.target.value })
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            {/* Match these values to the category choices in your Django model */}
                            <select
                                value={expenseForm.category}
                                onChange={(e) =>
                                    setExpenseForm({ ...expenseForm, category: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            >
                                <option value="MATERIALS">Materials</option>
                                <option value="LABOUR">Labour</option>
                                <option value="TRANSPORT">Transport</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="OTHER">Other</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Amount (KES)"
                                value={expenseForm.amount}
                                onChange={(e) =>
                                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <textarea
                                placeholder="Notes"
                                value={expenseForm.notes}
                                onChange={(e) =>
                                    setExpenseForm({ ...expenseForm, notes: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseModal(false)}
                                    className="px-4 py-2 border rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
                                >
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Project Modal */}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Manager
                                </label>
                                <select
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    className={inputCls}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget (KES)
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    className={inputCls}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expected End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="expected_end_date"
                                        value={formData.expected_end_date}
                                        onChange={handleChange}
                                        required
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status (Auto-sets Progress)
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputCls}
                                >
                                    <option value="PLANNING">Planning (0%)</option>
                                    <option value="ACTIVE">
                                        Active ({formData.progress || 25}%)
                                    </option>
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

            {/* Machine Modal */}
            {showMachineModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-1">Assign Machine</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedProject?.name}
                        </p>

                        <form onSubmit={handleAssignMachine} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Machine</label>
                                <select
                                    value={machineForm.machine}
                                    onChange={(e) =>
                                        setMachineForm({ ...machineForm, machine: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                                    required
                                >
                                    <option value="">Select Machine</option>
                                    {machines.map((machine) => (
                                        <option key={machine.id} value={machine.id}>
                                            {machine.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={machineForm.quantity}
                                    onChange={(e) =>
                                        setMachineForm({ ...machineForm, quantity: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMachineModal(false)}
                                    className="px-4 py-2 border rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Modal */}
            {showMemberModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-1">Add Team Member</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedProject?.name}
                        </p>

                        <form onSubmit={handleAssignMember} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={memberForm.full_name}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, full_name: e.target.value })
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <input
                                type="text"
                                placeholder="Phone"
                                value={memberForm.phone}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, phone: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            />

                            <select
                                value={memberForm.role}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, role: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                            >
                                <option value="FOREMAN">Foreman</option>
                                <option value="WORKER">Worker</option>
                                <option value="ELECTRICIAN">Electrician</option>
                                <option value="PLUMBER">Plumber</option>
                                <option value="CARPENTER">Carpenter</option>
                                <option value="MASON">Mason</option>
                                <option value="PAINTER">Painter</option>
                                <option value="WELDER">Welder</option>
                            </select>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMemberModal(false)}
                                    className="px-4 py-2 border rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#1495CC] text-white rounded-xl"
                                >
                                    Save Member
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