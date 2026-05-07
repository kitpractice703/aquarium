/**
 * 리뷰(후기) 관련 API
 *
 * 조회는 공개 엔드포인트, 작성은 로그인 필요.
 */
import { api } from "./axios";
import type { ReviewRequest } from "../types/api";

/**
 * 페이지네이션 기반 리뷰 목록 조회.
 * 홈 화면 커뮤니티 섹션에서 최신 5건을 표시할 때 사용한다.
 * @param page 0-based 페이지 번호 (기본값 0)
 * @param size 페이지당 항목 수 (기본값 5)
 */
export const getReviews = async (page = 0, size = 5) => {
  const res = await api.get(`/posts/reviews?page=${page}&size=${size}`);
  return res.data;
};

/** 전체 리뷰 목록 조회 (페이지네이션 없음, 리뷰 모달 전체보기에서 사용) */
export const getAllReviews = async () => {
  const res = await api.get("/posts/reviews");
  return res.data;
};

/** 리뷰 작성 (로그인 필요) */
export const createReview = async (data: ReviewRequest) => {
  const res = await api.post("/posts/reviews", data);
  return res.data;
};
