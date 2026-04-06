/** 날짜별 공연 스케줄 API */
import { api } from "./axios";

export const getSchedulesByDate = async (date: string) => {
  const res = await api.get(`/schedules?date=${date}`);
  return res.data;
};
