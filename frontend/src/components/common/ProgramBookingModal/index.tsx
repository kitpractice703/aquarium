/**
 * 프로그램 예약 모달 컴포넌트
 * - 프로그램 선택 → 날짜 → 시간 → 인원 → 결제
 * - 당일 관람권 미보유 시 TicketNoticeModal로 안내
 * - fixedDate/fixedTime: 공연 시간표에서 진입 시 사전 설정
 */
import { useEffect } from "react";
import * as S from "./style";
import CommonModal from "../Modal";
import PaymentModal from "../PaymentModal";
import TicketNoticeModal from "../TicketNoticeModal";
import { useProgramBooking } from "./hooks/useProgramBooking";
import type { ReservationDto } from "../../../types/api";

/** 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (날짜 선택 최소값) */
const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  programTitle?: string;
  programId?: number;
  price?: number;
  fixedDate?: string;
  fixedTime?: string;
  myReservations?: ReservationDto[];
  onRequireTicket?: () => void;
}

const ProgramBookingModal = ({
  isOpen,
  onClose,
  programTitle,
  programId,
  price,
  fixedDate,
  fixedTime,
  myReservations: parentReservations,
  onRequireTicket,
}: Props) => {
  const {
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
  } = useProgramBooking(isOpen, onClose, fixedDate, fixedTime, programId, programTitle, price, parentReservations);

  /** 관람권 필요 시 부모 컴포넌트에 알림 */
  useEffect(() => {
    if (requireTicket && onRequireTicket) {
      onRequireTicket();
    }
  }, [requireTicket]);

  /** 관람권 미보유 + 부모 핸들러 없음 → 자체 안내 모달 표시 */
  if (requireTicket && !onRequireTicket) {
    return (
      <TicketNoticeModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {
          setRequireTicket(false);
          onClose();
        }}
      />
    );
  }

  if (requireTicket) return null;

  return (
    <>
      <CommonModal isOpen={isOpen} onClose={onClose} title="프로그램 예약">
        <S.Container>
          {/* 프로그램 선택 (외부에서 지정 시 잠금) */}
          <S.Section>
            <S.Label>프로그램 선택</S.Label>
            <S.Select
              value={selectedProgramId || ""}
              onChange={handleProgramChange}
              disabled={isProgramLocked}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </S.Select>
          </S.Section>

          {/* 날짜 선택 (고정일 시 읽기 전용) */}
          <S.Section>
            <S.Label>날짜 선택</S.Label>
            {fixedDate ? (
              <S.FixedInfo>{fixedDate} (지정일)</S.FixedInfo>
            ) : (
              <S.Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayString()}
              />
            )}
          </S.Section>

          {/* 시간 선택 (고정 시간 시 읽기 전용) */}
          <S.Section>
            <S.Label>시간 선택</S.Label>
            {fixedTime ? (
              <S.FixedInfo>{fixedTime} (지정석)</S.FixedInfo>
            ) : (
              <S.Select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">시간을 선택해주세요</option>
                {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
              </S.Select>
            )}
          </S.Section>

          {/* 인원 카운터 (최소 1명) */}
          <S.CounterRow>
            <div className="label">예약 인원</div>
            <div className="controls">
              <button onClick={() => handleCountChange(-1)}>-</button>
              <span>{count}</span>
              <button onClick={() => handleCountChange(1)}>+</button>
            </div>
          </S.CounterRow>

          {/* 하단: 총 금액 + 결제 버튼 */}
          <S.Footer>
            <div className="price">총 {totalPrice.toLocaleString()}원</div>
            <S.Button
              $primary
              onClick={handleBookingClick}
              disabled={!date || !time || totalPrice === 0}
            >
              결제하기
            </S.Button>
          </S.Footer>
        </S.Container>
      </CommonModal>

      {/* 결제 모달 */}
      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName={selectedProgram?.title || programTitle || "프로그램 예약"}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPayment(false); onClose(); }}
        />
      )}
    </>
  );
};

export default ProgramBookingModal;
