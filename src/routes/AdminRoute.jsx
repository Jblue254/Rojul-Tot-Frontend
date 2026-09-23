// src/routes/AdminRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;