
import api from "./axios";

// Drawings
export const getDrawings = (params = {}) =>
  api.get("/drawings/", { params });

export const getDrawingCategories = () =>
  api.get("/drawings/categories/");

// Cart
export const getCart = () =>
  api.get("/orders/cart/");

export const addToCart = (data) =>
  api.post("/orders/cart/items/", data);

export const deleteCartItem = (id) =>
  api.delete(`/orders/cart/items/${id}/`);

export const checkoutCart = () =>
  api.post("/orders/cart/checkout/");

// Orders
export const getOrders = () =>
  api.get("/orders/");

// Download an ordered architectural drawing
export const downloadDrawing = async (itemId) => {
  const response = await api.get(
    `/orders/drawings/${itemId}/download/`,
    { responseType: "blob" }
  );

  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = `architectural-drawing-${itemId}`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Delay revocation to allow the browser to start the download.
  window.setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
};
