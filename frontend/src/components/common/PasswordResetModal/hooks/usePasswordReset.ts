import { useState, useEffect, useRef } from "react";
import { checkUserForReset, resetPassword } from "../../../../api/authApi";

export const usePasswordReset = (
  onClose: () => void,
  onSwitchToLogin: () => void,
) => {
  const [step, setStep] = useState<"VERIFY" | "RESET">("VERIFY");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // [ADDED] 새 비밀번호 입력창을 가리킬 Ref 생성
  const newPasswordRef = useRef<HTMLInputElement>(null);

  // [ADDED] 단계가 'RESET'으로 바뀌면 새 비밀번호 입력창에 포커스
  useEffect(() => {
    if (step === "RESET" && newPasswordRef.current) {
      // 약간의 지연을 주어 렌더링이 확실히 끝난 뒤 실행 (안전장치)
      setTimeout(() => {
        newPasswordRef.current?.focus();
      }, 50);
    }
  }, [step]);

  const handleClose = () => {
    setStep("VERIFY");
    setEmail("");
    setPhone("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formattedValue = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    if (formattedValue.length <= 13) {
      setPhone(formattedValue);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return alert("이메일과 전화번호를 입력해주세요.");
    if (phone.length < 13) return alert("전화번호를 올바르게 입력해주세요.");

    try {
      await checkUserForReset(email, phone);
      alert("본인 확인되었습니다. 새 비밀번호를 설정해주세요.");
      setStep("RESET");
    } catch (error: any) {
      alert(error.response?.data || "일치하는 정보를 찾을 수 없습니다.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (newPassword.length < 8)
      return alert("비밀번호는 8자 이상이어야 합니다.");

    try {
      await resetPassword(email, newPassword);
      alert("비밀번호가 변경되었습니다! 로그인해주세요.");
      handleClose();
      onSwitchToLogin();
    } catch (error: any) {
      alert("비밀번호 변경 실패: " + (error.response?.data || "오류 발생"));
    }
  };
  return {
    step,
    email,
    setEmail,
    phone,
    setPhone,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    newPasswordRef,
    handleClose,
    handlePhoneChange,
    handleVerify,
    handleReset,
  };
};
