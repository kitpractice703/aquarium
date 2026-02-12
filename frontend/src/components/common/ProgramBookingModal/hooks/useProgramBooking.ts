/**
 * 프로그램 예약 로직 커스텀 훅
 * - 프로그램 목록 조회 (GET /api/programs)
 * - 날짜별 스케줄 조회 (GET /api/programs/{id}/schedules?date=)
 * - 내 예약 조회로 당일 관람권 보유 여부 확인
 * - 결제 성공 시 예약 API 호출 (POST /api/reservations/programs)
 */
import { useState, useEffect } from "react";
import { api } from "../../../../api/axios";
import type {
  Program,
  ProgramSchedule,
  ReservationDto,
} from "../../../../types/api";

/** 기본 시간 슬롯 (API 실패 시 폴백) */
const DEFAULT_TIME_SLOTS = ["10:00", "11:00", "13:00", "14:00", "15:00"];

export const useProgramBooking = (
  isOpen: boolean,
  onClose: () => void,
  fixedDate?: string,
  fixedTime?: string,
  initialProgramId?: number,
  initialProgramTitle?: string,
  initialPrice?: number,
  parentReservations?: ReservationDto[],
) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(fixedDate || "");
  const [time, setTime] = useState(fixedTime || "");
  const [count, setCount] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null,
  );
  const [_schedules, setSchedules] = useState<ProgramSchedule[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false);
  const [isReservationsLoaded, setIsReservationsLoaded] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);

  /** 모달 열림 시 초기화: 프로그램 목록 + 예약 정보 조회 */
  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      setIsReservationsLoaded(false);
      if (parentReservations && parentReservations.length > 0) {
        setMyReservations(parentReservations);
        setIsReservationsLoaded(true);
      } else {
        fetchMyReservations();
      }
      setStep(1);
      setCount(1);
      setShowPayment(false);
      setRequireTicket(false);
      setTimeSlots(DEFAULT_TIME_SLOTS);

      if (!fixedDate) setDate("");
      if (!fixedTime) setTime("");
    }
  }, [isOpen, fixedDate, fixedTime]);

  /** 날짜 또는 프로그램 변경 시 해당 스케줄 조회 */
  useEffect(() => {
    if (date && selectedProgramId) {
      fetchSchedules(selectedProgramId, date);
    }
  }, [date, selectedProgramId]);

  /** 날짜 변경 시 당일 관람권 보유 여부 확인 (ADMISSION 타입 예약) */
  useEffect(() => {
    if (!isReservationsLoaded) return;
    if (date) {
      const hasAdmission = myReservations.some(
        (res) =>
          res.visitDate === date &&
          res.status === "CONFIRMED" &&
          (res.programType === "ADMISSION" || !res.programType),
      );
      if (!hasAdmission) {
        setRequireTicket(true);
      } else {
        setRequireTicket(false);
      }
    }
  }, [date, myReservations, isReservationsLoaded]);

  /** 프로그램 목록 조회: 초기 프로그램 매칭 (제목 → ID → 첫 번째) */
  const fetchPrograms = async () => {
    try {
      const res = await api.get<Program[]>("/programs");
      if (res.data && res.data.length > 0) {
        setPrograms(res.data);
        // 제목으로 매칭 시도
        if (initialProgramTitle) {
          const matched = res.data.find((p) =>
            p.title.includes(initialProgramTitle) || initialProgramTitle.includes(p.title)
          );
          if (matched) {
            setSelectedProgramId(matched.id);
            return;
          }
        }
        // ID로 매칭 시도
        if (initialProgramId) {
          const found = res.data.find((p) => p.id === initialProgramId);
          if (found) {
            setSelectedProgramId(initialProgramId);
            return;
          }
        }
        // 기본: 첫 번째 프로그램 선택
        setSelectedProgramId(res.data[0].id);
      } else {
        useFallbackProgram();
      }
    } catch (err) {
      console.error("프로그램 로딩 실패, 부모 데이터 사용", err);
      useFallbackProgram();
    }
  };

  /** API 실패 시 부모에서 전달받은 프로그램 정보로 폴백 */
  const useFallbackProgram = () => {
    if (initialProgramTitle) {
      const fallbackId = initialProgramId || 1;
      const fallbackPrice = initialPrice || 0;
      const fallbackProgram: Program = {
        id: fallbackId,
        title: initialProgramTitle,
        price: fallbackPrice,
        description: "",
        imageUrl: "",
        type: "EXPERIENCE",
      };
      setPrograms([fallbackProgram]);
      setSelectedProgramId(fallbackId);
    }
  };

  /** 특정 프로그램의 날짜별 스케줄 조회 → 시간 슬롯 갱신 */
  const fetchSchedules = async (programId: number, dateStr: string) => {
    try {
      const res = await api.get<ProgramSchedule[]>(
        `/programs/${programId}/schedules?date=${dateStr}`,
      );
      if (res.data && res.data.length > 0) {
        setSchedules(res.data);
        const apiTimes = res.data.map((sch) => {
          return sch.startTime.split(" ")[1].substring(0, 5);
        });
        setTimeSlots(apiTimes);
      } else {
        setSchedules([]);
        setTimeSlots(DEFAULT_TIME_SLOTS);
      }
    } catch (err) {
      console.error("스케줄 로딩 실패", err);
      setSchedules([]);
      setTimeSlots(DEFAULT_TIME_SLOTS);
    }
  };

  /** 내 예약 목록 조회 (관람권 보유 확인용) */
  const fetchMyReservations = async () => {
    try {
      const res = await api.get<ReservationDto[]>("/reservations/me");
      setMyReservations(res.data);
      setIsReservationsLoaded(true);
    } catch (err) {
      console.error("내 예약 로딩 실패", err);
      setIsReservationsLoaded(true);
    }
  };

  /** 프로그램 변경 시 날짜/시간 초기화 */
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    setSelectedProgramId(newId);
    if (!fixedDate) setDate("");
    if (!fixedTime) setTime("");
  };

  /** 인원 증감 (최소 1명) */
  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, prev + delta));
  };

  /** 결제 성공 콜백: 백엔드 예약 API 호출 */
  const handlePaymentSuccess = async () => {
    try {
      await api.post("/reservations/programs", {
        programId: selectedProgramId,
        visitDate: date,
        visitTime: time,
        count: count,
      });
      alert("예약이 완료되었습니다!");
      onClose();
    } catch (err) {
      alert("예약 실패");
    }
  };

  /** 결제하기 클릭: 필수 입력 검증 후 결제 모달 표시 */
  const handleBookingClick = () => {
    if (!date || !time) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }
    setShowPayment(true);
  };

  /** 현재 선택된 프로그램 및 총 금액 계산 */
  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const totalPrice = selectedProgram ? selectedProgram.price * count : 0;
  /** 외부에서 프로그램 지정 시 선택 잠금 */
  const isProgramLocked = !!initialProgramTitle || !!initialProgramId;

  return {
    step,
    date,
    setDate,
    time,
    setTime,
    count,
    handleCountChange,
    programs,
    selectedProgramId,
    handleProgramChange,
    timeSlots,
    requireTicket,
    setRequireTicket,
    showPayment,
    setShowPayment,
    handleBookingClick,
    handlePaymentSuccess,
    totalPrice,
    selectedProgram,
    isProgramLocked,
  };
};
