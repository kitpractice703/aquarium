import React, { useState } from "react"; // [MODIFIED] 상태 관리를 위해 useState 추가
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // [ADDED] 만들어둔 인증 훅 가져오기
import * as S from "./style";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // [ADDED] AuthContext에서 login 함수 꺼내오기

  // [ADDED] 사용자의 입력을 저장할 그릇(State) 준비
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // [ADDED] 입력값이 바뀔 때마다 State에 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // [ADDED] 엔터키를 눌렀을 때도 로그인이 되도록 편의성 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // [ADDED] 실제 로그인 로직 수행
  const handleLogin = async () => {
    // 1. 빈 값 체크 (기본적인 유효성 검사)
    if (!formData.email || !formData.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 2. AuthContext의 login 함수 호출
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      // 성공 시 AuthContext 내부에서 alert 띄우고 상태 업데이트 함
      navigate("/"); // 메인으로 이동
    } catch (error) {
      // 실패 시 AuthContext에서 에러를 던지므로(throw) 여기서 잡을 수도 있음
      // 현재는 AuthContext 안에서 alert를 띄우도록 되어 있으므로 추가 조치 불필요
      console.error("로그인 시도 중 에러 발생:", error);
    }
  };

  return (
    <S.Container>
      <S.FormBox>
        <S.Title>LOGIN</S.Title>

        {/* [MODIFIED] 입력창에 State와 이벤트 연결 */}
        <S.Input
          type="text"
          name="email"
          placeholder="이메일 (아이디)"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <S.Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* [MODIFIED] 준비중 알림 대신 실제 로그인 함수 연결 */}
        <S.Button onClick={handleLogin}>로그인</S.Button>

        <S.LinkText onClick={() => navigate("/signup")}>
          아직 회원이 아니신가요? 회원가입
        </S.LinkText>
        <S.LinkText onClick={() => navigate("/")}>메인으로 돌아가기</S.LinkText>
      </S.FormBox>
    </S.Container>
  );
};

export default Login;
