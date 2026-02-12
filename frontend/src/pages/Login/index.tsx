import * as S from "./style";
import { useLogin } from "./hooks/useLogin";

const Login = () => {
  const { formData, handleChange, handleKeyDown, handleLogin, navigate } =
    useLogin();

  return (
    <S.Container>
      <S.FormBox>
        <S.Title>LOGIN</S.Title>

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
