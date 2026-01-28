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
      const response = await api.get("/auth/me"); // api 인스턴스 사용
      if (response.status === 200) {
        setIsLoggedIn(true);
        // [FIX] 안전하게 이름만 꺼내오기
        const data = response.data;
        if (typeof data === "string") {
          setUsername(data);
        } else if (typeof data === "object" && data !== null) {
          // 백엔드가 { email: "...", name: "..." } 형태로 줄 경우 대비
          setUsername(data.username || data.name || data.email || "회원");
        }
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (loginData: LoginData) => {
    try {
      await api.post("/auth/login", loginData); // api 인스턴스 사용
      await checkLoginStatus();
      alert("로그인되었습니다!");
    } catch (error) {
      alert("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // api 인스턴스 사용
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
