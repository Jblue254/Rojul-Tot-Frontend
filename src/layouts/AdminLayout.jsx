import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Wrench,
    Settings,
    Tags,
    Layers,
    ScrollText,
    FolderKanban,
    HardHat,
    Bell,
    BarChart3,
    ClipboardList,
    LogOut,
    Mail,
    Menu,
    X,
    Star,
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/machines", label: "Machines", icon: Wrench },
    { to: "/admin/maintenance", label: "Maintenance", icon: Settings },
    { to: "/admin/categories", label: "Categories", icon: Tags },
    { to: "/admin/rentals", label: "Rental Management", icon: ClipboardList },
    { to: "/admin/drawings", label: "Drawings", icon: ScrollText },
    { to: "/admin/drawing-categories", label: "Drawing Categories", icon: Layers },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
    { to: "/admin/project-members", label: "Project Members", icon: HardHat },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/contacts", label: "Contacts", icon: Mail },
];

const linkClasses = ({ isActive }) =>
    [
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40",
        isActive
            ? "bg-blue-50 text-[#1495CC] font-medium"
            : "text-gray-700 hover:bg-blue-50 hover:text-[#1495CC]",
    ].join(" ");

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close the mobile drawer whenever the route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // While the drawer is open: close on Escape and stop the page behind it scrolling
    useEffect(() => {
        if (!sidebarOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [sidebarOpen]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // replace: true stops the Back button from returning to a protected page
        navigate("/", { replace: true });
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
            {/* Mobile top bar */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white shadow-sm px-4 py-3">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#1495CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40"
                    aria-label="Open menu"
                    aria-expanded={sidebarOpen}
                    aria-controls="admin-sidebar"
                >
                    <Menu size={22} />
                </button>
                <span className="text-lg font-bold text-[#1495CC]">
                    RojulTot Admin
                </span>
            </header>

            {/* Backdrop (mobile only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar: slide-over drawer on small screens, fixed column from lg up */}
            <aside
                id="admin-sidebar"
                className={[
                    "fixed inset-y-0 left-0 z-50 h-screen w-72 shrink-0 overflow-y-auto",
                    "bg-white shadow-lg p-6 flex flex-col justify-between",
                    "transform transition-transform duration-200 motion-reduce:transition-none",
                    "lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-[#1495CC]">
                            RojulTot Admin
                        </h1>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="space-y-3" aria-label="Main navigation">
                        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink key={to} to={to} end={end} className={linkClasses}>
                                <Icon size={20} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Logout Button Section */}
                <div className="pt-4 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;