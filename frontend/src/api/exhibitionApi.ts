/**
 * 전시관/스케줄 관련 API 호출 모듈
 * - 메인 스케줄 조회
 */
import { api } from "./axios";

/** 날짜별 전체 스케줄 조회 (홈 섹션용) */
export const getSchedulesByDate = async (date: string) => {
  const res = await api.get(`/schedules?date=${date}`);
  return res.data;
};
