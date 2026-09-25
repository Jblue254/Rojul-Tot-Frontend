import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import MachinesManagement from "./pages/admin/MachinesManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import DrawingsManagement from "./pages/admin/DrawingsManagement";
import DrawingCategoriesManagement from "./pages/admin/DrawingCategoriesManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import AnalyticsManagement from "./pages/admin/AnalyticsManagement";
import NotificationsManagement from "./pages/admin/NotificationsManagement";
import ManagementsRentals from "./pages/admin/ManagementsRentals";

// Customer
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProjects from "./pages/customer/Projects";
import CustomerRentals from "./pages/customer/Rentals";
import CustomerDrawings from "./pages/customer/Drawings";
import CustomerNotifications from "./pages/customer/Notifications";
import CustomerProfile from "./pages/customer/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="machines" element={<MachinesManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="drawings" element={<DrawingsManagement />} />
          <Route path="drawing-categories" element={<DrawingCategoriesManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="analytics" element={<AnalyticsManagement />} />
          <Route path="/admin/rentals" element={<ManagementsRentals />} />
          <Route
            path="notifications"
            element={<NotificationsManagement />}
          />
        </Route>

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="projects" element={<CustomerProjects />} />
          <Route path="rentals" element={<CustomerRentals />} />
          <Route path="drawings" element={<CustomerDrawings />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;