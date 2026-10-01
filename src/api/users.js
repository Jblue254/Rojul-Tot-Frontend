import api from "./axios";

export const getUsers = () => {
  return api.get("/accounts/users/");
};

export const getUser = (id) => {
  return api.get(`/accounts/users/${id}/`);
};

export const createUser = (data) => {
  return api.post("/accounts/users/", data);
};

export const updateUser = (id, data) => {
  return api.patch(`/accounts/users/${id}/`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/accounts/users/${id}/`);
};