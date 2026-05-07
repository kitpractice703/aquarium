/**
 * 프로그램 관련 API (공개 엔드포인트, 인증 불필요)
 */
import { api } from "./axios";

/** 전체 프로그램 목록 조회 (체험·공연 포함) */
export const getPrograms = async () => {
  const res = await api.get("/programs");
  return res.data;
};

/**
 * 특정 날짜의 프로그램 스케줄 조회.
 * @param programId 대상 프로그램 ID
 * @param date YYYY-MM-DD 형식 날짜
 * @returns 해당 날짜의 스케줄 목록 (isClosed=true 항목은 예약 불가)
 */
export const getProgramSchedules = async (programId: number, date: string) => {
  const res = await api.get(`/programs/${programId}/schedules?date=${date}`);
  return res.data;
};
