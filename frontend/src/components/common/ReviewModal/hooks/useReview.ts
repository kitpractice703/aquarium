/**
 * 후기 로직 커스텀 훅
 * - 후기 목록 조회 (GET /api/posts/reviews)
 * - 후기 작성 (POST /api/posts/reviews), 로그인 필요
 * - 페이지네이션: 5건씩 분할
 */
import { useState, useEffect } from "react";
import { api } from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";
import type { ReviewData, ReviewRequest } from "../../../../types/api";

/** 한 페이지당 표시할 후기 수 */
const ITEMS_PER_PAGE = 5;

export const useReview = (isOpen: boolean) => {
  const { isLoggedIn } = useAuth();

  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [writeForm, setWriteForm] = useState<ReviewRequest>({
    title: "",
    content: "",
    rating: 5,
  });

  /** 모달 열림 시 후기 목록 조회 + 상태 초기화 */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("LIST");
      setCurrentPage(1);
      fetchReviews();
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  /** 후기 목록 API 호출 */
  const fetchReviews = async () => {
    try {
      const response = await api.get("/posts/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("후기 로딩 실패:", error);
    }
  };

  /** 글쓰기 버튼: 로그인 상태 확인 후 작성 뷰 또는 로그인 안내 */
  const handleWriteClick = () => {
    if (isLoggedIn) {
      setWriteForm({ title: "", content: "", rating: 5 });
      setView("WRITE");
    } else {
      setIsLoginNoticeOpen(true);
    }
  };

  /** 후기 등록: 제목/내용 필수 검증 후 API 호출 */
  const handleSubmitReview = async () => {
    if (!writeForm.title || !writeForm.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await api.post("/posts/reviews", writeForm);
      alert("후기가 등록되었습니다!");
      setView("LIST");
      fetchReviews(); // 목록 새로고침
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoginNoticeOpen(true);
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  /** 페이지네이션 계산 */
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentItems = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return {
    view,
    setView,
    currentPage,
    setCurrentPage,
    reviews,
    currentItems,
    totalPages,
    selectedReview,
    setSelectedReview,
    writeForm,
    setWriteForm,
    handleWriteClick,
    handleSubmitReview,
    isLoginNoticeOpen,
    setIsLoginNoticeOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
};
