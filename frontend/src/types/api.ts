import axios from "axios";

// 환경 변수를 사용하여 개발/배포 환경에 따라 주소를 다르게 설정
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api" // 개발 모드에서는 Proxy를 탐 (기존 유지)
    : "http://사용자님의_AWS_EC2_IP주소:8080"; // 배포 모드에서는 실제 백엔드 주소 (반드시 수정 필요!)

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// (이하 인터페이스 정의는 그대로 유지...)
export default api;
