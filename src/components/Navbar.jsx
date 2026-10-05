import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    Home,
    Wrench,
    ScrollText,
    FolderKanban,
    Phone,
    Menu,
    X,
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/machines", label: "Machines", icon: Wrench },
    { to: "/drawings", label: "Drawings", icon: ScrollText },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/contact", label: "Contact", icon: Phone },
];

const desktopLink = ({ isActive }) =>
    [
        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/40",
        isActive
            ? "bg-blue-50 text-[#1495CC]"
            : "text-gray-700 hover:bg-blue-50 hover:text-[#1495CC]",
    ].join(" ");

const mobileLink = ({ isActive }) =>
    [
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        isActive
            ? "bg-blue-50 text-[#1495CC] font-medium"
            : "text-gray-700 hover:bg-blue-50 hover:text-[#1495CC]",
    ].join(" ");

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-extrabold text-[#1495CC]"
                        onClick={closeMenu}
                    >
                        Rojul Tot
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
                        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink key={to} to={to} end={end} className={desktopLink}>
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-[#1495CC] font-medium hover:text-[#0E7AA8] transition-colors"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="bg-[#1495CC] text-white px-5 py-2 rounded-full font-medium hover:bg-[#0E7AA8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1495CC] transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-6 flex flex-col gap-2">
                        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={mobileLink}
                                onClick={closeMenu}
                            >
                                <Icon size={20} />
                                {label}
                            </NavLink>
                        ))}

                        <hr className="my-2 border-gray-100" />

                        <Link
                            to="/login"
                            onClick={closeMenu}
                            className="p-3 rounded-xl text-[#1495CC] font-medium hover:bg-blue-50 transition-colors"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            onClick={closeMenu}
                            className="bg-[#1495CC] text-white px-4 py-3 rounded-xl font-medium text-center hover:bg-[#0E7AA8] transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;