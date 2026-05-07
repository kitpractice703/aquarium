/**
 * 체험·공연 프로그램 예매 모달 상태 관리 훅
 *
 * 프로그램 선택 → 날짜·시간 선택 → 결제 → 예매 확정 흐름을 관리한다.
 *
 * 주요 비즈니스 규칙:
 * - 매주 월요일은 휴관일 (날짜 선택 시 차단)
 * - 선택한 날짜에 유효한 입장권이 없으면 requireTicket 플래그로 입장권 구매 안내
 * - 스케줄 API에서 시간대를 가져오지 못하면 DEFAULT_TIME_SLOTS 로 폴백
 * - 부모에서 programId/Title을 전달받으면 프로그램 선택란을 잠근다 (isProgramLocked)
 */
import { useState, useEffect } from "react";
import { getPrograms, getProgramSchedules } from "../../../../api/programApi";
import { getMyReservations, reserveProgram } from "../../../../api/reservationApi";
import type {
  Program,
  ProgramSchedule,
  ReservationData,
} from "../../../../types/api";

/** 스케줄 API 실패 또는 데이터 없을 때 사용하는 기본 시간대 */
const DEFAULT_TIME_SLOTS = ["10:00", "11:00", "13:00", "14:00", "15:00"];

/** "YYYY-MM-DD" 형식 날짜 문자열이 월요일인지 확인 */
const isMonday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  // 시간대 오프셋 오류를 방지하기 위해 T00:00:00을 명시적으로 붙인다.
  return new Date(dateStr + "T00:00:00").getDay() === 1;
};

/**
 * @param isOpen 모달 열림 여부
 * @param fixedDate 홈 스케줄 클릭 시 미리 지정되는 날짜 (고정)
 * @param fixedTime 홈 스케줄 클릭 시 미리 지정되는 시간 (고정)
 * @param initialProgramId 홈 프로그램 카드 클릭 시 전달되는 프로그램 ID
 * @param initialProgramTitle 홈 프로그램 카드 클릭 시 전달되는 프로그램명
 * @param initialPrice 홈 프로그램 카드 클릭 시 전달되는 가격
 * @param parentReservations 홈에서 이미 불러온 예약 목록 (재조회 방지)
 */
export const useProgramBooking = (
  isOpen: boolean,
  fixedDate?: string,
  fixedTime?: string,
  initialProgramId?: number,
  initialProgramTitle?: string,
  initialPrice?: number,
  parentReservations?: ReservationData[],
) => {
  const [date, setDate] = useState(fixedDate || "");
  const [time, setTime] = useState(fixedTime || "");
  const [count, setCount] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [myReservations, setMyReservations] = useState<ReservationData[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [requireTicket, setRequireTicket] = useState(false);
  const [isReservationsLoaded, setIsReservationsLoaded] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);

  // 모달이 열릴 때 전체 상태를 초기화하고, 부모 예약 목록이 있으면 재조회를 생략한다.
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

  // 날짜 또는 선택 프로그램이 바뀌면 해당 날짜의 스케줄(시간대)을 새로 불러온다.
  useEffect(() => {
    if (date && selectedProgramId) {
      fetchSchedules(selectedProgramId, date);
    }
  }, [date, selectedProgramId]);

  // 날짜 변경 시 휴관일 차단 및 입장권 보유 여부를 확인한다.
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
    // 예약 목록 로드 완료 전에는 입장권 검사를 건너뛴다.
    if (!isReservationsLoaded) return;
    const hasAdmission = myReservations.some(
      (res) =>
        res.visitDate === date &&
        res.status === "CONFIRMED" &&
        // programType이 없는 예약은 일반 입장권으로 간주한다.
        (res.programType === "ADMISSION" || !res.programType),
    );
    setRequireTicket(!hasAdmission);
  }, [date, myReservations, isReservationsLoaded]);

  /**
   * 프로그램 목록을 불러오고 초기 선택 프로그램을 결정한다.
   * 선택 우선순위: 제목 부분 일치 → ID 일치 → 목록 첫 번째
   */
  const fetchPrograms = async () => {
    try {
      const data = await getPrograms() as Program[];
      if (data && data.length > 0) {
        setPrograms(data);
        if (initialProgramTitle) {
          const matched = data.find((p) =>
            p.title.includes(initialProgramTitle) || initialProgramTitle.includes(p.title)
          );
          if (matched) {
            setSelectedProgramId(matched.id);
            return;
          }
        }
        if (initialProgramId) {
          const found = data.find((p) => p.id === initialProgramId);
          if (found) {
            setSelectedProgramId(initialProgramId);
            return;
          }
        }
        setSelectedProgramId(data[0].id);
      } else {
        useFallbackProgram();
      }
    } catch (err) {
      console.error("프로그램 로딩 실패, 부모 데이터 사용", err);
      useFallbackProgram();
    }
  };

  /**
   * API 실패 시 부모에서 전달받은 initialProgramTitle/Price로 임시 프로그램 객체를 생성한다.
   * 실제 예매는 정상 진행되며 백엔드에서 programId로 검증한다.
   */
  const useFallbackProgram = () => {
    if (initialProgramTitle) {
      const fallbackId = initialProgramId || 1;
      const fallbackPrice = initialPrice || 0;
      const fallbackProgram: Program = {
        id: fallbackId,
        title: initialProgramTitle,
        price: fallbackPrice,
        description: "",
        type: "EXPERIENCE",
      };
      setPrograms([fallbackProgram]);
      setSelectedProgramId(fallbackId);
    }
  };

  /**
   * 선택한 프로그램·날짜에 해당하는 운영 스케줄(시간대)을 조회한다.
   * startTime "YYYY-MM-DD HH:mm" 에서 시·분만 추출해 정렬된 배열로 저장한다.
   */
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
      // 로드 실패해도 입장권 검사를 진행할 수 있도록 로드 완료 처리
      setIsReservationsLoaded(true);
    }
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    setSelectedProgramId(newId);
    // 프로그램이 바뀌면 고정값이 아닌 날짜·시간 선택을 초기화한다.
    if (!fixedDate) setDate("");
    if (!fixedTime) setTime("");
  };

  /** 인원은 최소 1명 이상 유지 */
  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, prev + delta));
  };

  /** 결제 성공 콜백 - 결제 완료 후 예매 생성 API 호출 */
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
  /** 부모에서 프로그램 정보를 전달받은 경우 사용자가 프로그램을 변경하지 못하도록 잠근다 */
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
