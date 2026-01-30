import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import * as S from "./style";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  // [ADDED] 전화번호 자동 포맷팅 함수 (숫자만 남기고 하이픈 추가)
  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거

    if (raw.length <= 3) {
      return raw;
    } else if (raw.length <= 7) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      // 010-1234-5678 (11자리 제한은 maxLength에서 처리)
      return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
  };

  // [ADDED] 전화번호 전용 변경 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setErrorMsg("");
  };

  // 엔터키 누르면 가입 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.nickname ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setErrorMsg("모든 필드를 입력해주세요.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.password.length < 4) {
      setErrorMsg("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }

    try {
      await api.post("/auth/signup", {
        username: formData.nickname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/");
    } catch (err: any) {
      console.error(err);

      if (err.response && err.response.status === 409) {
        alert("이미 가입된 아이디(이메일)입니다. 로그인해주세요.");
        navigate("/");
      } else if (err.response && err.response.data) {
        setErrorMsg(
          err.response.data.message || "회원가입 중 오류가 발생했습니다.",
        );
      } else {
        setErrorMsg("서버 연결에 실패했습니다.");
      }
    }
  };

  return (
    <S.SignupContainer onMouseDown={handleOverlayClick}>
      <S.FormCard>
        <S.CloseBtn onClick={() => navigate("/")}>&times;</S.CloseBtn>

        <S.Title>회원가입</S.Title>

        <S.InputGroup>
          <S.Label>닉네임</S.Label>
          <S.Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="사용하실 닉네임을 입력하세요"
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>이메일 (아이디)</S.Label>
          <S.Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="example@email.com"
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="8자리 이상 입력하세요"
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>비밀번호 확인</S.Label>
          <S.Input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="비밀번호를 한 번 더 입력하세요"
          />
        </S.InputGroup>

        {/* [MODIFIED] 전화번호 입력 필드 수정 (핸들러 교체 및 maxLength 추가) */}
        <S.InputGroup>
          <S.Label>전화번호</S.Label>
          <S.Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange} // [변경] 전용 핸들러 사용
            onKeyDown={handleKeyDown}
            placeholder="숫자만 입력 가능합니다."
            maxLength={13} // [추가] 13자리(하이픈 포함) 입력 제한
          />
        </S.InputGroup>

        {errorMsg && <S.ErrorMsg>{errorMsg}</S.ErrorMsg>}

        <S.SubmitBtn onClick={handleSubmit}>가입하기</S.SubmitBtn>

        <S.LinkText>
          이미 계정이 있으신가요?
          <span
            onClick={() => {
              alert("우측 상단의 로그인 버튼을 이용해주세요.");
              navigate("/");
            }}
          >
            로그인
          </span>
        </S.LinkText>
      </S.FormCard>
    </S.SignupContainer>
  );
};

export default Signup;
