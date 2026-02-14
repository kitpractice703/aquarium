/**
 * 결제 로직 커스텀 훅
 * - INPUT → PROCESSING(1.5초) → SUCCESS(1초 후 onSuccess 호출)
 * - 시뮬레이션 결제: setTimeout으로 결제 프로세스 시각화
 */
import { useState, useEffect } from "react";

export const usePayment = (isOpen: boolean, onSuccess: () => void) => {
  const [step, setStep] = useState<"INPUT" | "PROCESSING" | "SUCCESS">("INPUT");

  /** 모달 열림 시 초기 상태로 리셋 */
  useEffect(() => {
    if (isOpen) {
      setStep("INPUT");
    }
  }, [isOpen]);

  /** 결제 실행: 1.5초 승인 → 1초 후 성공 콜백 */
  const handlePayment = () => {
    setStep("PROCESSING");

    setTimeout(() => {
      setStep("SUCCESS");

      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1500);
  };

  return {
    step,
    handlePayment,
  };
};
