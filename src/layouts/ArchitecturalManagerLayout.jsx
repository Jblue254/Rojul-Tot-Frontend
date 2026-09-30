import { Outlet, NavLink } from "react-router-dom";

export default function ArchitecturalManagerLayout() {
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

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}