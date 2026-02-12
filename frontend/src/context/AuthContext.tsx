/**
 * 전역 인증 컨텍스트 (AuthContext)
 * - 로그인 상태(isLoggedIn), 사용자명(username) 전역 관리
 * - 페이지 로드 시 /api/auth/me로 세션 유효성 자동 확인
 * - login(): 로그인 처리 및 상태 갱신
 * - logout(): 세션 무효화 및 홈으로 리다이렉트
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/axios";

interface LoginData {
  email: string;
  password?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  /** 서버에 현재 세션의 로그인 상태 확인 */
  const checkLoginStatus = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.status === 200) {
        setIsLoggedIn(true);
        const data = response.data;
        // 응답 형식에 따라 사용자명 추출 (문자열 or 객체)
        if (typeof data === "string") {
          setUsername(data);
        } else if (typeof data === "object" && data !== null) {
          setUsername(data.username || data.name || data.email || "회원");
        }
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  // 컴포넌트 마운트 시 세션 확인 (새로고침 대응)
  useEffect(() => {
    checkLoginStatus();
  }, []);

  /** 로그인 처리: API 호출 → 세션 상태 갱신 → 알림 */
  const login = async (loginData: LoginData) => {
    try {
      await api.post("/auth/login", loginData);
      await checkLoginStatus();
      alert("로그인되었습니다!");
    } catch (error) {
      alert("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      throw error;
    }
  };

  /** 로그아웃 처리: 세션 무효화 → 상태 초기화 → 홈 리다이렉트 */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLoggedIn(false);
      setUsername(null);
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** 인증 컨텍스트 커스텀 훅 (AuthProvider 외부에서 사용 시 에러 발생) */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
