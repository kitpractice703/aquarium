/**
 * API 통신에 사용되는 TypeScript 인터페이스 정의
 * - 백엔드 DTO와 1:1 대응하는 프론트엔드 타입
 */

/** 프로그램 일정 데이터 (ScheduleDto 대응) */
export interface ScheduleData {
  id: number;
  programId: number;
  price: number;
  date: string;
  time: string;
  title: string;
  place: string;
  status: string; // "open" | "closed"
}

/** 후기 응답 데이터 */
export interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string;
  rating: number;
  date: string;
}

/** 후기 작성 요청 */
export interface ReviewRequest {
  title: string;
  content: string;
  rating: number;
}

/** 예약 응답 데이터 (ReservationDto 대응) */
export interface ReservationDto {
  id: number;
  ticketNumber?: string;
  visitDate: string;
  visitTime?: string;
  startTime?: string;
  programTitle: string;
  programType?: string; // "ADMISSION" | "PERFORMANCE" | "EXPERIENCE"
  status: string; // "CONFIRMED" | "CANCELLED"
  location?: string;
  imageUrl?: string;
}

/** 입장권 예약 요청 */
export interface ReservationRequest {
  visitDate: string;
  visitTime: string;
  adultCount: number;
  teenCount: number;
}

/** 회원가입 요청 */
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 프로그램 정보 */
export interface Program {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  type: "EXPERIENCE" | "PERFORMANCE";
}

/** 프로그램 일정 (ProgramSchedule 엔티티 대응) */
export interface ProgramSchedule {
  id: number;
  programId: number;
  location: string;
  startTime: string;
  isClosed: boolean;
}

/** FAQ 데이터 */
export interface FaqData {
  id: number;
  category: string;
  question: string;
  answer: string;
}

/** 결제 정보 */
export interface Payment {
  amount: number;
  orderName: string;
}

/** 테마 전시관 데이터 (Exhibition 엔티티 대응) */
export interface ThemeItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
}
