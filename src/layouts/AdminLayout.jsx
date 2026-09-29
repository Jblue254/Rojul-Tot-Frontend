import { Link, Outlet } from "react-router-dom";
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
} from "lucide-react";

function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">

            {/* Sidebar */}
            <aside className="w-72 bg-white shadow-lg p-6">
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
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;