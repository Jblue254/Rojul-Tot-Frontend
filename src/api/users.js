import api from "./axios";

export const getUsers = () => {
  return api.get("/auth/users/");
};