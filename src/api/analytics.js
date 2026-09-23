import api from "./axios";

export const getAdminDashboard = () =>
  api.get("/analytics/admin-dashboard/");

export const getUserStatistics = () =>
  api.get("/analytics/users/");

export const getProjectStatistics = () =>
  api.get("/analytics/projects/");

export const getRentalOrderStatistics = () =>
  api.get("/analytics/rental-orders/");