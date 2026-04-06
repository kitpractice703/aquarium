/** 입장권 예약 모달 - 달력 생성, 인원/금액 계산, 결제 후 예약 API 호출 */
import { useState, useEffect } from "react";
import { createReservation } from "../../../../api/reservationApi";

const isMonday = (year: number, month: number, day: number): boolean =>
  new Date(year, month - 1, day).getDay() === 1;

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

export const useBooking = (isOpen: boolean, _onClose: () => void) => {
  const [step, setStep] = useState(1);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });
  const [showPayment, setShowPayment] = useState(false);

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

  const isClosedDay = (day: number) =>
    calendarData ? isMonday(calendarData.year, calendarData.month, day) : false;

  // 성인 35,000원 + 청소년 29,000원
  const totalPrice = counts.adult * 35000 + counts.teen * 29000;

  const handleCountChange = (type: "adult" | "teen", delta: number) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  // Step 2(시간 선택)는 종일권이므로 생략하고 Step 1 → Step 3으로 진행
  const handleNext = () => {
    if (step === 1 && selectedDate) setStep(3);
    else if (step === 3 && totalPrice > 0) setStep(4);
    else if (step === 4) setShowPayment(true);
  };

  const handlePrev = () => {
    setStep(step === 3 ? 1 : step - 1);
  };

  const handlePaymentSuccess = async () => {
    try {
      const year = calendarData.year;
      const month = String(calendarData.month).padStart(2, "0");
      const day = String(selectedDate).padStart(2, "0");
      await createReservation({
        visitDate: `${year}-${month}-${day}`,
        visitTime: "종일권",
        adultCount: counts.adult,
        teenCount: counts.teen,
      });
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
    isClosedDay,
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
