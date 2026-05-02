import { api } from "./axios";
import type {
  DashboardStats,
  AdminSchedule,
  AdminScheduleRequest,
  AdminReservation,
  AdminUser,
  AdminReview,
  AdminProgram,
  AdminProgramRequest,
  AdminExhibition,
  AdminExhibitionRequest,
} from "../types/api";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAdminSchedules = async (date?: string): Promise<AdminSchedule[]> => {
  const res = await api.get("/admin/schedules", { params: date ? { date } : {} });
  return res.data;
};

export const createSchedule = async (data: AdminScheduleRequest): Promise<void> => {
  await api.post("/admin/schedules", data);
};

export const updateSchedule = async (id: number, type: string, data: AdminScheduleRequest): Promise<void> => {
  await api.put(`/admin/schedules/${id}`, data, { params: { type } });
};

export const deleteSchedule = async (id: number, type: string): Promise<void> => {
  await api.delete(`/admin/schedules/${id}`, { params: { type } });
};

export const toggleSchedule = async (id: number, type: string): Promise<void> => {
  await api.patch(`/admin/schedules/${id}/toggle`, {}, { params: { type } });
};

export const getAdminReservations = async (params?: {
  date?: string;
  status?: string;
  search?: string;
}): Promise<AdminReservation[]> => {
  const res = await api.get("/admin/reservations", { params });
  return res.data;
};

export const cancelReservation = async (id: number): Promise<void> => {
  await api.patch(`/admin/reservations/${id}/cancel`);
};

export const getAdminUsers = async (search?: string): Promise<AdminUser[]> => {
  const res = await api.get("/admin/users", { params: search ? { search } : {} });
  return res.data;
};

export const changeUserRole = async (id: number, role: string): Promise<void> => {
  await api.patch(`/admin/users/${id}/role`, { role });
};

export const deleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const getAdminReviews = async (): Promise<AdminReview[]> => {
  const res = await api.get("/admin/reviews");
  return res.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/admin/reviews/${id}`);
};

export const getAdminPrograms = async (): Promise<AdminProgram[]> => {
  const res = await api.get("/admin/programs");
  return res.data;
};

export const createProgram = async (data: AdminProgramRequest): Promise<void> => {
  await api.post("/admin/programs", data);
};

export const updateProgram = async (id: number, data: AdminProgramRequest): Promise<void> => {
  await api.put(`/admin/programs/${id}`, data);
};

export const deleteProgram = async (id: number): Promise<void> => {
  await api.delete(`/admin/programs/${id}`);
};

export const getAdminExhibitions = async (): Promise<AdminExhibition[]> => {
  const res = await api.get("/admin/exhibitions");
  return res.data;
};

export const createExhibition = async (data: AdminExhibitionRequest): Promise<void> => {
  await api.post("/admin/exhibitions", data);
};

export const updateExhibition = async (id: number, data: AdminExhibitionRequest): Promise<void> => {
  await api.put(`/admin/exhibitions/${id}`, data);
};

export const deleteExhibition = async (id: number): Promise<void> => {
  await api.delete(`/admin/exhibitions/${id}`);
};
