import { useState, useEffect } from "react";
import { api } from "../../../../api/axios"; // 경로 주의 (components/common/ReviewModal/hooks -> src/api)
import { useAuth } from "../../../../context/AuthContext";
import type { ReviewData, ReviewRequest } from "../../../../types/api";

const ITEMS_PER_PAGE = 5;

export const useReview = (isOpen: boolean) => {
  const { isLoggedIn } = useAuth();

  // [1] 화면 상태 관리
  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false); // 로그인 경고 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 실제 로그인 모달

  // [2] 데이터 상태 관리
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [writeForm, setWriteForm] = useState<ReviewRequest>({
    title: "",
    content: "",
    rating: 5,
  });

  // [3] 초기화 및 데이터 로딩
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

  const fetchReviews = async () => {
    try {
      const response = await api.get("/posts/reviews");
      setReviews(response.data); // 백엔드 응답 형태에 따라 .content가 필요할 수도 있음
    } catch (error) {
      console.error("후기 로딩 실패:", error);
    }
  };

  // [4] 핸들러 함수들
  const handleWriteClick = () => {
    if (isLoggedIn) {
      setWriteForm({ title: "", content: "", rating: 5 }); // 폼 초기화
      setView("WRITE");
    } else {
      setIsLoginNoticeOpen(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!writeForm.title || !writeForm.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await api.post("/posts/reviews", writeForm);
      alert("후기가 등록되었습니다!");
      setView("LIST");
      fetchReviews();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoginNoticeOpen(true);
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  // [5] 페이지네이션 계산
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
