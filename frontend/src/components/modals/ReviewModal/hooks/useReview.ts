import { useState, useEffect } from "react";
import { getAllReviews, createReview } from "../../../../api/reviewApi";
import { useAuth } from "../../../../context/AuthContext";
import type { ReviewData, ReviewRequest } from "../../../../types/api";

const ITEMS_PER_PAGE = 5;

export const useReview = (isOpen: boolean) => {
  const { isLoggedIn } = useAuth();

  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [writeForm, setWriteForm] = useState<ReviewRequest>({ title: "", content: "", rating: 5 });

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
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("후기 로딩 실패:", error);
    }
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      setWriteForm({ title: "", content: "", rating: 5 });
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
      await createReview(writeForm);
      alert("후기가 등록되었습니다!");
      setView("LIST");
      fetchReviews();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        setIsLoginNoticeOpen(true);
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentItems = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return {
    view, setView,
    currentPage, setCurrentPage,
    reviews, currentItems, totalPages,
    selectedReview, setSelectedReview,
    writeForm, setWriteForm,
    handleWriteClick, handleSubmitReview,
    isLoginNoticeOpen, setIsLoginNoticeOpen,
    isLoginModalOpen, setIsLoginModalOpen,
  };
};
