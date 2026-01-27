// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// ✅ 1. 로그인 데이터 타입 정의 (any 에러 해결)
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

  // ✅ 2. 함수 위치 변경 (useEffect보다 위로! 에러 해결)
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.status === 200) {
        setIsLoggedIn(true);
        setUsername(response.data); // 백엔드에서 이름 줌
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  // 3. 이제 함수가 정의된 후에 호출하므로 에러 없음
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (loginData: LoginData) => {
    try {
      await axios.post("/api/auth/login", loginData);
      await checkLoginStatus();
      alert("로그인되었습니다!");
    } catch (error) {
      alert("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
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
