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
  // [추가] 고정된 날짜/시간 (공연 시간표에서 넘어올 때 사용)
  fixedDate?: string;
  fixedTime?: string;
}

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
  fixedDate, // props
  fixedTime, // props
}: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [count, setCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // [수정] 고정값이 있으면 그것을 사용, 없으면 초기화
      setDate(fixedDate || "");
      setTime(fixedTime || "");
      setCount(1);
      setShowPayment(false);
    }
  }, [isOpen, fixedDate, fixedTime]);

  // [기존 availableTimes 로직 유지 - 일반 예약(VR 등)에서는 여전히 필요]
  const availableTimes = useMemo(() => {
    if (fixedTime) return [fixedTime]; // 고정 시간이면 그것만 유효
    if (!date) return PROGRAM_TIMES;
    // ... (기존 날짜 비교 로직 생략 - 그대로 둠) ...
    return PROGRAM_TIMES;
  }, [date, fixedTime]);

  // ... (handlePaymentSuccess 등 기존 로직 유지) ...

  if (!isOpen) return null;
  const totalPrice = price * count;

  // 결제하기 버튼 클릭
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
            {/* [수정] 날짜 선택 영역 */}
            <S.InputGroup>
              <S.Label>날짜</S.Label>
              {fixedDate ? (
                // 고정된 경우 텍스트로 표시
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 0",
                  }}
                >
                  {fixedDate} (지정석)
                </div>
              ) : (
                // 고정이 아닌 경우(VR 등) 입력창 표시
                <S.Input
                  type="date"
                  value={date}
                  min={getTodayString()}
                  onChange={(e) => setDate(e.target.value)}
                />
              )}
            </S.InputGroup>

            {/* [수정] 시간 선택 영역 */}
            <S.InputGroup>
              <S.Label>시간</S.Label>
              {fixedTime ? (
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 0",
                  }}
                >
                  {fixedTime}
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
                    <option value="">가능한 시간이 없습니다</option>
                  )}
                </S.Select>
              )}
            </S.InputGroup>

            {/* 인원 선택 (항상 표시) */}
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
              {/* ... (기존 요약 정보 유지) ... */}
              <div className="total">
                <span>총 결제금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </S.Summary>
          </S.Content>
          <S.Footer>
            <S.Button onClick={handlePaymentClick}>결제하기</S.Button>
          </S.Footer>
        </S.Container>
      </S.Overlay>

      {showPayment && (
        <PaymentModal
          amount={totalPrice}
          orderName={`${programTitle} (${count}명)`}
          onSuccess={async () => {
            // [기존 핸들러 내용 복사]
            try {
              await api.post("/reservations/programs", {
                programId,
                visitDate: date,
                visitTime: time,
                count,
              });
              alert("예약이 완료되었습니다!");
              onClose();
            } catch (e: any) {
              if (e.response?.status === 400) alert(e.response.data);
              else alert("예약 처리 중 오류가 발생했습니다.");
            }
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default ProgramBookingModal;
