/**
 * 회원가입 로직 커스텀 훅
 * - 폼 상태 관리 (이름, 이메일, 비밀번호, 전화번호)
 * - 전화번호 자동 하이픈 포맷팅 (010-0000-0000)
 * - 유효성 검증 후 회원가입 API 호출
 * - 로그인/비밀번호 재설정 모달 상태 관리
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { signup } from "../../../api/authApi";

export const useSignup = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  /** 회원가입 폼 상태 */
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  /** 이미 로그인된 상태면 메인으로 리다이렉트 */
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  /** 일반 입력 필드 변경 핸들러 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** 전화번호 자동 하이픈 포맷팅 (010-0000-0000) */
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

  /** 가입 제출: 유효성 검증 → API 호출 → 성공 시 메인으로 이동 */
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

  /* ── 모달 제어 ── */
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openReset = () => {
    setIsLoginOpen(false);
    setIsResetOpen(true);
  };
  const closeReset = () => setIsResetOpen(false);

  /** 비밀번호 재설정 → 로그인 모달로 전환 */
  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setIsLoginOpen(true);
  };

  return {
    form,
    isLoginOpen,
    isResetOpen,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    openLogin,
    closeLogin,
    openReset,
    closeReset,
    switchResetToLogin,
  };
};
