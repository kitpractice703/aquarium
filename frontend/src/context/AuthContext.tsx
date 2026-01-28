import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
      const response = await axios.get("/api/auth/me");
      if (response.status === 200) {
        setIsLoggedIn(true);

        // [FIX] 여기서 에러가 났을 겁니다! 객체인지 확인하고 이름만 꺼냅니다.
        const data = response.data;
        if (typeof data === "string") {
          setUsername(data);
        } else if (typeof data === "object" && data !== null) {
          // 백엔드에서 주는 필드명에 맞춰 수정 (예: username, name, email 등)
          setUsername(data.username || data.name || data.email || "사용자");
        } else {
          setUsername("알 수 없음");
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
