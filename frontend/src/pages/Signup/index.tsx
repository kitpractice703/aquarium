import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../../components/common/LoginModal";
import PasswordResetModal from "../../components/common/PasswordResetModal";

const Signup = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // 회원가입 폼 상태
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  // 모달 상태
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // 로그인 시 메인으로 이동
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
      await api.post("/auth/signup", {
        email: form.email,
        password: form.password,
        username: form.username,
        phone: form.phone,
        role: "USER",
      });
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data || "회원가입 실패");
    }
  };

  // 모달 핸들러
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openReset = () => {
    setIsLoginOpen(false);
    setIsResetOpen(true);
  };
  const closeReset = () => setIsResetOpen(false);

  const switchResetToLogin = () => {
    setIsResetOpen(false);
    setIsLoginOpen(true);
  };

  return (
    // [FIX] 여기서 SignupContainer와 FormCard를 사용하여 레이아웃 복구
    <S.SignupContainer>
      <S.FormCard>
        <S.Title>회원가입</S.Title>
        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label>이름 (닉네임)</S.Label>
            <S.Input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="홍길동"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>이메일</S.Label>
            <S.Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>비밀번호</S.Label>
            <S.Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상 입력"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>비밀번호 확인</S.Label>
            <S.Input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>전화번호</S.Label>
            <S.Input
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </S.InputGroup>

          <S.SubmitButton type="submit">가입하기</S.SubmitButton>
        </S.Form>

        <S.LoginLink>
          이미 계정이 있으신가요? <span onClick={openLogin}>로그인</span>
        </S.LoginLink>

        {/* 모달 */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLogin}
          onOpenSignup={closeLogin}
          onOpenReset={openReset}
        />

        <PasswordResetModal
          isOpen={isResetOpen}
          onClose={closeReset}
          onSwitchToLogin={switchResetToLogin}
        />
      </S.FormCard>
    </S.SignupContainer>
  );
};

export default Signup;
