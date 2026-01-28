import { api } from "./axios";
import { SignupRequest, LoginRequest } from "../types/api"; // 기존에 정의된 타입 활용

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

// [참고] 구글 로그인은 Axios로 요청하는 게 아닙니다!
// 구글 로그인은 사용자가 '링크'를 타고 구글 서버로 이동해야 하므로
// <a href="http://localhost:8080/oauth2/authorization/google">...</a>
// 형태로 구현하게 됩니다. (이건 로그인 페이지 구현 때 자세히 다룰게요)
