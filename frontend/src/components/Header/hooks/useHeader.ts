/**
 * 헤더 로직 커스텀 훅
 * - 인증 상태, 모달 상태, 내비게이션 처리를 캡슐화
 * - 모달 유형: LOGIN(로그인 모달), NOTICE(로그인 필요 안내)
 * - 페이지 내 스크롤: 홈이 아닌 페이지에서 네비 클릭 시 홈 이동 후 스크롤
 */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

type ModalType = "LOGIN" | "NOTICE" | null;

export const useHeaderLogic = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeModal = () => setModalType(null);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  /** 예매하기 클릭: 로그인 상태면 예매 모달, 비로그인이면 안내 모달 */
  const handleBookingClick = () => {
    closeMobileMenu();
    if (isLoggedIn) {
      setIsBookingOpen(true);
    } else {
      setModalType("NOTICE");
    }
  };

  /** 예매확인/마이페이지 클릭: 로그인 상태면 마이페이지, 비로그인이면 안내 모달 */
  const handleTicketCheck = () => {
    closeMobileMenu();
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      setModalType("NOTICE");
    }
  };

  /** 비밀번호 재설정 모달 열기 (로그인 모달 → 재설정 모달 전환) */
  const openResetModal = () => {
    setModalType(null);
    setIsResetOpen(true);
  };

  /** 재설정 모달 → 로그인 모달 전환 */
  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setModalType("LOGIN");
  };

  /** 섹션 스크롤 오프셋 (고정 헤더 높이 보정) */
  const SCROLL_OFFSET = -30;
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  /** 네비게이션 클릭: 홈이 아닌 페이지에서는 홈으로 이동 후 해당 섹션으로 스크롤 */
  const handleNavClick = (id: string) => {
    closeMobileMenu();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToElement(id);
      }, 100);
    } else {
      scrollToElement(id);
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
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
