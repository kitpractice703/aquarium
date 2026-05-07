/**
 * 인증 전역 상태 관리 (Context API)
 *
 * 로컬 스토리지 JWT 토큰을 기준으로 세션을 복원하고,
 * 로그인·로그아웃·모달 제어 상태를 앱 전역에 공급한다.
 * Google OAuth2 콜백 처리도 이 컨텍스트에서 담당한다.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, me } from "../api/authApi";
import type { UserInfo } from "../types/api";

interface LoginData {
  email: string;
  password: string;
}

/** 로그인 모달과 이용약관 안내 모달을 구분하기 위한 타입 */
type ModalType = "LOGIN" | "NOTICE" | null;

/** AuthContext 를 통해 공급되는 전역 인증 상태 및 제어 함수 */
interface AuthContextType {
  isLoggedIn: boolean;
  /** 앱 초기 로딩 시 토큰 검증이 완료되기 전까지 true */
  isLoading: boolean;
  username: string | null;
  role: "USER" | "ADMIN" | null;
  /** role === "ADMIN" 파생값 - 관리자 접근 제어에 사용 */
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  isResetOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openResetModal: () => void;
  closeResetModal: () => void;
  /** 비밀번호 재설정 모달 → 로그인 모달로 전환 */
  switchResetToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<"USER" | "ADMIN" | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const openLoginModal = () => setModalType("LOGIN");
  const closeLoginModal = () => setModalType(null);
  // 비밀번호 재설정 모달을 열 때 로그인 모달을 먼저 닫아 중첩을 방지한다.
  const openResetModal = () => { setModalType(null); setIsResetOpen(true); };
  const closeResetModal = () => setIsResetOpen(false);
  const switchResetToLogin = () => { setIsResetOpen(false); setModalType("LOGIN"); };

  /**
   * 앱 최초 진입 시 로컬 토큰 존재 여부를 기준으로 세션 복원 시도.
   * /auth/me 로 서버 검증 후 성공하면 사용자 정보를 상태에 저장하고,
   * 토큰이 만료·변조된 경우에는 즉시 제거해 인증 상태를 초기화한다.
   */
  const checkLoginStatus = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      setIsLoading(false);
      return;
    }
    try {
      const data: UserInfo = await me();
      setIsLoggedIn(true);
      setUsername(data.username || data.email || "회원");
      setRole(data.role || "USER");
    } catch {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Google OAuth2 로그인 성공 후 백엔드가 쿼리스트링으로 전달한 token을 저장하고
    // URL을 깔끔하게 정리한다 (브라우저 히스토리에 토큰이 남지 않도록).
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    checkLoginStatus();
  }, []);

  /**
   * 이메일·비밀번호 로그인.
   * 서버로부터 받은 JWT를 localStorage에 저장한 뒤 세션 복원을 수행한다.
   * 에러 발생 시 AuthContext 내부에서 alert 처리 후 호출부로 예외를 다시 던진다.
   */
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

  /**
   * 로그아웃.
   * 서버 세션 무효화 후 로컬 토큰을 제거하고 홈으로 이동한다.
   * 비밀번호 변경 후 강제 로그아웃 흐름에서도 동일하게 사용된다.
   */
  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, isLoading, username, role, isAdmin: role === "ADMIN",
      login, logout,
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

/**
 * AuthContext 소비 훅.
 * AuthProvider 외부에서 호출하면 즉시 에러를 발생시켜 잘못된 사용을 방지한다.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
