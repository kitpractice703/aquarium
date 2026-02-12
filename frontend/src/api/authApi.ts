/**
 * 인증/사용자 관련 API 호출 모듈
 * - 회원가입, 로그인, 회원정보 수정, 비밀번호 재설정
 */
import { api } from "./axios";
import type { SignupRequest, LoginRequest } from "../types/api";

/** 회원가입 */
export const signup = async (data: SignupRequest) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

/** 로그인 (세션 기반, 쿠키 자동 설정) */
export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * 회원정보 수정
 * - 프론트엔드의 'password' → 백엔드의 'newPassword'로 필드명 매핑
 */
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

/** 비밀번호 재설정 1단계: 이메일 + 전화번호 본인 확인 */
export const checkUserForReset = async (email: string, phone: string) => {
  const response = await api.post("/users/reset-password/check", {
    email,
    phone,
  });
  return response.data;
};

/** 비밀번호 재설정 2단계: 새 비밀번호 설정 */
export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post("/users/reset-password", {
    email,
    newPassword,
  });
  return response.data;
};
