import api from "./axios";

export const getMaintenanceRecords = () =>
  api.get("/machinery/maintenances/");

export const createMaintenanceRecord = (data) =>
  api.post("/machinery/maintenances/", data);

export const updateMaintenanceRecord = (id, data) =>
  api.patch(`/machinery/maintenances/${id}/`, data);

export const deleteMaintenanceRecord = (id) =>
  api.delete(`/machinery/maintenances/${id}/`);

export const getProfile = () =>
  api.get("/accounts/profile/");

export const updateProfile = (data) =>
  api.patch("/accounts/profile/", data);