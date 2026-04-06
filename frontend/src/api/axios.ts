/** Axios 공통 인스턴스 - 세션 기반 인증(JSESSIONID 쿠키) 및 API 기본 설정 */
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 크로스 오리진 요청 시 세션 쿠키 포함
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
