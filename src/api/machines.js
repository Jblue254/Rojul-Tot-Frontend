import api from "./axios";

export const getMachines = () =>
  api.get("/machinery/machines/");

export const createMachine = (data) =>
  api.post(
    "/machinery/machines/",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

export const updateMachine = (id, data) =>
  api.patch(`/machinery/machines/${id}/`, data);

export const deleteMachine = (id) =>
  api.delete(`/machinery/machines/${id}/`);

export const getCategories = () =>
  api.get("/machinery/categories/");