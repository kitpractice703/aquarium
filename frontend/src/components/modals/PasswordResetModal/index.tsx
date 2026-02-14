/**
 * 비밀번호 재설정 모달
 * - 2단계 프로세스: VERIFY(본인 확인) → RESET(새 비밀번호 설정)
 * - 본인 확인: 이메일 + 전화번호 검증
 * - 완료 후 로그인 모달로 전환
 */
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
        {/* 1단계: 이메일 + 전화번호로 본인 확인 */}
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
          /* 2단계: 새 비밀번호 입력 및 확인 */
          <S.Form onSubmit={handleReset}>
            <S.Description>새로 사용할 비밀번호를 입력해주세요.</S.Description>

            <S.InputGroup>
              <S.Label>새 비밀번호</S.Label>
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
