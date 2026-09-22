import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <h1 className="font-bold text-xl">Rojul Tot</h1>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/machines">Machines</Link>
        <Link to="/drawings">Drawings</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;