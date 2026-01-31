// frontend/src/components/common/PasswordResetModal/index.tsx
import React, { useState } from "react";
import * as S from "./style";
import Modal from "../Modal";
import { checkUserForReset, resetPassword } from "../../../api/authApi";

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
  const [step, setStep] = useState<"VERIFY" | "RESET">("VERIFY");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 상태 초기화
  const handleClose = () => {
    setStep("VERIFY");
    setEmail("");
    setPhone("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  // [ADDED] 전화번호 자동 하이픈 및 숫자만 입력 로직
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
    let formattedValue = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    // 최대 13자리(하이픈 포함)까지만 입력
    if (formattedValue.length <= 13) {
      setPhone(formattedValue);
    }
  };

  // 1단계: 본인 확인
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return alert("이메일과 전화번호를 입력해주세요.");
    if (phone.length < 13) return alert("전화번호를 올바르게 입력해주세요.");

    try {
      // 이제 phone 변수에 하이픈이 포함되어 서버로 전송됩니다 (예: 010-1234-5678)
      await checkUserForReset(email, phone);
      alert("본인 확인되었습니다. 새 비밀번호를 설정해주세요.");
      setStep("RESET");
    } catch (error: any) {
      alert(error.response?.data || "일치하는 정보를 찾을 수 없습니다.");
    }
  };

  // 2단계: 비밀번호 변경
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (newPassword.length < 4)
      return alert("비밀번호는 4자 이상이어야 합니다.");

    try {
      await resetPassword(email, newPassword);
      alert("비밀번호가 변경되었습니다! 로그인해주세요.");
      handleClose();
      onSwitchToLogin(); // 로그인창으로 이동
    } catch (error: any) {
      alert("비밀번호 변경 실패: " + (error.response?.data || "오류 발생"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="비밀번호 찾기">
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
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>전화번호</S.Label>
              <S.InputBox
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange} // 하이픈 자동 적용 함수 연결
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
              <S.InputBox
                type="password"
                placeholder="4자 이상 입력"
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
    </Modal>
  );
};

export default PasswordResetModal;
