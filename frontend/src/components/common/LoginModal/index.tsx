/**
 * 로그인 모달 컴포넌트
 * - 이메일/비밀번호 입력, Enter 키 로그인 지원
 * - Google OAuth2 소셜 로그인 버튼
 * - 비밀번호 찾기, 회원가입 링크
 */
import CommonModal from "../Modal";
import { useLogin } from "./hooks/useLogin";

import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenReset: () => void;
}

const LoginModal = ({ isOpen, onClose, onOpenReset, onOpenSignup }: Props) => {
  const {
    loginForm,
    handleInputChange,
    handleKeyDown,
    handleLoginSubmit,
    handleGoogleLogin,
  } = useLogin(onClose, onOpenSignup);

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="로그인">
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

      {/* Google OAuth2 소셜 로그인 */}
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
        Google로 로그인하기
      </S.GoogleBtn>

      {/* 비밀번호 찾기 링크 */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <S.ResetLink
          onClick={() => {
            onClose();
            onOpenReset();
          }}
        >
          비밀번호를 잊으셨나요?
        </S.ResetLink>
      </div>
      {/* 회원가입 유도 링크 */}
      <S.SignupLink>
        계정이 없으신가요?{" "}
        <span
          onClick={() => {
            onClose();
            onOpenSignup();
          }}
        >
          회원가입
        </span>
      </S.SignupLink>
    </CommonModal>
  );
};

export default LoginModal;
