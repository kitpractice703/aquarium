/**
 * 회원가입 폼 상태 관리 훅
 *
 * 폼 유효성 검사(이메일 형식, 비밀번호 길이·일치, 필수 입력)를
 * 클라이언트 측에서 1차로 수행한 뒤 서버로 요청을 전달한다.
 * 이미 로그인된 사용자가 접근하면 홈으로 리다이렉트한다.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { signup } from "../../../api/authApi";

export const useSignup = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  // 이미 로그인된 상태에서 회원가입 페이지 접근 시 홈으로 리다이렉트한다.
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 전화번호 자동 하이픈 포맷터.
   * 숫자만 추출한 뒤 자리 수에 따라 하이픈을 삽입하고,
   * 최대 11자리(010-0000-0000 = 13자)로 제한한다.
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    if (formattedValue.length <= 13) {
      setForm((prev) => ({ ...prev, phone: formattedValue }));
    }
  };

  /**
   * 회원가입 제출.
   * 클라이언트 유효성 검사 통과 후 서버에 요청하고,
   * 성공 시 홈으로 이동해 로그인 모달을 열 수 있도록 유도한다.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.includes("@"))
      return alert("올바른 이메일 형식이 아닙니다.");
    if (form.password.length < 8)
      return alert("비밀번호는 8자 이상이어야 합니다.");
    if (form.password !== form.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!form.username) return alert("이름을 입력해주세요.");
    if (!form.phone) return alert("전화번호를 입력해주세요.");

    try {
      await signup({
        email: form.email,
        password: form.password,
        username: form.username,
        phone: form.phone,
      });
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data || "회원가입 실패");
    }
  };

  return {
    form,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    openLoginModal,
  };
};
