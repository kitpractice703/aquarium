/**
 * API 요청·응답 공통 타입 정의
 *
 * 백엔드 DTO와 1:1 대응하며, 프론트엔드 전역에서 재사용한다.
 * 관리자 전용 타입은 "Admin" 접두사로 일반 사용자 타입과 구분한다.
 */

/** 홈 화면 프로그램 섹션에 표시되는 일정 항목 */
export interface ScheduleData {
  id: number;
  programId: number;
  price: number;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  title: string;
  place: string;
  /** "open" | "closed" */
  status: string;
}

/** 커뮤니티 섹션 및 리뷰 모달에 표시되는 후기 데이터 */
export interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string;
  /** 1 ~ 5 정수 */
  rating: number;
  /** YYYY-MM-DD */
  date: string;
}

/** 리뷰 작성 요청 바디 */
export interface ReviewRequest {
  title: string;
  content: string;
  rating: number;
}

/** 마이페이지 예매 내역 카드에 사용되는 예약 데이터 */
export interface ReservationData {
  id: number;
  /** 발권 번호 (없을 경우 "T-{id}" 로 대체) */
  ticketNumber?: string;
  /** YYYY-MM-DD */
  visitDate: string;
  /** 종일권이거나 프로그램 시작 시각 (HH:mm) */
  visitTime?: string;
  startTime?: string;
  programTitle: string;
  /** "ADMISSION" | "PERFORMANCE" | "EXPERIENCE" | undefined */
  programType?: string;
  /** "CONFIRMED" | "CANCELLED" */
  status: string;
  location?: string;
}

/** 입장권 예매 요청 바디 */
export interface ReservationRequest {
  /** YYYY-MM-DD */
  visitDate: string;
  /** "종일권" 고정값 (현재 시간 선택 없음) */
  visitTime: string;
  adultCount: number;
  teenCount: number;
}

/** 회원가입 요청 바디 */
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  /** 하이픈 포함 형식 (010-0000-0000) */
  phone: string;
}

/** 로그인 요청 바디 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 프로그램 목록 조회 응답 (EXPERIENCE: 체험, PERFORMANCE: 공연) */
export interface Program {
  id: number;
  title: string;
  description: string;
  price: number;
  type: "EXPERIENCE" | "PERFORMANCE";
}

/** 특정 날짜의 프로그램 스케줄 항목 */
export interface ProgramSchedule {
  id: number;
  programId: number;
  location: string;
  /** "YYYY-MM-DD HH:mm" 형식 */
  startTime: string;
  /** 운영 중단 여부 (관리자가 임시 비활성화한 경우 true) */
  isClosed: boolean;
}

/** FAQ 아이템 - 현재 정적 데이터로 관리 */
export interface FaqData {
  id: number;
  category: string;
  question: string;
  answer: string;
}

/** 결제 요청에 필요한 금액·주문명 */
export interface Payment {
  amount: number;
  orderName: string;
}

/** 홈 화면 테마 섹션의 전시 항목 */
export interface ThemeItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
}

/** /auth/me 응답 - 현재 로그인 사용자 정보 */
export interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
}

// ── 관리자 전용 타입 ──────────────────────────────────────────────────────────

/** 관리자 일정 관리 화면의 스케줄 항목 */
export interface AdminSchedule {
  id: number;
  programId: number;
  programTitle: string;
  programType: "PERFORMANCE" | "EXPERIENCE";
  location: string;
  /** "YYYY-MM-DD HH:mm" 형식 */
  startTime: string;
  isClosed: boolean;
}

/** 스케줄 생성·수정 요청 바디 */
export interface AdminScheduleRequest {
  programId: number;
  location: string;
  /** "YYYY-MM-DD HH:mm" 형식 */
  startTime: string;
}

/** 관리자 예약 목록 항목 */
export interface AdminReservation {
  id: number;
  ticketNumber: string;
  userEmail: string;
  userName: string;
  programTitle: string;
  programType: string;
  visitDate: string;
  visitTime?: string;
  location?: string;
  adultCount: number;
  teenCount: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  reservedAt: string;
}

/** 관리자 회원 목록 항목 */
export interface AdminUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: "USER" | "ADMIN";
  /** "local" | "google" - 로그인 방식 구분 */
  provider: string;
}

/** 관리자 리뷰 목록 항목 */
export interface AdminReview {
  id: number;
  writerName: string;
  writerEmail: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
}

/** 관리자 프로그램 목록 항목 */
export interface AdminProgram {
  id: number;
  title: string;
  description: string;
  price: number;
  type: "PERFORMANCE" | "EXPERIENCE";
}

/** 프로그램 생성·수정 요청 바디 */
export interface AdminProgramRequest {
  title: string;
  description: string;
  type: string;
  price: number;
}

/** 관리자 전시 목록 항목 */
export interface AdminExhibition {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
  themeColor?: string;
}

/** 전시 생성·수정 요청 바디 */
export interface AdminExhibitionRequest {
  title: string;
  subTitle: string;
  description: string;
  themeColor: string;
}

/** 관리자 대시보드 통계 응답 */
export interface DashboardStats {
  /** 오늘 날짜 기준 예약 건수 */
  todayReservations: number;
  /** 이번 주(월~일) 등록된 스케줄 수 */
  weekSchedules: number;
  totalUsers: number;
  /** 최근 5건 리뷰 */
  recentReviews: AdminReview[];
}
