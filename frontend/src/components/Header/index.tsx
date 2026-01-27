import React, { useState } from "react";
import * as S from "./style";
import CommonModal from "../common/Modal";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn, username, login, logout } = useAuth();
  const [modalType, setModalType] = useState<"LOGIN" | "SIGNUP" | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

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
      alert(`${username}님의 예매 내역 페이지로 이동합니다.`);
    } else {
      alert("로그인이 필요한 서비스입니다.");
      setModalType("LOGIN");
    }
  };

  return (
    <>
      <S.HeaderWrapper>
        <S.HeaderContent>
          <S.Logo onClick={() => (window.location.href = "/")}>
            NAQUARIUM
          </S.Logo>

          <S.Gnb>
            <a href="/#about">소개</a>
            <a href="/#themes">테마전시</a>
            <a href="/#programs">프로그램</a>
            <a href="/#community">커뮤니티</a>
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
                <span onClick={() => setModalType("SIGNUP")}>회원가입</span>
              </>
            )}
            <span
              onClick={handleTicketCheck}
              style={{
                color: "var(--accent-cyan)",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              예매확인
            </span>
          </S.UserMenu>
        </S.HeaderContent>
      </S.HeaderWrapper>

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
        <S.GoogleBtn onClick={handleGoogleLogin}>Google로 시작하기</S.GoogleBtn>
      </CommonModal>

      {/* 회원가입 모달 */}
      <CommonModal
        isOpen={modalType === "SIGNUP"}
        onClose={closeModal}
        title="회원가입"
      >
        <S.BtnAction onClick={() => alert("회원가입 API 연결 필요")}>
          가입하기
        </S.BtnAction>
      </CommonModal>
    </>
  );
};

export default Header;
