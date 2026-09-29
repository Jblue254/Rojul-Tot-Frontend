import api from "./axios";

export const getProjectMilestones = () =>
    api.get("/projects/milestones/");

export const createProjectMilestone = (data) =>
    api.post("/projects/milestones/", data);

export const updateProjectMilestone = (id, data) =>
    api.patch(`/projects/milestones/${id}/`, data);

export const deleteProjectMilestone = (id) =>
    api.delete(`/projects/milestones/${id}/`);