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

// 5개 시간대 정의
const PROGRAM_TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

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

  // 1. 초기화
  useEffect(() => {
    if (isOpen) {
      setDate(fixedDate || "");
      setTime(fixedTime || "");
      setCount(1);
      setShowPayment(false);
    }
  }, [isOpen, fixedDate, fixedTime]);

  // 2. 관람권 체크
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

  // 3. [시간 계산 로직 수정]
  const availableTimes = useMemo(() => {
    if (fixedTime) return [fixedTime]; // 지정석(공연)

    if (!date) return PROGRAM_TIMES;

    const today = getTodayString();

    // [핵심] 날짜가 오늘과 다르면(즉, 미래라면) 무조건 전체 시간 표시
    if (date !== today) {
      return PROGRAM_TIMES;
    }

    // 오늘인 경우에만 지난 시간 필터링
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return PROGRAM_TIMES.filter((t) => {
      const [h, m] = t.split(":").map(Number);
      const targetMinutes = h * 60 + m;
      return targetMinutes > currentMinutes;
    });
  }, [date, fixedTime]);

  // [추가] 시간이 바뀌거나 목록이 바뀌면 자동 선택 보정
  useEffect(() => {
    if (availableTimes.length > 0) {
      if (!time || !availableTimes.includes(time)) {
        setTime(availableTimes[0]);
      }
    } else {
      setTime("");
    }
  }, [availableTimes]); // time 제외 (무한루프 방지)

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
