import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";

export const useLogin = (onClose: () => void, onOpenSignup: () => void) => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === "Enter") action();
  };

  const handleLoginSubmit = async () => {
    try {
      await login(loginForm);
      setLoginForm({ email: "", password: "" });
      onClose();
    } catch {
      // 에러 처리는 AuthContext.login() 내부에서 alert 처리
    }
  };

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
