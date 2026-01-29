import { useState, useEffect } from "react";
import PaymentModal from "../PaymentModal";
import { api } from "../../../api/axios";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getCalendarDays = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);
  return { year, month: month + 1, days };
};

const BookingModal = ({ isOpen, onClose }: Props) => {
  const [step, setStep] = useState(1); // 1:날짜 -> 3:인원 (2:시간 건너뜀)
  const [calendarData, setCalendarData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCalendarData(getCalendarDays());
      setStep(1);
      setSelectedDate(null);
      setCounts({ adult: 0, teen: 0 });
      setShowPayment(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPrice = counts.adult * 35000 + counts.teen * 29000;

  const handleNext = () => {
    if (step === 1 && selectedDate) {
      // [KEY POINT] 관람권은 시간 선택 없이 바로 인원 선택으로 점프
      setStep(3);
    } else if (step === 3 && totalPrice > 0) {
      setStep(4); // 확인창
    } else if (step === 4) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const year = calendarData.year;
      const month = String(calendarData.month).padStart(2, "0");
      const day = String(selectedDate).padStart(2, "0");

      await api.post("/reservations", {
        visitDate: `${year}-${month}-${day}`,
        visitTime: "종일권", // [FIX] 관람은 시간이 없으므로 기본값 전송
        adultCount: counts.adult,
        teenCount: counts.teen,
      });

      alert("예매가 완료되었습니다!");
      onClose();
    } catch (error: any) {
      if (error.response?.status === 401) alert("로그인이 필요합니다.");
      else alert("예매 처리 중 오류가 발생했습니다.");
    }
  };

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
            {/* Step 1: 날짜 */}
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

            {/* Step 3: 인원 (Step 2 건너뜀) */}
            {step === 3 && (
              <>
                <S.StepTitle>인원을 선택해주세요</S.StepTitle>
                <S.CounterRow>
                  <div>
                    <div className="label">성인</div>
                    <div className="price">35,000원</div>
                  </div>
                  <div className="controls">
                    <button
                      onClick={() =>
                        setCounts((p) => ({
                          ...p,
                          adult: Math.max(0, p.adult - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <span>{counts.adult}</span>
                    <button
                      onClick={() =>
                        setCounts((p) => ({ ...p, adult: p.adult + 1 }))
                      }
                    >
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
                    <button
                      onClick={() =>
                        setCounts((p) => ({
                          ...p,
                          teen: Math.max(0, p.teen - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <span>{counts.teen}</span>
                    <button
                      onClick={() =>
                        setCounts((p) => ({ ...p, teen: p.teen + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>
                </S.CounterRow>
              </>
            )}

            {/* Step 4: 확인 */}
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
            {step > 1 && (
              <S.Button onClick={() => setStep(step === 3 ? 1 : step - 1)}>
                이전
              </S.Button>
            )}
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
