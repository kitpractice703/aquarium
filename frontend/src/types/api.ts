export interface ScheduleData {
  id: number;
  programId: number; // [추가됨]
  price: number; // [추가됨]
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

export interface ReservationDto {
  id: number;
  ticketNumber?: string;
  visitDate: string;
  startTime?: string;
  programTitle: string;
  programType?: string;
  status: string;
  location?: string;
  imageUrl?: string;
}

export interface ReservationDto {
  id: number;
  ticketNumber?: string;
  visitDate: string;
  programTitle: string;
  status: string;
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
