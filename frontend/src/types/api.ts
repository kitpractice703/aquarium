import axios from "axios";

// 환경 변수 설정 (개발 vs 배포)
const BASE_URL =
  import.meta.env.MODE === "development" ? "/api" : "http://localhost:8080/api"; // 배포 시 실제 IP로 수정 필요

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ScheduleData {
  id: number;
  time: string;
  title: string;
  place: string;
  status: "open" | "closed" | "ready";
}

export interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string;
  rating: number;
  date: string;
}

export interface ReservationRequest {
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
  adultCount: number;
  teenCount: number;
}

export default api;
