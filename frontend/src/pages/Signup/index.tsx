import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // [NEW] 엔터키 누르면 가입 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // [NEW] 배경 클릭 시 메인으로 이동 (모달 닫기 효과)
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
    if (formData.password !== formData.passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.password.length < 4) {
      setErrorMsg("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }

    try {
      await axios.post("/api/auth/signup", {
        username: formData.nickname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        setErrorMsg(
          err.response.data.message || "회원가입 중 오류가 발생했습니다.",
        );
      } else {
        setErrorMsg("서버 연결에 실패했습니다.");
      }
    }
  };

  return (
    // 배경에 클릭 이벤트 추가
    <S.SignupContainer onClick={handleOverlayClick}>
      <S.FormCard>
        {/* [NEW] 우측 상단 닫기(X) 버튼 */}
        <S.CloseBtn onClick={() => navigate("/")}>&times;</S.CloseBtn>

        <S.Title>회원가입</S.Title>

        <S.InputGroup>
          <S.Label>닉네임</S.Label>
          <S.Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // 엔터키 연결
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
            placeholder="4자리 이상 입력하세요"
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

        <S.InputGroup>
          <S.Label>전화번호</S.Label>
          <S.Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="010-0000-0000"
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
