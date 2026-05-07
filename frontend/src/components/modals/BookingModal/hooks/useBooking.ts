/**
 * 입장권(종일권) 예매 모달 상태 관리 훅
 *
 * 달력 생성 → 날짜 선택 → 인원 선택 → 결제 → 예매 확정의
 * 4단계 흐름을 관리한다. step 2(시간 선택)는 종일권 정책상 건너뛴다.
 */
import { useState, useEffect } from "react";
import { createReservation } from "../../../../api/reservationApi";

interface CalendarData {
  year: number;
  month: number;
  /** null은 달력 첫 행의 빈 칸 (이전 달 날짜 자리) */
  days: (number | null)[];
}

/** 요일 인덱스 0=일, 1=월 기준으로 월요일 여부 반환 */
const isMonday = (year: number, month: number, day: number): boolean =>
  new Date(year, month - 1, day).getDay() === 1;

/**
 * 현재 월의 달력 데이터 생성.
 * 첫 주 앞쪽 빈 칸은 null로 채워 요일 정렬을 맞춘다.
 */
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

/**
 * @param isOpen 모달 열림 여부 - true가 될 때 상태를 초기화한다
 */
export const useBooking = (isOpen: boolean) => {
  const [step, setStep] = useState(1);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });
  const [showPayment, setShowPayment] = useState(false);

  // 모달이 열릴 때마다 달력·선택 상태를 초기화하고 스크롤을 잠근다.
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

  /** 매주 월요일은 정기 휴관일 - 달력에서 선택 불가 처리 */
  const isClosedDay = (day: number) =>
    calendarData ? isMonday(calendarData.year, calendarData.month, day) : false;

  /** 성인 35,000원 / 청소년 29,000원 단가 정책에 따른 합산 금액 */
  const totalPrice = counts.adult * 35000 + counts.teen * 29000;

  const handleCountChange = (type: "adult" | "teen", delta: number) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  /**
   * 단계 진행 핸들러.
   * step 1(날짜) → step 3(인원): 종일권은 시간 선택(step 2)이 불필요하므로 건너뛴다.
   * step 3(인원) → step 4(확인): 1인 이상 선택 시에만 진행 허용.
   * step 4(확인) → 결제 모달 표시.
   */
  const handleNext = () => {
    if (step === 1 && selectedDate) setStep(3);
    else if (step === 3 && totalPrice > 0) setStep(4);
    else if (step === 4) setShowPayment(true);
  };

  const handlePrev = () => {
    // step 3에서 이전으로 가면 step 2를 건너뛰고 step 1로 돌아간다.
    setStep(step === 3 ? 1 : step - 1);
  };

  /**
   * 결제 완료 후 예매 생성 API 호출.
   * 결제와 예매 생성의 순서를 보장하기 위해 결제 모달의 성공 콜백에서 호출된다.
   */
  const handlePaymentSuccess = async () => {
    if (!calendarData || !selectedDate) return;
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
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) alert("로그인이 필요합니다.");
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
