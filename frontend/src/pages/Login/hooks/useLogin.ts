import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (error) {
      console.error("로그인 시도 중 에러 발생:", error);
    }
  };
  return {
    formData,
    handleChange,
    handleKeyDown,
    handleLogin,
    navigate,
  };
};
