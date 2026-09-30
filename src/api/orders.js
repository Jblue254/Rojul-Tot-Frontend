import api from "./axios";

/* =========================
   ORDERS
========================= */

export const getOrders = (params = {}) =>
  api.get("/orders/", { params });

export const getOrder = (id) =>
  api.get(`/orders/${id}/`);

export const createOrder = (data) =>
  api.post("/orders/", data);

export const updateOrder = (id, data) =>
  api.patch(`/orders/${id}/`, data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}/`);

/* =========================
   CART
========================= */

export const getCart = () =>
  api.get("/orders/cart/");

export const addToCart = (data) =>
  api.post("/orders/cart/items/", data);

export const updateCartItem = (
  id,
  data
) =>
  api.patch(
    `/orders/cart/items/${id}/`,
    data
  );

export const deleteCartItem = (id) =>
  api.delete(
    `/orders/cart/items/${id}/`
  );

export const checkoutCart = () =>
  api.post("/orders/cart/checkout/");

/* =========================
   ARCHITECTURAL MANAGER
========================= */

export const getArchitectOrders = (
  params = {}
) =>
  api.get("/orders/", {
    params,
  });

/* =========================
   STATUS FILTER HELPERS
========================= */

export const getPendingOrders = () =>
  api.get("/orders/", {
    params: {
      status: "PENDING",
    },
  });

export const getPaidOrders = () =>
  api.get("/orders/", {
    params: {
      status: "PAID",
    },
  });

export const getProcessingOrders =
  () =>
    api.get("/orders/", {
      params: {
        status: "PROCESSING",
      },
    });

export const getCompletedOrders =
  () =>
    api.get("/orders/", {
      params: {
        status: "COMPLETED",
      },
    });

export const getCancelledOrders =
  () =>
    api.get("/orders/", {
      params: {
        status: "CANCELLED",
      },
    });