import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function ArchitecturalManagerLayout() {
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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">
          Architectural Manager
        </h2>

        <nav className="space-y-2">
          <NavLink to="/architectural/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </NavLink>

          <NavLink to="/architectural/drawings" className="block p-2 rounded hover:bg-gray-700">
            Drawings
          </NavLink>

          <NavLink to="/architectural/categories" className="block p-2 rounded hover:bg-gray-700">
            Categories
          </NavLink>

          <NavLink to="/architectural/orders" className="block p-2 rounded hover:bg-gray-700">
            Orders
          </NavLink>

          <NavLink to="/architectural/reviews" className="block p-2 rounded hover:bg-gray-700">
            Reviews
          </NavLink>

          <NavLink to="/architectural/notifications" className="block p-2 rounded hover:bg-gray-700">
            Notifications
          </NavLink>

          <NavLink to="/architectural/profile" className="block p-2 rounded hover:bg-gray-700">
            Profile
          </NavLink>
        </nav>
      </aside>
       <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}