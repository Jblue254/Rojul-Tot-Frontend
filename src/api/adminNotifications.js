import api from "./axios";

export const getAllNotifications = () =>
  api.get("/notifications/all/");

export const createNotification = (data) =>
  api.post("/notifications/create/", data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}/`);