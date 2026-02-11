// src/components/common/ProgramBookingModal/hooks/useProgramBooking.ts
import { useState, useEffect } from "react";
import { api } from "../../../../api/axios";
import type {
  Program,
  ProgramSchedule,
  ReservationDto,
} from "../../../../types/api";

export const useProgramBooking = (
  isOpen: boolean,
  onClose: () => void,
  fixedDate?: string,
  fixedTime?: string,
) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(fixedDate || "");
  const [time, setTime] = useState(fixedTime || "");
  const [count, setCount] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null,
  );
  const [schedules, setSchedules] = useState<ProgramSchedule[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false); // 관람권 필요 알림

  // 1. 초기 데이터 로딩 (프로그램 목록, 내 예약 내역)
  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      fetchMyReservations();
      // 초기화
      setStep(1);
      if (!fixedDate) setDate("");
      if (!fixedTime) setTime("");
      setCount(1);
      setShowPayment(false);
      setRequireTicket(false);
    }
  }, [isOpen]);

  // 2. 날짜가 선택되면 스케줄 조회
  useEffect(() => {
    if (date && selectedProgramId) {
      fetchSchedules(selectedProgramId, date);
    }
  }, [date, selectedProgramId]);

  // 3. 관람권 소지 여부 체크 로직 (중요!)
  useEffect(() => {
    if (date) {
      const hasAdmission = myReservations.some(
        (res) =>
          res.visitDate === date &&
          res.status === "CONFIRMED" &&
          (res.programType === "ADMISSION" || !res.programType),
      );
      if (!hasAdmission) {
        setRequireTicket(true); // 관람권 없으면 알림창 띄움
      }
    }
  }, [date, myReservations]);

  // [API 함수들]
  const fetchPrograms = async () => {
    try {
      const res = await api.get<Program[]>("/programs");
      setPrograms(res.data);
      if (res.data.length > 0 && !selectedProgramId) {
        setSelectedProgramId(res.data[0].id); // 첫 번째 프로그램 기본 선택
      }
    } catch (err) {
      console.error("프로그램 로딩 실패", err);
    }
  };

  const fetchSchedules = async (programId: number, dateStr: string) => {
    try {
      // 쿼리 파라미터는 백엔드 스펙에 맞게 수정 (예: ?date=2026-02-14)
      const res = await api.get<ProgramSchedule[]>(
        `/programs/${programId}/schedules?date=${dateStr}`,
      );
      setSchedules(res.data);
    } catch (err) {
      console.error("스케줄 로딩 실패", err);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const res = await api.get<ReservationDto[]>("/reservations/me");
      setMyReservations(res.data);
    } catch (err) {
      console.error("내 예약 로딩 실패", err);
    }
  };

  // [핸들러 함수들]
  const handlePaymentSuccess = async () => {
    try {
      // 실제 예약 API 호출
      await api.post("/reservations/program", {
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

  const handleNext = () => {
    if (step === 1 && date && time) setStep(2);
    else if (step === 2) setShowPayment(true);
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const totalPrice = selectedProgram ? selectedProgram.price * count : 0;

  // [반환] View에서 필요한 것만 쏙쏙 골라 담기
  return {
    step,
    setStep,
    date,
    setDate,
    time,
    setTime,
    count,
    setCount,
    programs,
    selectedProgramId,
    setSelectedProgramId,
    schedules,
    requireTicket,
    setRequireTicket, // 알림창 제어용
    showPayment,
    setShowPayment,
    handleNext,
    handlePaymentSuccess,
    totalPrice,
    selectedProgram,
  };
};
