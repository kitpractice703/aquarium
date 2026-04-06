/** 결제 시뮬레이션 - INPUT → PROCESSING(1.5s) → SUCCESS 상태 전이 */
import { useState, useEffect } from "react";

export const usePayment = (isOpen: boolean, onSuccess: () => void) => {
  const [step, setStep] = useState<"INPUT" | "PROCESSING" | "SUCCESS">("INPUT");

  useEffect(() => {
    if (isOpen) setStep("INPUT");
  }, [isOpen]);

  const handlePayment = () => {
    setStep("PROCESSING");
    setTimeout(() => {
      setStep("SUCCESS");
      setTimeout(() => onSuccess(), 1000);
    }, 1500);
  };

  return { step, handlePayment };
};
