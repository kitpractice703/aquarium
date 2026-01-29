// frontend/src/components/Header/index.tsx

import { useState } from "react"; // [수정] 'React' 제거
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./style";
import BookingModal from "../common/BookingModal";
import LoginRequestModal from "../common/LoginRequestModal";
import LoginModal from "../common/LoginModal";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn, username, logout } = useAuth();

  const [modalType, setModalType] = useState<"LOGIN" | "NOTICE" | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <LoginModal isOpen={modalType === "LOGIN"} onClose={closeModal} />

      <LoginRequestModal
        isOpen={modalType === "NOTICE"}
        onClose={() => setModalType(null)}
        onConfirm={() => setModalType("LOGIN")}
      />
    </>
  );
};

export default Header;
