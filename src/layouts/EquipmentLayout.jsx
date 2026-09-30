import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Wrench,
    ClipboardList,
    Settings,
    LogOut,
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/equipment", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/equipment/machines", label: "Machines", icon: Wrench },
    { to: "/equipment/rentals", label: "Rentals", icon: ClipboardList },
    { to: "/equipment/maintenance", label: "Maintenance", icon: Settings },
];

const linkClasses = ({ isActive }) =>
    [
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40",
        isActive
            ? "bg-blue-50 text-[#1495CC] font-medium"
            : "text-gray-700 hover:bg-blue-50 hover:text-[#1495CC]",
    ].join(" ");

function EquipmentLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // replace: true stops the Back button from returning to a protected page
        navigate("/", { replace: true });
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="sticky top-0 h-screen w-72 shrink-0 overflow-y-auto bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1495CC] mb-8">
                        Equipment Manager
                    </h1>

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
            <main className="flex-1 min-w-0 p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default EquipmentLayout;