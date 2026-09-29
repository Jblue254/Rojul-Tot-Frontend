import api from "./axios";

export const getReviews = () =>
    api.get("/reviews/");

export const createReview = (data) =>
    api.post("/reviews/", data);

export const updateReview = (id, data) =>
    api.patch(`/reviews/${id}/`, data);

export const deleteReview = (id) =>
    api.delete(`/reviews/${id}/`);