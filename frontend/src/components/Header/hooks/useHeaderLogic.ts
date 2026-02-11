import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

type ModalType = "LOGIN" | "NOTICE" | null;

export const useHeaderLogic = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 모달 상태 관리
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // 핸들러: 모달 닫기
  const closeModal = () => setModalType(null);

  // 핸들러: 예매 버튼 클릭
  const handleBookingClick = () => {
    if (isLoggedIn) {
      setIsBookingOpen(true);
    } else {
      setModalType("NOTICE");
    }
  };

  // 핸들러: 예매 확인/마이페이지 클릭
  const handleTicketCheck = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      setModalType("NOTICE");
    }
  };

  // 핸들러: 비밀번호 찾기 모달 열기
  const openResetModal = () => {
    setModalType(null);
    setIsResetOpen(true);
  };

  // 핸들러: 비밀번호 찾기 -> 로그인 전환
  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setModalType("LOGIN");
  };

  // 핸들러: 네비게이션 스크롤 이동
  const handleNavClick = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return {
    isLoggedIn,
    username,
    logout,
    modalType,
    setModalType,
    isBookingOpen,
    setIsBookingOpen,
    isResetOpen,
    setIsResetOpen,
    closeModal,
    handleBookingClick,
    handleTicketCheck,
    openResetModal,
    switchResetToLogin,
    handleNavClick,
    navigate,
  };
};
