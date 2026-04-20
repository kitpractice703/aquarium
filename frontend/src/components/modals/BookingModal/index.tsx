import CommonModal from "../Modal";
import PaymentModal from "../PaymentModal";
import * as S from "./style";
import { useBooking } from "./hooks/useBooking";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: Props) => {
  const {
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
  } = useBooking(isOpen);

  return (
    <>
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        title="관람 예매"
        maxWidth="600px"
        footer={
          <>
            {step > 1 && <S.Button onClick={handlePrev}>이전</S.Button>}
            <S.Button
              $primary
              onClick={handleNext}
              disabled={(step === 1 && !selectedDate) || (step === 3 && totalPrice === 0)}
            >
              {step === 4 ? "결제하기" : "다음"}
            </S.Button>
          </>
        }
      >
        {step === 1 && (
          <>
            <S.StepTitle>{calendarData?.month}월, 언제 방문하시나요?</S.StepTitle>
            <S.CalendarGrid>
              {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                <S.DayHeader key={d}>{d}</S.DayHeader>
              ))}
              {calendarData?.days.map((day: number | null, idx: number) => {
                const isClosed = day ? isClosedDay(day) : false;
                const isPast = !day || day < new Date().getDate();
                const isDisabled = isPast || isClosed;
                return (
                  <S.DateBtn
                    key={idx}
                    $disabled={isDisabled}
                    $selected={selectedDate === day}
                    onClick={() => !isDisabled && day && setSelectedDate(day)}
                    title={isClosed ? "휴관일 (매주 월요일)" : undefined}
                  >
                    {day}
                    {isClosed && <S.ClosedLabel>휴관</S.ClosedLabel>}
                  </S.DateBtn>
                );
              })}
            </S.CalendarGrid>
          </>
        )}

        {step === 3 && (
          <>
            <S.StepTitle>인원을 선택해주세요</S.StepTitle>
            <S.CounterRow>
              <div>
                <div className="label">성인</div>
                <div className="price">35,000원</div>
              </div>
              <div className="controls">
                <button onClick={() => handleCountChange("adult", -1)}>-</button>
                <span>{counts.adult}</span>
                <button onClick={() => handleCountChange("adult", 1)}>+</button>
              </div>
            </S.CounterRow>
            <S.CounterRow>
              <div>
                <div className="label">청소년/소인</div>
                <div className="price">29,000원</div>
              </div>
              <div className="controls">
                <button onClick={() => handleCountChange("teen", -1)}>-</button>
                <span>{counts.teen}</span>
                <button onClick={() => handleCountChange("teen", 1)}>+</button>
              </div>
            </S.CounterRow>
          </>
        )}

        {step === 4 && (
          <>
            <S.StepTitle>예매 정보를 확인해주세요</S.StepTitle>
            <S.SummaryBox>
              <div>
                <span>날짜</span>
                <span>{calendarData?.month}월 {selectedDate}일</span>
              </div>
              <div>
                <span>티켓</span>
                <span>종일 관람권</span>
              </div>
              <div>
                <span>인원</span>
                <span>성인 {counts.adult}, 소인 {counts.teen}</span>
              </div>
              <div className="total">
                <span>결제금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </S.SummaryBox>
          </>
        )}
      </CommonModal>

      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName="Naquarium 관람권"
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPayment(false); onClose(); }}
        />
      )}
    </>
  );
};

export default BookingModal;
