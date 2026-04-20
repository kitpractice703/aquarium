import { api } from "./axios";

export const getSchedulesByDate = async (date: string) => {
  const res = await api.get(`/schedules?date=${date}`);
  return res.data;
};
