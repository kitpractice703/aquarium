import { useState, useEffect } from "react";
import { getPrograms, getProgramSchedules } from "../../../../api/programApi";
import { getMyReservations, reserveProgram } from "../../../../api/reservationApi";
import type {
  Program,
  ProgramSchedule,
  ReservationDto,
} from "../../../../types/api";

const DEFAULT_TIME_SLOTS = ["10:00", "11:00", "13:00", "14:00", "15:00"];

const isMonday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return new Date(dateStr + "T00:00:00").getDay() === 1;
};

export const useProgramBooking = (
  isOpen: boolean,
  fixedDate?: string,
  fixedTime?: string,
  initialProgramId?: number,
  initialProgramTitle?: string,
  initialPrice?: number,
  parentReservations?: ReservationDto[],
) => {
  const [date, setDate] = useState(fixedDate || "");
  const [time, setTime] = useState(fixedTime || "");
  const [count, setCount] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null,
  );
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false);
  const [isReservationsLoaded, setIsReservationsLoaded] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);

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
      setCount(1);
      setShowPayment(false);
      setRequireTicket(false);
      setTimeSlots(DEFAULT_TIME_SLOTS);

      if (!fixedDate) setDate("");
      if (!fixedTime) setTime("");
    }
  }, [isOpen, fixedDate, fixedTime]);

  useEffect(() => {
    if (date && selectedProgramId) {
      fetchSchedules(selectedProgramId, date);
    }
  }, [date, selectedProgramId]);

  useEffect(() => {
    if (!date) {
      setRequireTicket(false);
      return;
    }
    if (isMonday(date)) {
      setDate("");
      setTime("");
      alert("매주 월요일은 휴관일입니다. 다른 날짜를 선택해주세요.");
      return;
    }
    if (!isReservationsLoaded) return;
    const hasAdmission = myReservations.some(
      (res) =>
        res.visitDate === date &&
        res.status === "CONFIRMED" &&
        (res.programType === "ADMISSION" || !res.programType),
    );
    setRequireTicket(!hasAdmission);
  }, [date, myReservations, isReservationsLoaded]);

  const fetchPrograms = async () => {
    try {
      const data = await getPrograms() as Program[];
      if (data && data.length > 0) {
        setPrograms(data);
        // 제목으로 매칭 시도
        if (initialProgramTitle) {
          const matched = data.find((p) =>
            p.title.includes(initialProgramTitle) || initialProgramTitle.includes(p.title)
          );
          if (matched) {
            setSelectedProgramId(matched.id);
            return;
          }
        }
        // ID로 매칭 시도
        if (initialProgramId) {
          const found = data.find((p) => p.id === initialProgramId);
          if (found) {
            setSelectedProgramId(initialProgramId);
            return;
          }
        }
        // 기본: 첫 번째 프로그램 선택
        setSelectedProgramId(data[0].id);
      } else {
        useFallbackProgram();
      }
    } catch (err) {
      console.error("프로그램 로딩 실패, 부모 데이터 사용", err);
      useFallbackProgram();
    }
  };

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

  const fetchSchedules = async (programId: number, dateStr: string) => {
    try {
      const data = await getProgramSchedules(programId, dateStr);
      if (data && data.length > 0) {
        const apiTimes = data.map((sch: ProgramSchedule) => {
          return sch.startTime.split(" ")[1].substring(0, 5);
        });
        setTimeSlots(apiTimes.sort());
      } else {
        setTimeSlots(DEFAULT_TIME_SLOTS);
      }
    } catch (err) {
      console.error("스케줄 로딩 실패", err);
      setTimeSlots(DEFAULT_TIME_SLOTS);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const data = await getMyReservations();
      setMyReservations(data);
      setIsReservationsLoaded(true);
    } catch (err) {
      console.error("내 예약 로딩 실패", err);
      setIsReservationsLoaded(true);
    }
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    setSelectedProgramId(newId);
    if (!fixedDate) setDate("");
    if (!fixedTime) setTime("");
  };

  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, prev + delta));
  };

  const handlePaymentSuccess = async () => {
    try {
      await reserveProgram({
        programId: selectedProgramId!,
        visitDate: date,
        visitTime: time,
        count: count,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: string } };
      alert(e?.response?.data || "예약 처리 중 오류가 발생했습니다.");
    }
  };

  const handleBookingClick = () => {
    if (!date || !time) {
      alert("날짜와 시간을 선택해주세요.");
      return;
    }
    if (isMonday(date)) {
      alert("매주 월요일은 휴관일입니다.");
      return;
    }
    setShowPayment(true);
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const totalPrice = selectedProgram ? selectedProgram.price * count : 0;
  const isProgramLocked = !!initialProgramTitle || !!initialProgramId;

  return {
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
