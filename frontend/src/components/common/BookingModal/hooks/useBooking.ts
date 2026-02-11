import { useState, useEffect } from "react";
import { api } from "../../../../api/axios";

// 달력 데이터 생성 헬퍼 함수 (Hook 밖이나 utils로 빼도 됨)
const getCalendarDays = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);
  return { year, month: month + 1, days };
};

export const useBooking = (isOpen: boolean, onClose: () => void) => {
  const [step, setStep] = useState(1); // 1:날짜 -> 3:인원 (2:시간 건너뜀)
  const [calendarData, setCalendarData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });
  const [showPayment, setShowPayment] = useState(false);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setCalendarData(getCalendarDays());
      setStep(1);
      setSelectedDate(null);
      setCounts({ adult: 0, teen: 0 });
      setShowPayment(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const totalPrice = counts.adult * 35000 + counts.teen * 29000;

  // 인원 증감 핸들러
  const handleCountChange = (type: "adult" | "teen", delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  // 다음 단계 이동 핸들러
  const handleNext = () => {
    if (step === 1 && selectedDate) {
      setStep(3); // 관람권은 시간 선택 없이 인원 선택으로 점프
    } else if (step === 3 && totalPrice > 0) {
      setStep(4); // 확인창
    } else if (step === 4) {
      setShowPayment(true);
    }
  };

  // 이전 단계 이동 핸들러
  const handlePrev = () => {
    setStep(step === 3 ? 1 : step - 1);
  };

  // 결제 성공 핸들러
  const handlePaymentSuccess = async () => {
    try {
      const year = calendarData.year;
      const month = String(calendarData.month).padStart(2, "0");
      const day = String(selectedDate).padStart(2, "0");

      await api.post("/reservations", {
        visitDate: `${year}-${month}-${day}`,
        visitTime: "종일권",
        adultCount: counts.adult,
        teenCount: counts.teen,
      });

      alert("예매가 완료되었습니다!");
      onClose();
    } catch (error: any) {
      if (error.response?.status === 401) alert("로그인이 필요합니다.");
      else alert("예매 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    step,
    calendarData,
    selectedDate,
    setSelectedDate,
    counts,
    handleCountChange,
    totalPrice,
    showPayment,
    setShowPayment,
    handleNext,
    handlePrev,
    handlePaymentSuccess,
  };
};
