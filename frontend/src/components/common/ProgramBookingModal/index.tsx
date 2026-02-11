// src/components/common/ProgramBookingModal/index.tsx
import * as S from "./style";
import CommonModal from "../Modal";
import PaymentModal from "../PaymentModal";
import TicketNoticeModal from "../TicketNoticeModal"; // 관람권 알림 모달
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
  // 훅에서 로직 몽땅 가져오기
  const {
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
    setRequireTicket,
    showPayment,
    setShowPayment,
    handleNext,
    handlePaymentSuccess,
    totalPrice,
    selectedProgram,
  } = useProgramBooking(isOpen, onClose, fixedDate, fixedTime);

  // 관람권이 없으면 알림 모달을 대신 보여줌
  if (requireTicket) {
    return (
      <TicketNoticeModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {
          setRequireTicket(false);
          onClose();
          // 필요시 예매 페이지로 이동 로직 추가
        }}
      />
    );
  }

  return (
    <>
      <CommonModal isOpen={isOpen} onClose={onClose} title="프로그램 예약">
        <S.Container>
          {/* 프로그램 선택 드롭다운 (옵션) */}
          <S.Section>
            <label>프로그램 선택</label>
            <select
              value={selectedProgramId || ""}
              onChange={(e) => {
                setSelectedProgramId(Number(e.target.value));
                setDate("");
                setTime(""); // 프로그램 바뀌면 초기화
              }}
              disabled={!!fixedDate} // 공연 등 지정된 경우 변경 불가
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.price.toLocaleString()}원)
                </option>
              ))}
            </select>
          </S.Section>

          {/* 날짜 선택 */}
          <S.Section>
            <label>날짜 선택</label>
            {fixedDate ? (
              <S.FixedInfo>{fixedDate} (지정일)</S.FixedInfo>
            ) : (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayString()}
              />
            )}
          </S.Section>

          {/* 시간 선택 */}
          <S.Section>
            <label>시간 선택</label>
            {fixedTime ? (
              <S.FixedInfo>{fixedTime} (지정석)</S.FixedInfo>
            ) : (
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">시간을 선택해주세요</option>
                {schedules.map((sch) => (
                  <option
                    key={sch.id}
                    value={sch.startTime.split(" ")[1]}
                    disabled={sch.isClosed}
                  >
                    {sch.startTime.split(" ")[1]} {sch.isClosed ? "(마감)" : ""}
                  </option>
                ))}
              </select>
            )}
          </S.Section>

          {/* 인원 선택 & 결제 버튼 등... (BookingModal과 유사하게 구현) */}
          <S.Footer>
            <div className="price">총 {totalPrice.toLocaleString()}원</div>
            <button onClick={handleNext} disabled={!date || !time}>
              예약하기
            </button>
          </S.Footer>
        </S.Container>
      </CommonModal>

      {/* 결제 모달 */}
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
