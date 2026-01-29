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

export interface ReservationRequest {
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
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

export interface ReservationDto {
  id: number;
  visitDate: string;
  programTitle: string;
  status: string;
}
