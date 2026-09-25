import api from "./axios";

export const getMachines = (params = {}) =>
  api.get("/machinery/machines/", {
    params,
  });

export const getRentals = () =>
  api.get("/rentals/");

export const createRental = (data) =>
  api.post("/rentals/", data);