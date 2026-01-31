import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./style";
import BookingModal from "../common/BookingModal";
import LoginRequestModal from "../common/LoginRequestModal";
import LoginModal from "../common/LoginModal";
import PasswordResetModal from "../common/PasswordResetModal"; // [ADDED] import 추가
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn, username, logout } = useAuth();

  const [modalType, setModalType] = useState<"LOGIN" | "NOTICE" | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false); // [ADDED] 비밀번호 찾기 모달 상태

  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => {
    setModalType(null);
  };

  const handleBookingClick = () => {
    if (isLoggedIn) {
      setIsBookingOpen(true);
    } else {
      setModalType("NOTICE");
    }
  };

  const handleTicketCheck = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      setModalType("NOTICE");
    }
  };

  // [ADDED] 비밀번호 찾기 모달 열기 (로그인창은 닫음)
  const openResetModal = () => {
    setModalType(null);
    setIsResetOpen(true);
  };

  // [ADDED] 비밀번호 찾기 -> 다시 로그인으로 전환
  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setModalType("LOGIN");
  };

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

  return (
    <>
      <S.HeaderWrapper>
        <S.HeaderContent>
          <S.Logo onClick={() => navigate("/")}>NAQUARIUM</S.Logo>

          <S.Gnb>
            <a onClick={() => handleNavClick("about")}>소개</a>
            <a onClick={() => handleNavClick("themes")}>테마전시</a>
            <a onClick={() => handleNavClick("programs")}>프로그램</a>
            <a onClick={() => handleNavClick("community")}>커뮤니티</a>
            <S.BookingButton onClick={handleBookingClick}>
              예매하기
            </S.BookingButton>
          </S.Gnb>

          <S.UserMenu>
            {isLoggedIn ? (
              <>
                <span style={{ color: "var(--accent-cyan)" }}>
                  {username}님
                </span>
                <span onClick={logout}>로그아웃</span>
              </>
            ) : (
              <>
                <span onClick={() => setModalType("LOGIN")}>로그인</span>
                <span onClick={() => navigate("/signup")}>회원가입</span>
              </>
            )}

            <span
              onClick={handleTicketCheck}
              style={{
                color: "var(--accent-cyan)",
                fontWeight: "bold",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? "마이페이지" : "예매확인"}
            </span>
          </S.UserMenu>
        </S.HeaderContent>
      </S.HeaderWrapper>

      {/* 예매 모달 */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={modalType === "LOGIN"}
        onClose={closeModal}
        onOpenSignup={() => {
          closeModal();
          navigate("/signup");
        }}
        onOpenReset={openResetModal} // [ADDED] 비밀번호 찾기 열기 핸들러 전달
      />

      {/* [ADDED] 비밀번호 찾기 모달 (Header가 직접 관리) */}
      <PasswordResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSwitchToLogin={switchResetToLogin}
      />

      {/* 로그인 유도 모달 */}
      <LoginRequestModal
        isOpen={modalType === "NOTICE"}
        onClose={() => setModalType(null)}
        onConfirm={() => setModalType("LOGIN")}
      />
    </>
  );
};

export default Header;
