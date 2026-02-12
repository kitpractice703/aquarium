/**
 * 예매 모달 로직 커스텀 훅
 * - 달력 데이터 생성, 단계 진행, 인원/금액 계산, 결제 후 예약 API 호출
 * - 모달 열림 시 상태 초기화 + body 스크롤 잠금
 */
import { useState, useEffect } from "react";
import { api } from "../../../../api/axios";

/** 현재 월의 달력 데이터 생성 (요일 오프셋 포함) */
const getCalendarDays = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 1일의 요일 (0=일)
  const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null); // 빈 칸(오프셋)
  for (let i = 1; i <= lastDate; i++) days.push(i);
  return { year, month: month + 1, days };
};

export const useBooking = (isOpen: boolean, _onClose: () => void) => {
  const [step, setStep] = useState(1);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });
  const [showPayment, setShowPayment] = useState(false);

  /** 모달 열림/닫힘 시 상태 초기화 및 바디 스크롤 잠금/해제 */
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

  /** 총 금액 계산: 성인 35,000원 + 청소년 29,000원 */
  const totalPrice = counts.adult * 35000 + counts.teen * 29000;

  /** 인원 증감 (최소 0명) */
  const handleCountChange = (type: "adult" | "teen", delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  /** 다음 단계 진행: Step 1 → 3 → 4 → 결제 (Step 2 시간 선택 생략) */
  const handleNext = () => {
    if (step === 1 && selectedDate) {
      setStep(3);
    } else if (step === 3 && totalPrice > 0) {
      setStep(4);
    } else if (step === 4) {
      setShowPayment(true);
    }
  };

  const handlePrev = () => {
    setStep(step === 3 ? 1 : step - 1);
  };

  /** 결제 성공 시 백엔드 예약 API 호출 (visitTime: "종일권") */
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
