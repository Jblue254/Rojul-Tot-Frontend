import { Link } from "react-router-dom";
import {Home,Wrench,ScrollText,FolderKanban,Phone,Menu,X} from "lucide-react";

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <h1 className="font-bold text-xl">Rojul Tot</h1>

      <div className="flex gap-4">
        <Link
        to="/"
        className="flex items-center gap-2 hover:text-[#1495CC]"
      >
        <Home size={18} />
        Home
      </Link>
        <Link
          to="/machines"
          className="flex items-center gap-2 hover:text-[#1495CC]"
        >
          <Wrench size={18} />
          Machines
        </Link>
        <Link
          to="/drawings"
          className="flex items-center gap-2 hover:text-[#1495CC]"
        >
          <ScrollText size={18} />
          Drawings
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 hover:text-[#1495CC]"
        >
          <Phone size={18} />
          Login
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 hover:text-[#1495CC]"
        >
          <FolderKanban size={18} />
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;