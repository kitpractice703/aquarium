import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, me } from "../api/authApi";

interface LoginData {
  email: string;
  password: string;
}

type ModalType = "LOGIN" | "NOTICE" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  isResetOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openResetModal: () => void;
  closeResetModal: () => void;
  switchResetToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const openLoginModal = () => setModalType("LOGIN");
  const closeLoginModal = () => setModalType(null);
  const openResetModal = () => { setModalType(null); setIsResetOpen(true); };
  const closeResetModal = () => setIsResetOpen(false);
  const switchResetToLogin = () => { setIsResetOpen(false); setModalType("LOGIN"); };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUsername(null);
      return;
    }
    try {
      const data = await me();
      setIsLoggedIn(true);
      if (typeof data === "string") {
        setUsername(data);
      } else if (typeof data === "object" && data !== null) {
        setUsername(data.username || data.name || data.email || "회원");
      }
    } catch {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    // Google OAuth2 로그인 후 ?token= 파라미터로 JWT 전달됨
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    checkLoginStatus();
  }, []);

  const login = async (loginData: LoginData) => {
    try {
      const data = await loginApi(loginData);
      localStorage.setItem("token", data.token);
      await checkLoginStatus();
      alert("로그인되었습니다!");
    } catch (error) {
      alert("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUsername(null);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, username, login, logout,
      modalType, setModalType,
      isResetOpen,
      openLoginModal, closeLoginModal,
      openResetModal, closeResetModal,
      switchResetToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
