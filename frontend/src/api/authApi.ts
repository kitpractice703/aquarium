/**
 * 인증·회원 관련 API
 *
 * 로그인, 회원가입, 세션 확인, 회원정보 수정, 비밀번호 재설정을 담당한다.
 * JWT 토큰 저장·제거는 AuthContext에서 처리하며, 이 파일은 순수 HTTP 호출만 한다.
 */
import { api } from "./axios";
import type { SignupRequest, LoginRequest } from "../types/api";

/** 이메일·비밀번호로 회원가입 */
export const signup = async (data: SignupRequest) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

/**
 * 이메일·비밀번호 로그인.
 * @returns {{ token: string }} JWT 액세스 토큰
 */
export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * 현재 토큰으로 로그인 사용자 정보 조회 (세션 검증용).
 * Authorization 헤더는 Axios 인터셉터가 자동으로 주입한다.
 */
export const me = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/** 로그아웃 (서버 세션 무효화) */
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * 마이페이지 회원정보 수정 (비밀번호·전화번호).
 * 현재 비밀번호 확인이 서버 측에서 수행된다.
 * @param data.currentPassword 본인 확인용 현재 비밀번호 (필수)
 * @param data.password 변경할 새 비밀번호 (선택)
 * @param data.phone 변경할 전화번호 (선택, 하이픈 포함)
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

/**
 * 비밀번호 재설정 전 이메일·전화번호로 본인 확인.
 * @returns 검증 성공 여부 (실패 시 서버가 4xx 반환)
 */
export const checkUserForReset = async (email: string, phone: string) => {
  const response = await api.post("/users/reset-password/check", { email, phone });
  return response.data;
};

/**
 * 임시 비밀번호 발급 (비밀번호 재설정).
 * checkUserForReset 성공 후 호출해야 한다.
 */
export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post("/users/reset-password", { email, newPassword });
  return response.data;
};
