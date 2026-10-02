import api from "./axios";

// Public contact form
export const submitContactMessage = (data) =>
  api.post("/contacts/submit/", data);

// Admin/Manager
export const getContactMessages = () =>
  api.get("/contacts/");

export const getContactMessage = (id) =>
  api.get(`/contacts/${id}/`);

export const updateContactMessage = (id, data) =>
  api.patch(`/contacts/${id}/`, data);

export const deleteContactMessage = (id) =>
  api.delete(`/contacts/${id}/`);