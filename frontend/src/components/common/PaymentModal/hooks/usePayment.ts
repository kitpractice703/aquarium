import { useState, useEffect } from "react";

// [수정 1] 외부에서 onSuccess 함수를 받아옵니다.
export const usePayment = (isOpen: boolean, onSuccess: () => void) => {
  const [step, setStep] = useState<"INPUT" | "PROCESSING" | "SUCCESS">("INPUT");

  // [보너스 수정] 모달이 닫혔다가 다시 열리면 'INPUT' 상태로 초기화해주는 센스!
  useEffect(() => {
    if (isOpen) {
      setStep("INPUT");
    }
  }, [isOpen]);

  const handlePayment = () => {
    setStep("PROCESSING");

    // 1.5초 뒤 성공
    setTimeout(() => {
      setStep("SUCCESS");

      // 1초 뒤 부모에게 알림 (이제 onSuccess가 뭔지 앎!)
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1500);
  };

  // 객체로 반환
  return {
    step,
    handlePayment,
  };
};
