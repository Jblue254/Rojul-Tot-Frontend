import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MachinesRentals from "./pages/MachinesRentals";
import DrawingsOrders from "./pages/DrawingsOrders";
import Projects from "./pages/Projects";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";


//admin ruutes
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import UsersPage from "./pages/admin/UsersPage.jsx";
import CategoriesManagement from "./pages/admin/CategoriesManagement.jsx";
import DrawingsManagement from "./pages/admin/DrawingsManagement";
import DrawingCategoriesManagement from "./pages/admin/DrawingCategoriesManagement.jsx";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import AnalyticsManagement from "./pages/admin/AnalyticsManagement";
import NotificationsManagement from "./pages/admin/NotificationsManagement.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MachinesManagement from "./pages/admin/MachinesManagement";

//Customer routes
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rentals" element={<MachinesRentals />} />
        <Route path="/drawings" element={<DrawingsManagement />} />
        <Route path="/orders" element={<DrawingsOrders />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="machines" element={<MachinesManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="drawings" element={<DrawingsManagement />} />
          <Route path="drawing-categories" element={<DrawingCategoriesManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="analytics" element={<AnalyticsManagement />} />
          <Route path="notifications" element={<NotificationsManagement />} />
        </Route>

        <Route path="/customer" element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>} >
          <Route index element={<CustomerDashboard />} />
          <Route path="projects" element={<CustomerProjects />} />
          <Route path="rentals" element={<CustomerRentals />} />
          <Route path="drawings" element={<CustomerDrawings />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />


      </Routes>
    </BrowserRouter>

  );
}

export default App;