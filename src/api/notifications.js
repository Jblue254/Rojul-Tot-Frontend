import api from "./axios";

export const getNotifications = () =>
  api.get("/notifications/");

export const createNotification = (data) =>
  api.post("/notifications/create/", data);

export const updateNotification = (id, data) =>
  api.patch(`/notifications/${id}/`, data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}/`);