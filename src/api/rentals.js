import api from "./axios";

export const getRentals = (params) =>
  api.get("/rentals/", { params });

export const approveRental = (id) =>
  api.patch(`/rentals/${id}/approve/`);

export const rejectRental = (id) =>
  api.patch(`/rentals/${id}/reject/`);

export const completeRental = (id) =>
  api.patch(`/rentals/${id}/complete/`);

export const activateRental = (id) =>
  api.patch(`/rentals/${id}/activate/`);