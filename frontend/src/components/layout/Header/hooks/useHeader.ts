import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export const useHeaderLogic = () => {
  const {
    isLoggedIn, username, logout,
    modalType, setModalType,
    isResetOpen,
    closeLoginModal: closeModal, openResetModal, closeResetModal, switchResetToLogin,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const SCROLL_OFFSET = -30;
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
    closeResetModal,
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
