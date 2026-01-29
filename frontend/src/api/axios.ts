import axios from "axios";

// 1. Axios 인스턴스 생성
export const api = axios.create({
  // [수정] 환경변수(import.meta.env...)를 지우고 "/api"를 직접 입력합니다.
  // 이렇게 하면 Vercel 설정이나 .env 파일 여부와 상관없이 무조건 프록시를 탑니다.
  baseURL: "/api",

  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2. 요청 인터셉터 (유지)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. 응답 인터셉터 (유지)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
