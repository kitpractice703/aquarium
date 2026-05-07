/**
 * 로그인 모달 상태 관리 훅
 *
 * 이메일·비밀번호 로그인과 Google OAuth2 로그인 두 가지 방식을 처리한다.
 * 실제 인증 로직은 AuthContext.login()에 위임하고,
 * 이 훅은 폼 상태와 UI 이벤트 핸들링만 담당한다.
 */
import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";

/**
 * @param onClose 로그인 성공 후 모달 닫기 콜백
 * @param onOpenSignup 회원가입 페이지로 이동 콜백
 */
export const useLogin = (onClose: () => void, onOpenSignup: () => void) => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Enter 키 입력 시 지정된 액션을 실행한다.
   * 이메일 입력 필드에서는 비밀번호 필드로 포커스 이동,
   * 비밀번호 필드에서는 로그인 제출에 사용한다.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === "Enter") action();
  };

  const handleLoginSubmit = async () => {
    try {
      await login(loginForm);
      setLoginForm({ email: "", password: "" });
      onClose();
    } catch {
      // 에러 처리는 AuthContext.login() 내부에서 alert로 수행
    }
  };

  /**
   * Google OAuth2 로그인 시작.
   * Spring Security OAuth2 엔드포인트로 리다이렉트하면
   * 인증 완료 후 백엔드 OAuth2SuccessHandler가 JWT를 쿼리스트링으로 반환한다.
   */
  const handleGoogleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  const handleSignupClick = () => {
    onClose();
    if (onOpenSignup) onOpenSignup();
  };

  return {
    loginForm,
    handleInputChange,
    handleKeyDown,
    handleLoginSubmit,
    handleGoogleLogin,
    handleSignupClick,
  };
};
