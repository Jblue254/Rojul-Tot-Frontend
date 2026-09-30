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
import ProjectMembersManagement from "./pages/admin/ProjectMembersManagement";

// Customer
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProjects from "./pages/customer/Projects";
import CustomerRentals from "./pages/customer/Rentals";
import CustomerDrawings from "./pages/customer/Drawings";
import CustomerNotifications from "./pages/customer/Notifications";
import CustomerProfile from "./pages/customer/Profile";

// Manager
import ManagerLayout from "./layouts/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// Equipment
import EquipmentLayout from "./layouts/EquipmentLayout";

import EquipmentDashboard from "./pages/equipment/EquipmentDashboard";
import ProjectAssignments from "./pages/equipment/ProjectAssignments";
import MaintenanceManagement from "./pages/equipment/MaintenanceManagement";
import EquipmentNotifications from "./pages/equipment/EquipmentNotifications";
import Profil

//Architectural
import ArchitecturalManagerLayout from "./layouts/ArchitecturalManagerLayout";
import ArchitecturalDashboard from "./pages/Architectural/ArchitecturalDashboard";


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
          <Route path="rentals" element={<ManagementsRentals />} />
          <Route path="project-members" element={<ProjectMembersManagement />} />

          <Route
            path="notifications"
            element={<NotificationsManagement />}
          />
        </Route>

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="project-members" element={<ProjectMembersManagement />} />
          <Route path="milestones" element={<ProjectMilestonesManagement />} />
          <Route path="expenses" element={<ProjectExpensesManagement />} />
          <Route path="project-machines" element={<ProjectMachinesManagement />} />

        </Route>

        {/* Equipment */}

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<EquipmentDashboard />}
          />

          <Route
            path="machines"
            element={<MachinesManagement />}
          />

          <Route
            path="rentals"
            element={<ManagementsRentals />}
          />

          <Route
            path="assignments"
            element={<ProjectAssignments />}
          />

          <Route
            path="maintenance"
            element={<MaintenanceManagement />}
          />

          <Route
            path="notifications"
            element={<EquipmentNotifications />}
          />

          <Route
            path="profile"
            element={<EquipmentProfile />}
          />
        </Route>
        {/* Architectural */}


        <Route
          path="/architectural"
          element={<ArchitecturalManagerLayout />}
        >
          <Route
            path="dashboard"
            element={<ArchitecturalDashboard />}
          />

          <Route
            path="drawings"
            element={<DrawingsManagement />}
          />

          <Route
            path="categories"
            element={<DrawingCategoriesManagement />}
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