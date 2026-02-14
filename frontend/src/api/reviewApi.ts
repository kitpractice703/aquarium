/**
 * 후기/리뷰 관련 API 호출 모듈
 * - 후기 목록 조회, 후기 작성
 */
import { api } from "./axios";

/** 후기 목록 조회 */
export const getReviews = async (page = 0, size = 5) => {
  const res = await api.get(`/posts/reviews?page=${page}&size=${size}`);
  return res.data;
};

/** 후기 전체 조회 (모달용) */
export const getAllReviews = async () => {
  const res = await api.get("/posts/reviews");
  return res.data;
};

/** 후기 작성 */
export const createReview = async (data: FormData) => {
  const res = await api.post("/posts/reviews", data);
  return res.data;
};
