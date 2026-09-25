import api from "./axios";

export const getProfile = () =>
  api.get("/auth/profile/");

export const updateProfile = (data) =>
  api.patch(
    "/auth/profile/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const changePassword = (data) =>
  api.post("/auth/change-password/", data);