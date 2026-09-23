import api from "./axios";

export const getUsers = () => {
  return api.get("/auth/users/");
};

export const deleteUser = (id) => {
  return api.delete(`/auth/users/${id}/`);
};

export const updateUser = (id, data) => {
  return api.patch(`/auth/users/${id}/`, data);
};