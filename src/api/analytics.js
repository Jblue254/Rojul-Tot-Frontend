import api from "./axios";

export const getDashboardStatistics = () =>
  api.get("/analytics/dashboard/");

export const getRentalOrderStatistics = () =>
  api.get("/analytics/rental-orders/");

export const getProjectStatistics = () =>
  api.get("/analytics/projects/");

export const getUserStatistics = () =>
  api.get("/analytics/users/");

export const getAdminDashboard = () =>
  api.get("/analytics/admin-dashboard/");