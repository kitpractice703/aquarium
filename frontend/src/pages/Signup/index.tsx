/**
 * 회원가입 페이지
 *
 * 이름·이메일·비밀번호·전화번호를 입력받아 회원가입을 처리한다.
 * 폼 상태와 유효성 검사는 useSignup 훅에서 관리한다.
 */
import * as S from "./style";
import { useSignup } from "./hooks/useSignup";

const Signup = () => {
  const {
    form,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    openLoginModal,
  } = useSignup();

  return (
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

        {/* 이미 계정이 있는 사용자를 위한 로그인 모달 바로 열기 */}
        <S.LoginLink>
          이미 계정이 있으신가요? <span onClick={openLoginModal}>로그인</span>
        </S.LoginLink>
      </S.FormCard>
    </S.SignupContainer>
  );
};

export default Signup;
