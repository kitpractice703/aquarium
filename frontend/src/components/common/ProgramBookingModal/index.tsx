import * as S from "./style";
import CommonModal from "../Modal";
import PaymentModal from "../PaymentModal";
import TicketNoticeModal from "../TicketNoticeModal";
import { useProgramBooking } from "./hooks/useProgramBooking";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fixedDate?: string;
  fixedTime?: string;
}

const ProgramBookingModal = ({
  isOpen,
  onClose,
  fixedDate,
  fixedTime,
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
    schedules,
    requireTicket,
    setRequireTicket,
    showPayment,
    setShowPayment,
    handleBookingClick,
    handlePaymentSuccess,
    totalPrice,
    selectedProgram,
  } = useProgramBooking(isOpen, onClose, fixedDate, fixedTime);

  // 1. 관람권 없음 경고 모달
  if (requireTicket) {
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

  // 2. 메인 예약 모달
  return (
    <>
      <CommonModal isOpen={isOpen} onClose={onClose} title="프로그램 예약">
        <S.Container>
          {/* 프로그램 선택 */}
          <S.Section>
            <S.Label>프로그램 선택</S.Label>
            <S.Select
              value={selectedProgramId || ""}
              onChange={handleProgramChange}
              disabled={!!fixedDate}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.price.toLocaleString()}원)
                </option>
              ))}
            </S.Select>
          </S.Section>

          {/* 날짜 선택 */}
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

          {/* 시간 선택 */}
          <S.Section>
            <S.Label>시간 선택</S.Label>
            {fixedTime ? (
              <S.FixedInfo>{fixedTime} (지정석)</S.FixedInfo>
            ) : (
              <S.Select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">시간을 선택해주세요</option>
                {schedules.map((sch, idx) => {
                  // 시간 문자열 파싱 ("2026-02-14 14:00:00" -> "14:00")
                  const timeStr = sch.startTime.split(" ")[1].substring(0, 5);
                  return (
                    <option key={idx} value={timeStr} disabled={sch.isClosed}>
                      {timeStr} {sch.isClosed ? "(마감)" : ""}
                    </option>
                  );
                })}
              </S.Select>
            )}
          </S.Section>

          {/* 인원 선택 (Hook의 count, handleCountChange 사용) */}
          <S.CounterRow>
            <div className="label">예약 인원</div>
            <div className="controls">
              <button onClick={() => handleCountChange(-1)}>-</button>
              <span>{count}</span>
              <button onClick={() => handleCountChange(1)}>+</button>
            </div>
          </S.CounterRow>

          {/* 하단 결제 버튼 */}
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

      {/* 결제창 */}
      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName={selectedProgram?.title || "프로그램 예약"}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default ProgramBookingModal;
