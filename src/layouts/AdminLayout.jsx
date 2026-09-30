import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Wrench,
    Tags,
    ScrollText,
    FolderKanban,
    Bell,
    BarChart3,
    ClipboardList,
    LogOut, // Added Logout icon
} from "lucide-react";

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear your auth tokens or user data from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Or if you store a generic user object:
        localStorage.removeItem("user");

        // Redirect to login page
        navigate("/"); // Adjust this path if your login route is different
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">

            {/* Sidebar */}
            <aside className="w-72 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1495CC] mb-8">
                        RojulTot Admin
                    </h1>

                    <nav className="space-y-3">
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Link>

                        <Link
                            to="/admin/users"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Users size={20} />
                            Users
                        </Link>

                        <Link
                            to="/admin/machines"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Wrench size={20} />
                            Machines
                        </Link>

                        <Link
                            to="/admin/categories"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Tags size={20} />
                            Categories
                        </Link>
                        
                        <Link
                            to="/admin/rentals"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <ClipboardList size={20} />
                            Rental Management
                        </Link>

                        <Link
                            to="/admin/drawings"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <ScrollText size={20} />
                            Drawings
                        </Link>

                        <Link
                            to="/admin/drawing-categories"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Tags size={20} />
                            Drawing Categories
                        </Link>

                        <Link
                            to="/admin/projects"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <FolderKanban size={20} />
                            Projects
                        </Link>

                        <Link
                            to="/admin/project-members"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Users size={20} />
                            Project Members
                        </Link>

                        <Link
                            to="/admin/notifications"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <Bell size={20} />
                            Notifications
                        </Link>

                        <Link
                            to="/admin/analytics"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-[#1495CC] transition-colors"
                        >
                            <BarChart3 size={20} />
                            Analytics
                        </Link>
                    </nav>
                </div>

                {/* Logout Button Section */}
                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;