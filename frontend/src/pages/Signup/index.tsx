import { useNavigate } from "react-router-dom";
import * as S from "./style";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.FormBox>
        <S.Title>SIGN UP</S.Title>

        <S.InputGroup>
          <S.Label>이름</S.Label>
          <S.Input type="text" placeholder="홍길동" />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>아이디</S.Label>
          <S.Input type="text" placeholder="사용할 아이디를 입력하세요" />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.Input type="password" placeholder="비밀번호 입력" />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>비밀번호 확인</S.Label>
          <S.Input type="password" placeholder="비밀번호 재입력" />
        </S.InputGroup>

        <S.Button onClick={() => alert("회원가입 기능 준비중입니다!")}>
          가입하기
        </S.Button>

        <div
          style={{
            marginTop: "20px",
            color: "#888",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={() => navigate("/login")}
        >
          이미 계정이 있으신가요? 로그인
        </div>
      </S.FormBox>
    </S.Container>
  );
};

export default Signup;
