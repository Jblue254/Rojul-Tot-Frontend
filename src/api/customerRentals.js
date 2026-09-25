import api from "./axios";

export const getMachines = (params = {}) =>
  api.get("/machinery/machines/", {params,});

export const getRentals = () =>
  api.get("/rentals/");

export const createRental = (data) =>
  api.post("/rentals/", data);

export const updateRental = (id, data) =>
  api.put(`/rentals/${id}/`, data);

export const deleteRental = (id) =>
  api.delete(`/rentals/${id}/`);