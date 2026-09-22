import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Wrench,
  ScrollText,
  FolderKanban,
  Phone,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-[#1495CC]"
          >
            Rojul Tot
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:text-[#1495CC]">
              <Home size={18} />
              Home
            </Link>

            <Link to="/machines" className="flex items-center gap-2 hover:text-[#1495CC]">
              <Wrench size={18} />
              Machines
            </Link>

            <Link to="/drawings" className="flex items-center gap-2 hover:text-[#1495CC]">
              <ScrollText size={18} />
              Drawings
            </Link>

            <Link to="/projects" className="flex items-center gap-2 hover:text-[#1495CC]">
              <FolderKanban size={18} />
              Projects
            </Link>

            <Link to="/contact" className="flex items-center gap-2 hover:text-[#1495CC]">
              <Phone size={18} />
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-[#1495CC] font-medium"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#1495CC] text-white px-5 py-2 rounded-full hover:bg-[#1185B5] transition"
            >
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-4">
            <Link to="/">Home</Link>
            <Link to="/machines">Machines</Link>
            <Link to="/drawings">Drawings</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>

            <hr />

            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="bg-[#1495CC] text-white px-4 py-2 rounded-lg text-center"
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