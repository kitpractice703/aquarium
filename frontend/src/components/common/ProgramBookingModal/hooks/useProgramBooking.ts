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
  // [상태 관리]
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
  const [requireTicket, setRequireTicket] = useState(false);

  // 1. 초기 데이터 로딩
  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      fetchMyReservations();
      // 초기화
      setStep(1);
      setCount(1);
      setShowPayment(false);
      setRequireTicket(false);

      // 고정된 값이 없으면 초기화, 있으면 유지
      if (!fixedDate) setDate("");
      if (!fixedTime) setTime("");
    }
  }, [isOpen, fixedDate, fixedTime]);

  // 2. 날짜가 선택되면 스케줄 조회
  useEffect(() => {
    if (date && selectedProgramId) {
      fetchSchedules(selectedProgramId, date);
    }
  }, [date, selectedProgramId]);

  // 3. 관람권 소지 여부 체크
  useEffect(() => {
    if (date) {
      const hasAdmission = myReservations.some(
        (res) =>
          res.visitDate === date &&
          res.status === "CONFIRMED" &&
          (res.programType === "ADMISSION" || !res.programType),
      );
      if (!hasAdmission) {
        setRequireTicket(true);
      }
    }
  }, [date, myReservations]);

  // API 호출 함수들
  const fetchPrograms = async () => {
    try {
      const res = await api.get<Program[]>("/programs");
      setPrograms(res.data);
      // 목록이 있고, 아직 선택된 게 없으면 첫 번째 자동 선택
      if (res.data.length > 0 && !selectedProgramId) {
        setSelectedProgramId(res.data[0].id);
      }
    } catch (err) {
      console.error("프로그램 로딩 실패", err);
    }
  };

  const fetchSchedules = async (programId: number, dateStr: string) => {
    try {
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

  // 핸들러 함수들
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    setSelectedProgramId(newId);
    // 프로그램 변경 시 날짜/시간 초기화 (고정된 경우 제외)
    if (!fixedDate) setDate("");
    if (!fixedTime) setTime("");
  };

  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, prev + delta)); // 최소 1명
  };

  const handlePaymentSuccess = async () => {
    try {
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

  const handleBookingClick = () => {
    // 유효성 검사
    if (!date || !time) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }
    setShowPayment(true);
  };

  // 계산 로직
  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const totalPrice = selectedProgram ? selectedProgram.price * count : 0;

  return {
    step,
    date,
    setDate,
    time,
    setTime,
    count, // handleCountChange로 제어하므로 setCount는 굳이 내보내지 않아도 됨 (하지만 필요하면 추가)
    handleCountChange,
    programs,
    selectedProgramId,
    handleProgramChange,
    schedules,
    requireTicket,
    setRequireTicket,
    showPayment,
    setShowPayment,
    handleBookingClick,
    handlePaymentSuccess,
    totalPrice,
    selectedProgram,
  };
};
