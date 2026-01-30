import { useState, useEffect, useMemo } from "react";
import * as S from "./style";
import PaymentModal from "../PaymentModal";
import { api } from "../../../api/axios";
import type { ReservationDto } from "../../../types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  programId: number;
  price: number;
  fixedDate?: string;
  fixedTime?: string;
  myReservations: ReservationDto[];
  onRequireTicket: () => void;
}

// 2시간 간격 시간표
const PROGRAM_TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

// 오늘 날짜 문자열 반환 (YYYY-MM-DD)
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
  fixedDate,
  fixedTime,
  myReservations,
  onRequireTicket,
}: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [count, setCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  // 1. 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setDate(fixedDate || "");
      setTime(fixedTime || "");
      setCount(1);
      setShowPayment(false);
    }
  }, [isOpen, fixedDate, fixedTime]);

  // 2. 날짜 선택 시 관람권 소지 여부 체크
  useEffect(() => {
    if (date && !fixedDate) {
      const hasTicket = myReservations.some(
        (res) => res.visitDate === date && res.status === "CONFIRMED",
      );

      if (!hasTicket) {
        onRequireTicket();
      }
    }
  }, [date, fixedDate, myReservations, onRequireTicket]);

  // 3. [핵심 수정] 예약 가능한 시간 계산 로직
  const availableTimes = useMemo(() => {
    if (fixedTime) return [fixedTime]; // 고정 시간이면 그것만 리턴

    if (!date) return PROGRAM_TIMES;

    const today = getTodayString();

    // [수정] 미래 날짜면 필터링 없이 모든 시간 오픈
    if (date > today) return PROGRAM_TIMES;

    // [수정] 오늘이면 현재 시간 이후만 오픈
    if (date === today) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      return PROGRAM_TIMES.filter((t) => {
        const [h, m] = t.split(":").map(Number);
        const targetMinutes = h * 60 + m;
        return targetMinutes > currentMinutes;
      });
    }

    // 과거 날짜는 빈 배열 (선택 불가)
    return [];
  }, [date, fixedTime]);

  // 4. [추가] 날짜 변경 시 시간 자동 보정 (유효하지 않은 시간 선택 방지)
  useEffect(() => {
    if (availableTimes.length > 0) {
      // 현재 선택된 'time'이 'availableTimes' 목록에 없으면
      // (예: 10:00을 선택했는데 날짜를 오늘로 바꿔서 10:00이 목록에서 사라진 경우)
      if (!time || !availableTimes.includes(time)) {
        setTime(availableTimes[0]); // 첫 번째 가능한 시간으로 자동 변경
      }
    } else {
      setTime(""); // 가능한 시간이 없으면 초기화
    }
  }, [availableTimes]); // time 의존성을 빼서 무한 루프 방지

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
              <S.Label>날짜 선택</S.Label>
              {fixedDate ? (
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 0",
                    borderBottom: "1px solid #444",
                  }}
                >
                  {fixedDate} (지정일)
                </div>
              ) : (
                <S.Input
                  type="date"
                  value={date}
                  min={getTodayString()}
                  onChange={(e) => setDate(e.target.value)}
                />
              )}
            </S.InputGroup>

            {/* 시간 선택 */}
            <S.InputGroup>
              <S.Label>시간 선택</S.Label>
              {fixedTime ? (
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 0",
                    borderBottom: "1px solid #444",
                  }}
                >
                  {fixedTime} (지정석)
                </div>
              ) : (
                <S.Select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={availableTimes.length === 0}
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
              )}
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
