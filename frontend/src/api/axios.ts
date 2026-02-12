/**
 * Axios 인스턴스 설정
 * - baseURL: Vite 프록시를 통해 백엔드로 전달 (개발: localhost:8080, 운영: 실제 서버)
 * - withCredentials: 세션 기반 인증을 위한 쿠키 전송 활성화
 * - timeout: 5초 타임아웃으로 무한 대기 방지
 */
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // JSESSIONID 쿠키 자동 전송
});

/** 요청 인터셉터: 요청 전처리 (토큰 첨부 등 확장 가능) */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/** 응답 인터셉터: API 에러 로깅 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
