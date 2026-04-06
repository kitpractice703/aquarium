/** 헤더 네비게이션 및 모달 상태 관리 */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

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

  const handleBookingClick = () => {
    closeMobileMenu();
    isLoggedIn ? setIsBookingOpen(true) : setModalType("NOTICE");
  };

  const handleTicketCheck = () => {
    closeMobileMenu();
    isLoggedIn ? navigate("/mypage") : setModalType("NOTICE");
  };

  const openResetModal = () => {
    setModalType(null);
    setIsResetOpen(true);
  };

  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setModalType("LOGIN");
  };

  /** 고정 헤더 높이만큼 오프셋을 보정하여 정확한 섹션 위치로 스크롤 */
  const SCROLL_OFFSET = -30;
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  /** 다른 페이지에서 네비 클릭 시 홈으로 이동 후 해당 섹션으로 스크롤 */
  const handleNavClick = (id: string) => {
    closeMobileMenu();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToElement(id), 100);
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
