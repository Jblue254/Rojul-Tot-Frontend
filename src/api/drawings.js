import api from "./axios";

// Public drawings
export const getPublicDrawings = () =>
  api.get("/drawings/public/");

export const getDrawing = (id) =>
  api.get(`/drawings/public/${id}/`);

// Protected drawings
export const getDrawings = (params = {}) =>
  api.get("/drawings/", { params });

export const createDrawing = (data) =>
  api.post("/drawings/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateDrawing = (id, data) =>
  api.patch(`/drawings/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteDrawing = (id) =>
  api.delete(`/drawings/${id}/`);

// Categories
export const getDrawingCategories = () =>
  api.get("/drawings/categories/");

export const createDrawingCategory = (data) =>
  api.post("/drawings/categories/", data);

export const updateDrawingCategory = (id, data) =>
  api.patch(`/drawings/categories/${id}/`, data);

export const deleteDrawingCategory = (id) =>
  api.delete(`/drawings/categories/${id}/`);