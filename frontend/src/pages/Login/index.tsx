import { useNavigate } from "react-router-dom";
import * as S from "./style";

const Login = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.FormBox>
        <S.Title>LOGIN</S.Title>
        <S.Input type="text" placeholder="아이디" />
        <S.Input type="password" placeholder="비밀번호" />
        <S.Button onClick={() => alert("로그인 기능 준비중입니다!")}>
          로그인
        </S.Button>
        <S.LinkText onClick={() => navigate("/signup")}>
          아직 회원이 아니신가요? 회원가입
        </S.LinkText>
        <S.LinkText onClick={() => navigate("/")}>메인으로 돌아가기</S.LinkText>
      </S.FormBox>
    </S.Container>
  );
};

export default Login;
