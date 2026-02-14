/**
 * 로그인 로직 커스텀 훅
 * - 이메일/비밀번호 폼 상태 관리
 * - AuthContext의 login() 호출 후 모달 닫기
 * - Enter 키 로그인, Google OAuth2 리다이렉트
 */
import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";

export const useLogin = (onClose: () => void, onOpenSignup: () => void) => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  /** 입력값 변경 핸들러 (name 속성 기반 동적 바인딩) */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Enter 키 입력 시 지정된 액션 실행 */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void,
  ) => {
    if (e.key === "Enter") action();
  };

  /** 로그인 실행: 성공 시 폼 초기화 및 모달 닫기 */
  const handleLoginSubmit = async () => {
    try {
      await login(loginForm);
      setLoginForm({ email: "", password: "" });
      onClose();
    } catch (e) {
    }
  };

  /** Google OAuth2 로그인: Spring Security 엔드포인트로 리다이렉트 */
  const handleGoogleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  const handleSignupClick = () => {
    onClose();
    if (onOpenSignup) {
      onOpenSignup();
    }
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
