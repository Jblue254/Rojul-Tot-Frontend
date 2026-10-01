import api from "./axios";

export const getProjects = (params = {}) =>
  api.get("/projects/", { params });

export const createProject = (data) =>
  api.post("/projects/", data);

export const updateProject = (id, data) =>
  api.patch(`/projects/${id}/`, data);

export const deleteProject = (id) =>
  api.delete(`/projects/${id}/`);
export const getPublicProjects = () =>
  api.get("/projects/public/");

export const getFeaturedProjects = () =>
  api.get("/projects/featured/");

