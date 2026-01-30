export interface ScheduleData {
  id: number;
  programId: number;
  price: number;
  date: string;
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

// [수정] 누락된 필드들을 모두 포함하여 재정의
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
