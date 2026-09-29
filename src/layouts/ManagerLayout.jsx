import { Outlet, NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Flag,
    DollarSign,
    Wrench,
    Bell,
    User,
} from "lucide-react";

function ManagerLayout() {

    const links = [
        {
            name: "Dashboard",
            path: "/manager/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Projects",
            path: "/manager/projects",
            icon: FolderKanban,
        },
        {
            name: "Project Members",
            path: "/manager/project-members",
            icon: Users,
        },
        {
            name: "Milestones",
            path: "/manager/milestones",
            icon: Flag,
        },
        {
            name: "Project Expenses",
            path: "/manager/expenses",
            icon: DollarSign,
        },
        {
            name: "Project Machines",
            path: "/manager/project-machines",
            icon: Wrench,
        },
        {
            name: "Notifications",
            path: "/manager/notifications",
            icon: Bell,
        },
        {
            name: "Profile",
            path: "/manager/profile",
            icon: User,
        },
    ];

    return (
        <div className="min-h-screen flex bg-gray-100">

            <aside className="w-64 bg-white shadow-lg">

                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">
                        Manager Panel
                    </h1>
                </div>

                <nav className="p-4 space-y-2">

                    {links.map((link) => {

                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                        isActive
                                            ? "bg-blue-100 text-blue-700"
                                            : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Icon size={18} />

                                <span>
                                    {link.name}
                                </span>
                            </NavLink>
                        );
                    })}

                </nav>

            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>

        </div>
    );
}

export default ManagerLayout;