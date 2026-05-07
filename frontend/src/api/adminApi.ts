/**
 * 관리자 전용 API
 *
 * /api/admin/** 엔드포인트를 도메인별로 묶어 관리한다.
 * 모든 요청은 ADMIN 역할 토큰을 요구하며, 권한 검증은 서버에서 수행된다.
 */
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

// ── 대시보드 ──────────────────────────────────────────────────────────────────

/** 오늘 예약 수, 이번 주 스케줄 수, 전체 회원 수, 최근 리뷰 5건 조회 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// ── 스케줄 ────────────────────────────────────────────────────────────────────

/**
 * 스케줄 목록 조회.
 * @param date YYYY-MM-DD 형식 날짜 필터 (미전달 시 전체 조회)
 */
export const getAdminSchedules = async (date?: string): Promise<AdminSchedule[]> => {
  const res = await api.get("/admin/schedules", { params: date ? { date } : {} });
  return res.data;
};

/** 스케줄 생성 (PERFORMANCE / EXPERIENCE 타입을 programId로 서버가 판별) */
export const createSchedule = async (data: AdminScheduleRequest): Promise<void> => {
  await api.post("/admin/schedules", data);
};

/**
 * 스케줄 수정.
 * @param type "PERFORMANCE" | "EXPERIENCE" - 수정 대상 테이블 구분
 */
export const updateSchedule = async (id: number, type: string, data: AdminScheduleRequest): Promise<void> => {
  await api.put(`/admin/schedules/${id}`, data, { params: { type } });
};

/** 스케줄 삭제 */
export const deleteSchedule = async (id: number, type: string): Promise<void> => {
  await api.delete(`/admin/schedules/${id}`, { params: { type } });
};

/** 스케줄 운영 중단·재개 토글 (isClosed 플래그 반전) */
export const toggleSchedule = async (id: number, type: string): Promise<void> => {
  await api.patch(`/admin/schedules/${id}/toggle`, {}, { params: { type } });
};

// ── 예약 ──────────────────────────────────────────────────────────────────────

/**
 * 전체 예약 목록 조회.
 * 날짜·상태·이메일/이름 검색 필터는 서버에서 처리된다.
 */
export const getAdminReservations = async (params?: {
  date?: string;
  status?: string;
  search?: string;
}): Promise<AdminReservation[]> => {
  const res = await api.get("/admin/reservations", { params });
  return res.data;
};

/** 예약 강제 취소 (상태를 CANCELLED 로 변경) */
export const cancelReservation = async (id: number): Promise<void> => {
  await api.patch(`/admin/reservations/${id}/cancel`);
};

// ── 회원 ──────────────────────────────────────────────────────────────────────

/**
 * 전체 회원 목록 조회.
 * @param search 이메일 또는 이름 검색어 (미전달 시 전체 조회)
 */
export const getAdminUsers = async (search?: string): Promise<AdminUser[]> => {
  const res = await api.get("/admin/users", { params: search ? { search } : {} });
  return res.data;
};

/**
 * 회원 역할 변경 (USER ↔ ADMIN).
 * @param role "USER" | "ADMIN"
 */
export const changeUserRole = async (id: number, role: string): Promise<void> => {
  await api.patch(`/admin/users/${id}/role`, { role });
};

/** 회원 삭제 (연관 예약·게시글 포함 cascade 삭제는 서버에서 처리) */
export const deleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

// ── 리뷰 ──────────────────────────────────────────────────────────────────────

/** 전체 리뷰 목록 조회 (최신순) */
export const getAdminReviews = async (): Promise<AdminReview[]> => {
  const res = await api.get("/admin/reviews");
  return res.data;
};

/** 리뷰 삭제 */
export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/admin/reviews/${id}`);
};

// ── 프로그램 ──────────────────────────────────────────────────────────────────

/** 전체 프로그램 목록 조회 */
export const getAdminPrograms = async (): Promise<AdminProgram[]> => {
  const res = await api.get("/admin/programs");
  return res.data;
};

/** 프로그램 생성 */
export const createProgram = async (data: AdminProgramRequest): Promise<void> => {
  await api.post("/admin/programs", data);
};

/** 프로그램 수정 */
export const updateProgram = async (id: number, data: AdminProgramRequest): Promise<void> => {
  await api.put(`/admin/programs/${id}`, data);
};

/** 프로그램 삭제 */
export const deleteProgram = async (id: number): Promise<void> => {
  await api.delete(`/admin/programs/${id}`);
};

// ── 전시 ──────────────────────────────────────────────────────────────────────

/** 전체 전시 목록 조회 */
export const getAdminExhibitions = async (): Promise<AdminExhibition[]> => {
  const res = await api.get("/admin/exhibitions");
  return res.data;
};

/** 전시 생성 */
export const createExhibition = async (data: AdminExhibitionRequest): Promise<void> => {
  await api.post("/admin/exhibitions", data);
};

/** 전시 수정 */
export const updateExhibition = async (id: number, data: AdminExhibitionRequest): Promise<void> => {
  await api.put(`/admin/exhibitions/${id}`, data);
};

/** 전시 삭제 */
export const deleteExhibition = async (id: number): Promise<void> => {
  await api.delete(`/admin/exhibitions/${id}`);
};
