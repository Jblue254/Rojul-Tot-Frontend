import api from "./axios";

export const getProjectCosts = () =>
  api.get("/projects/expenses/");

export const createProjectCost = (data) =>
  api.post("/projects/expenses/", data);

export const updateProjectCost = (id, data) =>
  api.patch(`/projects/expenses/${id}/`, data);

export const deleteProjectCost = (id) =>
  api.delete(`/projects/expenses/${id}/`);