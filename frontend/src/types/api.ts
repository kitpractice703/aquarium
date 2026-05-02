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

export interface ReservationData {
  id: number;
  ticketNumber?: string;
  visitDate: string;
  visitTime?: string;
  startTime?: string;
  programTitle: string;
  programType?: string;
  status: string;
  location?: string;
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

// Auth
export interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
}

// Admin
export interface AdminSchedule {
  id: number;
  programId: number;
  programTitle: string;
  programType: "PERFORMANCE" | "EXPERIENCE";
  location: string;
  startTime: string;
  isClosed: boolean;
}

export interface AdminScheduleRequest {
  programId: number;
  location: string;
  startTime: string;
}

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

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: "USER" | "ADMIN";
  provider: string;
}

export interface AdminReview {
  id: number;
  writerName: string;
  writerEmail: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface AdminProgram {
  id: number;
  title: string;
  description: string;
  price: number;
  type: "PERFORMANCE" | "EXPERIENCE";
}

export interface AdminProgramRequest {
  title: string;
  description: string;
  type: string;
  price: number;
}

export interface AdminExhibition {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
  themeColor?: string;
}

export interface AdminExhibitionRequest {
  title: string;
  subTitle: string;
  description: string;
  themeColor: string;
}

export interface DashboardStats {
  todayReservations: number;
  weekSchedules: number;
  totalUsers: number;
  recentReviews: AdminReview[];
}
