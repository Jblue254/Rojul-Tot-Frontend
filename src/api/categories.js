import api from "./axios";

export const getCategories = () =>
  api.get("/machinery/categories/");

export const createCategory = (data) =>
  api.post("/machinery/categories/", data);

export const updateCategory = (id, data) =>
  api.patch(`/machinery/categories/${id}/`, data);

export const deleteCategory = (id) =>
  api.delete(`/machinery/categories/${id}/`);