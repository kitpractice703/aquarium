/**
 * 예약 관련 API 호출 모듈
 * - 내 예약 조회, 입장권 예매, 프로그램 예매
 */
import { api } from "./axios";
import type { ReservationDto } from "../types/api";

/** 내 예약 목록 조회 */
export const getMyReservations = async () => {
  const res = await api.get<ReservationDto[]>("/reservations/me");
  return res.data;
};

/** 입장권(관람권) 예매 */
export const createReservation = async (data: {
  visitDate: string;
  visitTime: string;
  adultCount: number;
  teenCount: number;
}) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

/** 프로그램 예매 */
export const reserveProgram = async (data: {
  programId: number;
  visitDate: string;
  visitTime: string;
  count: number;
}) => {
  const res = await api.post("/reservations/programs", data);
  return res.data;
};
