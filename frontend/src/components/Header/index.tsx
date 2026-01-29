import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./style";
import BookingModal from "../common/BookingModal";
import LoginRequestModal from "../common/LoginRequestModal";
// [추가] 새로 만든 로그인 모달 import
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
                {/* [변경] 로그인 버튼 클릭 시 LOGIN 모달 타입 설정 */}
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

      {/* [변경] 기존 인라인 코드를 제거하고 LoginModal 컴포넌트 사용 */}
      <LoginModal isOpen={modalType === "LOGIN"} onClose={closeModal} />

      {/* [변경] 경고 모달 확인 시 -> 로그인 모달로 전환 */}
      <LoginRequestModal
        isOpen={modalType === "NOTICE"}
        onClose={() => setModalType(null)}
        onConfirm={() => setModalType("LOGIN")}
      />
    </>
  );
};

export default Header;
