import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

//Public
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MachinesPage from "./pages/public/MachinesPage";
import DrawingsPage from "./pages/public/DrawingsPage";
import ProjectsPage from "./pages/public/ProjectsPage";
import ProjectDetailPage from "./pages/public/ProjectDetailPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Shared
import NotificationsManagement from "./pages/admin/NotificationsManagement";

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
import ManagementsRentals from "./pages/admin/ManagementsRentals";
import ProjectMembersManagement from "./pages/admin/ProjectMembersManagement";

// Customer
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProjects from "./pages/customer/Projects";
import CustomerRentals from "./pages/customer/Rentals";
import CustomerDrawings from "./pages/customer/Drawings";
import CustomerProfile from "./pages/customer/Profile";
import Notifications from "./pages/customer/Notifications";

// Manager
import ManagerLayout from "./layouts/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ProjectMachinesManagement from "./pages/manager/ProjectMachinesManagement";
import ProjectCostsManagement from "./pages/manager/ProjectCostsManagement";
import ProjectMilestonesManagement from "./pages/manager/ProjectMilestonesManagement";
import ManagerReviews from "./pages/manager/ManagerReviews";
import ManagerReports from "./pages/manager/ManagerReports";
import ManagerProfile from "./pages/manager/ManagerProfile";

// Equipment
import EquipmentLayout from "./layouts/EquipmentLayout";
import EquipmentDashboard from "./pages/equipment/EquipmentDashboard";
import ProjectAssignments from "./pages/equipment/ProjectAssignments";
import MaintenanceManagement from "./pages/equipment/MaintenanceManagement";
import EquipmentProfile from "./pages/equipment/EquipmentProfile";

// Architectural
import ArchitecturalManagerLayout from "./layouts/ArchitecturalManagerLayout";
import ArchitecturalDashboard from "./pages/Architectural/ArchitecturalDashboard";
import ArchitectOrders from "./pages/Architectural/ArchitectOrders";
import ArchitectReviews from "./pages/Architectural/ArchitectReviews";
import ArchitectProfile from "./pages/Architectural/ArchitectProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC
        ========================= */}

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/machines" element={<MachinesPage />}/>
        <Route path="/drawings" element={<DrawingsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />

        {/* =========================
            ADMIN
        ========================= */}

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
          <Route path="project-members" element={<ProjectMembersManagement />}/>
          <Route path="rentals" element={<ManagementsRentals />} />
          <Route path="analytics" element={<AnalyticsManagement />} />
          <Route path="notifications" element={<NotificationsManagement />} />
        </Route>

        {/* =========================
            MANAGER
        ========================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="members" element={<ProjectMembersManagement />} />
          <Route path="machines" element={<ProjectMachinesManagement />} />
          <Route path="costs" element={<ProjectCostsManagement />} />
          <Route path="milestones" element={<ProjectMilestonesManagement />} />
          <Route path="reviews" element={<ManagerReviews />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="notifications" element={<NotificationsManagement />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>

        {/* =========================
            EQUIPMENT
        ========================= */}

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EquipmentDashboard />} />
          <Route path="machines" element={<MachinesManagement />} />
          <Route path="rentals" element={<ManagementsRentals />} />
          <Route path="assignments" element={<ProjectAssignments />} />
          <Route path="maintenance" element={<MaintenanceManagement />} />
          <Route path="notifications" element={<NotificationsManagement />} />
          <Route path="profile" element={<EquipmentProfile />} />
        </Route>

        {/* =========================
            ARCHITECTURAL
        ========================= */}

        <Route
          path="/architectural"
          element={
            <ProtectedRoute>
              <ArchitecturalManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ArchitecturalDashboard />} />
          <Route path="drawings" element={<DrawingsManagement />} />
          <Route path="categories" element={<DrawingCategoriesManagement />} />
          <Route path="orders" element={<ArchitectOrders />} />
          <Route path="reviews" element={<ArchitectReviews />} />
          <Route path="notifications" element={<NotificationsManagement />} />
          <Route path="profile" element={<ArchitectProfile />} />
        </Route>

        {/* =========================
            CUSTOMER
        ========================= */}

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
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;