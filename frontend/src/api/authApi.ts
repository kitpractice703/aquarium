import { api } from "./axios";
import type { SignupRequest, LoginRequest } from "../types/api"; // 기존에 정의된 타입 활용

// 회원가입 요청
export const signup = async (data: SignupRequest) => {
  // POST /api/auth/signup
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// 일반 로그인 요청 (ID/PW)
export const login = async (data: LoginRequest) => {
  // POST /api/auth/login
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const updateUserInfo = async (data: {
  currentPassword: string;
  password?: string;
  phone?: string;
}) => {
  const payload = {
    currentPassword: data.currentPassword,
    newPassword: data.password, // 백엔드 DTO 필드명에 맞춤
    phone: data.phone,
  };
  // PUT /api/users/me
  const response = await api.put("/users/me", payload);
  return response.data;
};

export const checkUserForReset = async (email: string, phone: string) => {
  const response = await api.post("/users/reset-password/check", {
    email,
    phone,
  });
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  // [FIX] axiosInstance -> api 로 변경
  const response = await api.post("/users/reset-password", {
    email,
    newPassword,
  });
  return response.data;
};
