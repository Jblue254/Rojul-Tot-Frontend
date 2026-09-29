import api from "./axios";

export const getProjectExpenses = () =>
    api.get("/projects/expenses/");

export const createProjectExpense = (data) =>
    api.post("/projects/expenses/", data);

export const updateProjectExpense = (id, data) =>
    api.patch(`/projects/expenses/${id}/`, data);

export const deleteProjectExpense = (id) =>
    api.delete(`/projects/expenses/${id}/`);