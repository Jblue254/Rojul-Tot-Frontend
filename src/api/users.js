import api from "./axios";

export const getUsers = () => {
  return api.get("/auth/users/");
};

export const getUser = (id) => {
  return api.get(`/auth/users/${id}/`);
};

export const createUser = (data) => {
  return api.post("/auth/users/", data);
};

export const updateUser = (id, data) => {
  return api.patch(`/auth/users/${id}/`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/auth/users/${id}/`);
};