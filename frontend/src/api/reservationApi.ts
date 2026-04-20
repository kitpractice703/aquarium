import { api } from "./axios";
import type { ReservationDto } from "../types/api";

export const getMyReservations = async () => {
  const res = await api.get<ReservationDto[]>("/reservations/me");
  return res.data;
};

export const createReservation = async (data: {
  visitDate: string;
  visitTime: string;
  adultCount: number;
  teenCount: number;
}) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

export const reserveProgram = async (data: {
  programId: number;
  visitDate: string;
  visitTime: string;
  count: number;
}) => {
  const res = await api.post("/reservations/programs", data);
  return res.data;
};
