import { useState, useEffect, useMemo } from "react";
import * as S from "./style";
import PaymentModal from "../PaymentModal";
import { api } from "../../../api/axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  programId: number;
  price: number;
}

// [KEY POINT] 2시간 간격 시간표
const PROGRAM_TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

// [Helper] 오늘 날짜를 YYYY-MM-DD 문자열로 반환 (한국 시간 기준)
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ProgramBookingModal = ({
  isOpen,
  onClose,
  programTitle,
  programId,
  price,
}: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); // 초기값은 useEffect에서 설정됨
  const [count, setCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setDate("");
      setTime("");
      setCount(1);
      setShowPayment(false);
    }
  }, [isOpen]);

  // [핵심 로직] 선택한 날짜에 따라 '가능한 시간대'만 계산
  const availableTimes = useMemo(() => {
    if (!date) return PROGRAM_TIMES;

    const today = getTodayString();

    // 1. 선택한 날짜가 오늘보다 미래라면 -> 모든 시간 오픈
    if (date > today) return PROGRAM_TIMES;

    // 2. 선택한 날짜가 오늘이라면 -> 현재 시간 이후만 오픈
    if (date === today) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      return PROGRAM_TIMES.filter((t) => {
        const [h, m] = t.split(":").map(Number);
        const targetMinutes = h * 60 + m;
        return targetMinutes > currentMinutes; // 현재 시간보다 뒤인 타임만 남김
      });
    }

    // 3. 과거 날짜라면 (min 속성으로 막히지만 방어 로직) -> 빈 배열
    return [];
  }, [date]);

  // [UX 개선] 날짜가 바뀌거나 유효 시간이 바뀔 때, 시간 선택 자동 보정
  useEffect(() => {
    // 가능한 시간이 하나라도 있으면
    if (availableTimes.length > 0) {
      // 현재 선택된 'time'이 유효 목록에 없으면(혹은 비어있으면), 가장 빠른 시간으로 자동 선택
      if (!time || !availableTimes.includes(time)) {
        setTime(availableTimes[0]);
      }
    } else {
      // 가능한 시간이 없으면 초기화
      setTime("");
    }
  }, [availableTimes, time]);

  if (!isOpen) return null;

  const totalPrice = price * count;

  const handlePaymentSuccess = async () => {
    try {
      await api.post("/reservations/programs", {
        programId,
        visitDate: date,
        visitTime: time,
        count,
      });
      alert("프로그램 예약이 완료되었습니다!");
      onClose();
    } catch (error: any) {
      if (error.response?.status === 400) alert(error.response.data);
      else if (error.response?.status === 401) alert("로그인이 필요합니다.");
      else alert("예약 중 오류가 발생했습니다.");
    }
  };

  // 결제하기 버튼 클릭 핸들러
  const handlePaymentClick = () => {
    if (!date) return alert("날짜를 선택해주세요");
    if (!time) return alert("예약 가능한 시간이 없습니다.");
    setShowPayment(true);
  };

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <h2>{programTitle} 예약</h2>
            <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
          </S.Header>
          <S.Content>
            {/* 날짜 선택 */}
            <S.InputGroup>
              <S.Label>날짜 선택 (입장권 날짜와 맞춰주세요)</S.Label>
              <S.Input
                type="date"
                value={date}
                min={getTodayString()} // [중요] 오늘 이전 날짜 선택 불가
                onChange={(e) => setDate(e.target.value)}
              />
            </S.InputGroup>

            {/* 시간 선택 */}
            <S.InputGroup>
              <S.Label>시간 선택</S.Label>
              <S.Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={availableTimes.length === 0} // 시간 없으면 비활성화
              >
                {availableTimes.length > 0 ? (
                  availableTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))
                ) : (
                  <option value="">예약 가능한 시간이 없습니다</option>
                )}
              </S.Select>
            </S.InputGroup>

            {/* 인원 선택 */}
            <S.InputGroup>
              <S.Label>인원</S.Label>
              <S.Select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </S.Select>
            </S.InputGroup>

            <S.Summary>
              <div>
                <span>프로그램</span>
                <span>{programTitle}</span>
              </div>
              <div>
                <span>1인 가격</span>
                <span>{price.toLocaleString()}원</span>
              </div>
              <div className="total">
                <span>총 결제금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </S.Summary>
          </S.Content>
          <S.Footer>
            <S.Button
              onClick={handlePaymentClick}
              // 날짜가 없거나 시간이 없으면 버튼 비활성화 (시각적 효과)
              style={{
                opacity: !date || !time ? 0.5 : 1,
                cursor: !date || !time ? "not-allowed" : "pointer",
              }}
            >
              결제하기
            </S.Button>
          </S.Footer>
        </S.Container>
      </S.Overlay>

      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName={`${programTitle} (${count}명)`}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default ProgramBookingModal;
