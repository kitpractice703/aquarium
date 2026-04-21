import CommonModal from "../Modal";
import { useLogin } from "./hooks/useLogin";
import googleIcon from "../../../assets/images/google_icon.png";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenReset: () => void;
}

const LoginModal = ({ isOpen, onClose, onOpenReset, onOpenSignup }: Props) => {
  const {
    loginForm,
    handleInputChange,
    handleKeyDown,
    handleLoginSubmit,
    handleGoogleLogin,
  } = useLogin(onClose, onOpenSignup);

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="로그인">
      <S.InputGroup>
        <S.Label>이메일</S.Label>
        <S.InputBox
          type="text"
          name="email"
          value={loginForm.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          onKeyDown={(e) => handleKeyDown(e, handleLoginSubmit)}
        />
      </S.InputGroup>
      <S.InputGroup>
        <S.Label>비밀번호</S.Label>
        <S.InputBox
          type="password"
          name="password"
          value={loginForm.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          onKeyDown={(e) => handleKeyDown(e, handleLoginSubmit)}
        />
      </S.InputGroup>

      <S.BtnAction onClick={handleLoginSubmit}>로그인</S.BtnAction>

      <S.GoogleBtn onClick={handleGoogleLogin}>
        <img src={googleIcon} alt="Google" width={18} height={18} />
        Google로 로그인하기
      </S.GoogleBtn>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <S.ResetLink
          onClick={() => {
            onClose();
            onOpenReset();
          }}
        >
          비밀번호를 잊으셨나요?
        </S.ResetLink>
      </div>
      <S.SignupLink>
        계정이 없으신가요?{" "}
        <span
          onClick={() => {
            onClose();
            onOpenSignup();
          }}
        >
          회원가입
        </span>
      </S.SignupLink>
    </CommonModal>
  );
};

export default LoginModal;
