// src/api/customerDrawings.js

import api from "./axios";

export const getDrawings = (params = {}) =>
  api.get("/drawings/", { params });

export const getDrawingCategories = () =>
  api.get("/drawings/categories/");

export const getCart = () =>
  api.get("/orders/cart/");

export const addToCart = (data) =>
  api.post("/orders/cart/items/", data);

export const deleteCartItem = (id) =>
  api.delete(`/orders/cart/items/${id}/`);

export const checkoutCart = () =>
  api.post("/orders/cart/checkout/");

export const getOrders = () =>
  api.get("/orders/");
