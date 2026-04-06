/** 프로그램 및 공연 스케줄 API */
import { api } from "./axios";

export const getPrograms = async () => {
  const res = await api.get("/programs");
  return res.data;
};

export const getProgramSchedules = async (programId: number, date: string) => {
  const res = await api.get(`/programs/${programId}/schedules?date=${date}`);
  return res.data;
};
