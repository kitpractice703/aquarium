import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";

export const useLogin = (onClose: () => void, onOpenSignup: () => void) => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

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
      setLoginForm({ email: "", password: "" });
      onClose();
    } catch (e) {
      // 에러 처리는 AuthContext alert
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  const handleSignupClick = () => {
    onClose(); // 로그인 창 닫고
    if (onOpenSignup) {
      onOpenSignup(); // 회원가입 창 열기 (함수가 있을 때만 실행)
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
