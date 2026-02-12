import * as S from "./style";
import LoginModal from "../../components/common/LoginModal";
import PasswordResetModal from "../../components/common/PasswordResetModal";
import { useSingup } from "./hooks/useSinup";

const Signup = () => {
  const {
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
  } = useSingup();

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
