import { api } from "./axios";
import type { SignupRequest, LoginRequest } from "../types/api";

export const signup = async (data: SignupRequest) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const me = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const updateUserInfo = async (data: {
  currentPassword: string;
  password?: string;
  phone?: string;
}) => {
  const payload = {
    currentPassword: data.currentPassword,
    newPassword: data.password,
    phone: data.phone,
  };
  const response = await api.put("/users/me", payload);
  return response.data;
};

export const checkUserForReset = async (email: string, phone: string) => {
  const response = await api.post("/users/reset-password/check", { email, phone });
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post("/users/reset-password", { email, newPassword });
  return response.data;
};
