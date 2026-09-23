import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MachinesManagement from "./pages/MachinesManagement";
import MachinesRentals from "./pages/MachinesRentals";
import DrawingsManagement from "./pages/DrawingsManagement";
import DrawingsOrders from "./pages/DrawingsOrders";
import Projects from "./pages/Projects";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/machines" element={<MachinesManagement />} />
        <Route path="/rentals" element={<MachinesRentals />} />

        <Route path="/drawings" element={<DrawingsManagement />} />
        <Route path="/orders" element={<DrawingsOrders />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
        path="/dashboard"
        element={
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