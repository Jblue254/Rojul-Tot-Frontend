import api from "./axios";

export const getMaintenanceRecords = () =>
  api.get("/machinery/maintenance/");

export const createMaintenanceRecord = (data) =>
  api.post("/machinery/maintenance/", data);

export const updateMaintenanceRecord = (id, data) =>
  api.patch(`/machinery/maintenance/${id}/`, data);

export const deleteMaintenanceRecord = (id) =>
  api.delete(`/machinery/maintenance/${id}/`);

export const getProfile = () =>
  api.get("/accounts/profile/");

export const updateProfile = (data) =>
  api.patch("/accounts/profile/", data);