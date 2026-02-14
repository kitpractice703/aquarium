/**
 * 프로그램/스케줄 관련 API 호출 모듈
 * - 프로그램 목록 조회, 스케줄 조회
 */
import { api } from "./axios";

/** 전체 프로그램 목록 조회 */
export const getPrograms = async () => {
  const res = await api.get("/programs");
  return res.data;
};

/** 특정 프로그램의 날짜별 스케줄 조회 */
export const getProgramSchedules = async (
  programId: number,
  date: string
) => {
  const res = await api.get(
    `/programs/${programId}/schedules?date=${date}`
  );
  return res.data;
};

