
import api from "./axios";

export const initiatePayment = (data) =>
  api.post("/payments/initiate/", data);

export const getPaymentStatus = (paymentId) =>
  api.get(`/payments/status/${paymentId}/`);
