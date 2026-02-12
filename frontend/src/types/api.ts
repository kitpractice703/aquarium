export interface ScheduleData {
  id: number;
  programId: number;
  price: number;
  date: string;
  time: string;
  title: string;
  place: string;
  status: string;
}

export interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string;
  rating: number;
  date: string;
}

export interface ReviewRequest {
  title: string;
  content: string;
  rating: number;
}

export interface ReservationDto {
  id: number;
  ticketNumber?: string; // 티켓 번호 (예: T2026...)
  visitDate: string; // 방문 날짜
  visitTime?: string; // [핵심] 이 부분이 없어서 에러가 발생했습니다!
  startTime?: string; // 스케줄 시작 시간 (구버전 호환용)
  programTitle: string; // 프로그램 제목
  programType?: string; // PERFORMANCE | EXPERIENCE | ADMISSION
  status: string; // 예매 상태
  location?: string; // 장소
  imageUrl?: string; // 이미지 URL
}

export interface ReservationRequest {
  visitDate: string;
  visitTime: string;
  adultCount: number;
  teenCount: number;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  imageUrl: string; // 혹은 image_url 등 백엔드와 맞춤
  price: number;
  type: "EXPERIENCE" | "PERFORMANCE"; // 체험 | 공연
}

export interface ProgramSchedule {
  id: number;
  programId: number;
  location: string;
  startTime: string;
  isClosed: boolean;
}

export interface FaqData {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface Payment {
  amount: number;
  orderName: string;
}

export interface ThemeItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
}
