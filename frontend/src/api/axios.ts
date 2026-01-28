import axios from "axios";

// 1. Axios 인스턴스 생성 (기본 설정)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 가져온 주소
  timeout: 5000, // 5초 안에 응답 없으면 에러 처리
  headers: {
    "Content-Type": "application/json",
  },
  // [중요] 쿠키(세션)를 주고받으려면 이 설정이 필수입니다! (OAuth2 연동 시 중요)
  withCredentials: true,
});

// 2. 요청 인터셉터 (Request Interceptor)
// 요청을 보내기 직전에 "가로채서" 할 일을 정의합니다.
api.interceptors.request.use(
  (config) => {
    // [추후 구현] 여기에 'localStorage'에 저장된 토큰을 꺼내 헤더에 싣는 코드가 들어갑니다.
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. 응답 인터셉터 (Response Interceptor)
// 응답을 받기 직전에 "가로채서" 에러를 공통 처리합니다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 예: 401(미인증) 에러가 뜨면 로그인 페이지로 튕겨내기 등
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
