import api from "./axios";

export const getDrawings = (params = {}) =>
  api.get("/drawings/", { params });

export const getOrders = () =>
  api.get("/orders/");

export const getCart = () =>
  api.get("/orders/cart/");

export const addToCart = (data) =>
  api.post("/orders/cart/items/", data);

export const updateCartItem = (id, data) =>
  api.put(`/orders/cart/items/${id}/`, data);

export const deleteCartItem = (id) =>
  api.delete(`/orders/cart/items/${id}/`);

export const checkoutCart = () =>
  api.post("/orders/cart/checkout/");