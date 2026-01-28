import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./style";
import CommonModal from "../common/Modal";
import BookingModal from "../common/BookingModal"; // [ADDED] 예매 모달
import { useAuth } from "../../context/AuthContext";
// import { api } from "../../api/axios"; // (헤더에선 api 호출을 안 하므로 굳이 필요 없음, 삭제)

const Header = () => {
  const { isLoggedIn, username, login, logout } = useAuth();
  const [modalType, setModalType] = useState<"LOGIN" | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // [ADDED] 예매 모달 상태
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => {
    setModalType(null);
    setLoginForm({ email: "", password: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === "Enter") action();
  };

  const handleLoginSubmit = async () => {
    try {
      await login(loginForm);
      closeModal();
    } catch (e) {
      // Error handled in AuthContext
    }
  };

  const handleGoogleLogin = () => {
    alert("구글 로그인은 현재 준비 중입니다.");
  };

  const handleTicketCheck = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      alert("로그인이 필요한 서비스입니다.");
      setModalType("LOGIN");
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
            {/* [ADDED] 예매하기 버튼 */}
            <S.BookingButton onClick={() => setIsBookingOpen(true)}>
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

      {/* [ADDED] 예매 모달 연결 */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* 로그인 모달 */}
      <CommonModal
        isOpen={modalType === "LOGIN"}
        onClose={closeModal}
        title="로그인"
      >
        <S.InputGroup>
          <S.Label>이메일</S.Label>
          <S.InputBox
            type="text"
            name="email"
            value={loginForm.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            onKeyDown={(e) => handleKeyDown(e, handleLoginSubmit)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.InputBox
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            onKeyDown={(e) => handleKeyDown(e, handleLoginSubmit)}
          />
        </S.InputGroup>

        <S.BtnAction onClick={handleLoginSubmit}>로그인</S.BtnAction>

        <S.GoogleBtn onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M17.64 9.2c0-.637-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Google로 시작하기
        </S.GoogleBtn>
      </CommonModal>
    </>
  );
};

export default Header;
