import React, { useState } from "react"; // 👈 React를 명시적으로 import
import * as S from "./style";
import CommonModal from "../common/Modal";

const Header = () => {
  const [modalType, setModalType] = useState<"LOGIN" | "SIGNUP" | null>(null);

  const closeModal = () => setModalType(null);

  // ⚡️ 수정됨: React.KeyboardEvent로 타입을 명확하게 지정 (빨간 줄 해결)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === "Enter") action();
  };

  const handleLogin = () => {
    alert("로그인 시도 (백엔드 연동 예정)");
    closeModal();
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSignup = () => {
    alert("회원가입 시도 (백엔드 연동 예정)");
    closeModal();
  };

  return (
    <>
      <S.HeaderContainer>
        <S.Logo onClick={() => window.scrollTo(0, 0)}>NAQUARIUM</S.Logo>

        <S.Gnb>
          <a href="#about">소개</a>
          <a href="#themes">테마전시</a> {/* 👈 띄어쓰기 제거 */}
          <a href="#programs">프로그램</a>
          <a href="#community">커뮤니티</a>
        </S.Gnb>

        <S.UserMenu>
          <span onClick={() => setModalType("LOGIN")}>로그인</span>
          <span onClick={() => setModalType("SIGNUP")}>회원가입</span>
          <span style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}>
            예매확인
          </span>
        </S.UserMenu>
      </S.HeaderContainer>

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
            placeholder="example@email.com"
            onKeyDown={(e) => handleKeyDown(e, handleLogin)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.InputBox
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => handleKeyDown(e, handleLogin)}
          />
        </S.InputGroup>
        <S.BtnAction onClick={handleLogin}>로그인</S.BtnAction>

        <S.GoogleBtn onClick={handleGoogleLogin}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Google 계정으로 로그인
        </S.GoogleBtn>
      </CommonModal>

      {/* 회원가입 모달 */}
      <CommonModal
        isOpen={modalType === "SIGNUP"}
        onClose={closeModal}
        title="회원가입"
      >
        <S.InputGroup>
          <S.Label>이름</S.Label>
          <S.InputBox
            type="text"
            placeholder="홍길동"
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>전화번호</S.Label>
          <S.InputBox
            type="text"
            placeholder="010-0000-0000"
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>이메일 (아이디)</S.Label>
          <S.InputBox
            type="text"
            placeholder="example@email.com"
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.InputBox
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호 확인</S.Label>
          <S.InputBox
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => handleKeyDown(e, handleSignup)}
          />
        </S.InputGroup>
        <S.BtnAction onClick={handleSignup}>가입하기</S.BtnAction>
      </CommonModal>
    </>
  );
};

export default Header;
