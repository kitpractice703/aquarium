/** 전역 인증 상태 관리 컨텍스트 - 세션 기반 로그인/로그아웃 처리 */
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

  const checkLoginStatus = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.status === 200) {
        setIsLoggedIn(true);
        const data = response.data;
        // 응답이 이메일 문자열이거나 사용자 객체인 경우 모두 처리
        if (typeof data === "string") {
          setUsername(data);
        } else if (typeof data === "object" && data !== null) {
          setUsername(data.username || data.name || data.email || "회원");
        }
      }
    } catch {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  // 새로고침 후 세션 유지를 위해 마운트 시 인증 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

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

/** AuthProvider 외부에서 호출 시 에러를 던져 컨텍스트 누락을 조기에 감지 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
