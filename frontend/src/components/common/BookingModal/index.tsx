import PaymentModal from "../PaymentModal";
import * as S from "./style";
import { useBooking } from "./hooks/useBooking"; // 커스텀 훅 Import

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: Props) => {
  // 로직은 훅에서 다 가져다 씁니다.
  const {
    step,
    calendarData,
    selectedDate,
    setSelectedDate,
    counts,
    handleCountChange,
    totalPrice,
    showPayment,
    setShowPayment,
    handleNext,
    handlePrev,
    handlePaymentSuccess,
  } = useBooking(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <h2>
              관람 예매 <span>Booking</span>
            </h2>
            <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
          </S.Header>

          <S.Content>
            {/* Step 1: 날짜 선택 */}
            {step === 1 && (
              <>
                <S.StepTitle>
                  {calendarData?.month}월, 언제 방문하시나요?
                </S.StepTitle>
                <S.CalendarGrid>
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <S.DayHeader key={d}>{d}</S.DayHeader>
                  ))}
                  {calendarData?.days.map((day: number | null, idx: number) => (
                    <S.DateBtn
                      key={idx}
                      $disabled={!day || day < new Date().getDate()}
                      $selected={selectedDate === day}
                      onClick={() =>
                        day &&
                        day >= new Date().getDate() &&
                        setSelectedDate(day)
                      }
                    >
                      {day}
                    </S.DateBtn>
                  ))}
                </S.CalendarGrid>
              </>
            )}

            {/* Step 3: 인원 선택 (Step 2 건너뜀) */}
            {step === 3 && (
              <>
                <S.StepTitle>인원을 선택해주세요</S.StepTitle>
                <S.CounterRow>
                  <div>
                    <div className="label">성인</div>
                    <div className="price">35,000원</div>
                  </div>
                  <div className="controls">
                    <button onClick={() => handleCountChange("adult", -1)}>
                      -
                    </button>
                    <span>{counts.adult}</span>
                    <button onClick={() => handleCountChange("adult", 1)}>
                      +
                    </button>
                  </div>
                </S.CounterRow>
                <S.CounterRow>
                  <div>
                    <div className="label">청소년/소인</div>
                    <div className="price">29,000원</div>
                  </div>
                  <div className="controls">
                    <button onClick={() => handleCountChange("teen", -1)}>
                      -
                    </button>
                    <span>{counts.teen}</span>
                    <button onClick={() => handleCountChange("teen", 1)}>
                      +
                    </button>
                  </div>
                </S.CounterRow>
              </>
            )}

            {/* Step 4: 예매 정보 확인 */}
            {step === 4 && (
              <>
                <S.StepTitle>예매 정보를 확인해주세요</S.StepTitle>
                <S.SummaryBox>
                  <div>
                    <span>날짜</span>
                    <span>
                      {calendarData?.month}월 {selectedDate}일
                    </span>
                  </div>
                  <div>
                    <span>티켓</span>
                    <span>종일 관람권</span>
                  </div>
                  <div>
                    <span>인원</span>
                    <span>
                      성인 {counts.adult}, 소인 {counts.teen}
                    </span>
                  </div>
                  <div className="total">
                    <span>결제금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                </S.SummaryBox>
              </>
            )}
          </S.Content>

          <S.Footer>
            {step > 1 && <S.Button onClick={handlePrev}>이전</S.Button>}
            <S.Button
              $primary
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedDate) ||
                (step === 3 && totalPrice === 0)
              }
            >
              {step === 4 ? "결제하기" : "다음"}
            </S.Button>
          </S.Footer>
        </S.Container>
      </S.Overlay>

      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName="Naquarium 관람권"
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default BookingModal;
