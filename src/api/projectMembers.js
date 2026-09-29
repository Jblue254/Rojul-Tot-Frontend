import api from "./axios";

export const getProjectMembers = () =>
    api.get("/projects/members/");

export const createProjectMember = (data) =>
    api.post("/projects/members/", data);

export const updateProjectMember = (id, data) =>
    api.patch(`/projects/members/${id}/`, data);

export const deleteProjectMember = (id) =>
    api.delete(`/projects/members/${id}/`);