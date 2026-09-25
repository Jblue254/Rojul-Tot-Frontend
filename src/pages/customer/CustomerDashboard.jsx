
import { Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
    <div>
        <h1 className="text-3xl font-bold">
      Customer Dashboard
    </h1>
      {/* Sidebar */}
      {/* Navbar */}

      <Outlet />
    </div>
  );
}

export default CustomerLayout;