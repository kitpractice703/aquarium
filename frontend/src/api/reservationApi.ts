/**
 * 예약 관련 API
 *
 * 입장권 예매(일반)와 프로그램 예매(체험·공연)를 구분해 처리한다.
 * 두 예매 모두 결제 완료 후 호출되며, 인증 토큰이 필요하다.
 */
import { api } from "./axios";
import type { ReservationData } from "../types/api";

/** 현재 로그인 사용자의 전체 예약 목록 조회 */
export const getMyReservations = async () => {
  const res = await api.get<ReservationData[]>("/reservations/me");
  return res.data;
};

/**
 * 입장권(종일권) 예매 생성.
 * 결제 성공 콜백에서 호출되며, visitTime은 "종일권" 고정값으로 전달된다.
 */
export const createReservation = async (data: {
  visitDate: string;
  visitTime: string;
  adultCount: number;
  teenCount: number;
}) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

/**
 * 체험·공연 프로그램 예매 생성.
 * 프로그램 예매 시 해당 날짜에 유효한 입장권이 있어야 하며,
 * 없을 경우 서버가 400을 반환해 requireTicket 플래그가 활성화된다.
 */
export const reserveProgram = async (data: {
  programId: number;
  visitDate: string;
  visitTime: string;
  count: number;
}) => {
  const res = await api.post("/reservations/programs", data);
  return res.data;
};
