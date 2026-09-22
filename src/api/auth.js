import axios from "./axios";

export const loginUser = (data) =>
  axios.post("/token/", data);

export const registerUser = (data) =>
  axios.post("/register/", data);