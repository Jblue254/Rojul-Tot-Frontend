import api from "./axios";

// Machinery and drawing reviews
export const getReviews = () =>
  api.get("/reviews/");

export const createReview = (data) =>
  api.post("/reviews/", data);

export const updateReview = (id, data) =>
  api.patch(`/reviews/${id}/`, data);

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}/`);

// Project reviews
// Replace this path if projects/urls.py uses a different route.
export const getProjectReviews = () =>
  api.get("/projects/reviews/");