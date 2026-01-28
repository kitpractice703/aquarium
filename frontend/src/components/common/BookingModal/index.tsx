import { useState, useEffect } from "react";
// [1] 백엔드 통신을 위한 api 인스턴스 가져오기
import api from "../../../types/api";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// 간단한 달력 생성 함수 (현재 월 기준)
const getCalendarDays = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0부터 시작 (0: 1월)

  const firstDay = new Date(year, month, 1).getDay(); // 이번 달 1일의 요일
  const lastDate = new Date(year, month + 1, 0).getDate(); // 이번 달 마지막 날짜

  const days = [];
  // 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) days.push(null);
  // 날짜 채우기
  for (let i = 1; i <= lastDate; i++) days.push(i);

  // month + 1을 해서 1월~12월 표현으로 맞춤
  return { year, month: month + 1, days };
};

const TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

const BookingModal = ({ isOpen, onClose }: Props) => {
  const [step, setStep] = useState(1); // 1:날짜, 2:시간, 3:인원, 4:확인
  const [calendarData, setCalendarData] = useState<any>(null);

  // 선택 데이터 상태
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [counts, setCounts] = useState({ adult: 0, teen: 0 });

  useEffect(() => {
    if (isOpen) {
      setCalendarData(getCalendarDays());
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setCounts({ adult: 0, teen: 0 });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 총 결제 금액 계산
  const totalPrice = counts.adult * 35000 + counts.teen * 28000;

  // [2] 실제 결제 요청 함수 (백엔드 연동)
  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      // 날짜 포맷팅 (YYYY-MM-DD)
      const year = calendarData.year;
      // getCalendarDays에서 이미 +1을 했으므로 그대로 사용하되, 두 자리수 맞춤
      const month = String(calendarData.month).padStart(2, "0");
      const day = String(selectedDate).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // POST 요청 전송
      await api.post("/reservations", {
        visitDate: formattedDate,
        visitTime: selectedTime,
        adultCount: counts.adult,
        teenCount: counts.teen,
      });

      alert("예매가 완료되었습니다!");
      onClose(); // 모달 닫기
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (step === 1 && selectedDate) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
    else if (step === 3 && totalPrice > 0) setStep(4);
    else if (step === 4) {
      // [3] 마지막 단계에서 결제 함수 호출
      handlePayment();
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <h2>
            관람 예매 <span>Booking</span>
          </h2>
          <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
        </S.Header>

        <S.Content>
          {/* ========== Step 1: 날짜 선택 ========== */}
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
                    $disabled={!day || day < new Date().getDate()} // 오늘 이전 날짜 비활성화
                    $selected={selectedDate === day}
                    onClick={() =>
                      day && day >= new Date().getDate() && setSelectedDate(day)
                    }
                  >
                    {day}
                  </S.DateBtn>
                ))}
              </S.CalendarGrid>
            </>
          )}

          {/* ========== Step 2: 시간 선택 ========== */}
          {step === 2 && (
            <>
              <S.StepTitle>
                {calendarData?.month}월 {selectedDate}일, 시간 선택
              </S.StepTitle>
              <S.TimeGrid>
                {TIMES.map((time) => (
                  <S.TimeBtn
                    key={time}
                    $selected={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </S.TimeBtn>
                ))}
              </S.TimeGrid>
            </>
          )}

          {/* ========== Step 3: 인원 선택 ========== */}
          {step === 3 && (
            <>
              <S.StepTitle>누구와 함께 오시나요?</S.StepTitle>

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
                  <div className="label">청소년</div>
                  <div className="price">28,000원</div>
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

          {/* ========== Step 4: 결제 및 확인 ========== */}
          {step === 4 && (
            <>
              <S.StepTitle>예약 정보를 확인해주세요</S.StepTitle>
              <S.SummaryBox>
                <div>
                  <span>날짜</span>{" "}
                  <span>
                    {calendarData?.month}월 {selectedDate}일
                  </span>
                </div>
                <div>
                  <span>시간</span> <span>{selectedTime}</span>
                </div>
                <div>
                  <span>인원</span>{" "}
                  <span>
                    성인 {counts.adult}, 청소년 {counts.teen}
                  </span>
                </div>
                <div className="total">
                  <span>총 결제금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </S.SummaryBox>
            </>
          )}
        </S.Content>

        <S.Footer>
          {step > 1 && (
            <S.Button onClick={() => setStep(step - 1)}>이전</S.Button>
          )}
          <S.Button
            $primary
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedDate) ||
              (step === 2 && !selectedTime) ||
              (step === 3 && totalPrice === 0)
            }
          >
            {step === 4 ? "결제하기" : "다음"}
          </S.Button>
        </S.Footer>
      </S.Container>
    </S.Overlay>
  );
};

export default BookingModal;
