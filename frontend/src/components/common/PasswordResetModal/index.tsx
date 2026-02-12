import * as S from "./style";
import CommonModal from "../Modal";
import { usePasswordReset } from "./hooks/usePasswordReset";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const PasswordResetModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}: PasswordResetModalProps) => {
  const {
    step,
    email,
    setEmail,
    phone,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    newPasswordRef,
    handleClose,
    handlePhoneChange,
    handleVerify,
    handleReset,
  } = usePasswordReset(onClose, onSwitchToLogin);
  return (
    <CommonModal isOpen={isOpen} onClose={handleClose} title="비밀번호 찾기">
      <S.Container>
        {step === "VERIFY" ? (
          <S.Form onSubmit={handleVerify}>
            <S.Description>
              가입 시 등록한 <strong>이메일</strong>과 <strong>전화번호</strong>
              를 입력해주세요.
            </S.Description>

            <S.InputGroup>
              <S.Label>이메일</S.Label>
              <S.InputBox
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>전화번호</S.Label>
              <S.InputBox
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
              />
            </S.InputGroup>

            <S.SubmitButton type="submit">본인 확인</S.SubmitButton>
          </S.Form>
        ) : (
          <S.Form onSubmit={handleReset}>
            <S.Description>새로 사용할 비밀번호를 입력해주세요.</S.Description>

            <S.InputGroup>
              <S.Label>새 비밀번호</S.Label>
              {/* [MODIFIED] Ref 연결 */}
              <S.InputBox
                ref={newPasswordRef}
                type="password"
                placeholder="8자 이상 입력"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>새 비밀번호 확인</S.Label>
              <S.InputBox
                type="password"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </S.InputGroup>

            <S.SubmitButton type="submit">비밀번호 변경하기</S.SubmitButton>
          </S.Form>
        )}
        <S.BackLink onClick={onSwitchToLogin}>로그인으로 돌아가기</S.BackLink>
      </S.Container>
    </CommonModal>
  );
};

export default PasswordResetModal;
