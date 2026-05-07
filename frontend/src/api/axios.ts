/**
 * Axios 공통 인스턴스
 *
 * baseURL "/api"는 Vite 개발 서버의 프록시 설정을 경유하고,
 * 프로덕션에서는 Vercel rewrites가 AWS EB 백엔드로 포워딩한다.
 * 모든 API 모듈은 이 인스턴스를 import해 사용한다.
 */
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // 모든 요청에 localStorage의 JWT를 자동 주입해
    // 각 API 함수에서 토큰 처리 코드를 반복하지 않도록 한다.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 로깅만 수행하고, 401·404 등 구체적인 에러 처리는
    // 각 호출부(훅, 컴포넌트)에서 비즈니스 맥락에 맞게 담당한다.
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
