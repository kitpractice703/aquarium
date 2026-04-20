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
  imageUrl: string;
  price: number;
  type: "EXPERIENCE" | "PERFORMANCE";
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
