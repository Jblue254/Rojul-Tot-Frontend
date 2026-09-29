import api from "./axios";

export const getProjectMachines = () =>
  api.get("/projects/machines/");

export const createProjectMachine = (data) =>
  api.post("/projects/machines/", data);

export const updateProjectMachine = (id, data) =>
  api.patch(`/projects/machines/${id}/`, data);

export const deleteProjectMachine = (id) =>
  api.delete(`/projects/machines/${id}/`);