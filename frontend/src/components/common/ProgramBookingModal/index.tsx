import { useState } from "react";
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

// [KEY POINT] 요청하신 2시간 간격 시간표
const PROGRAM_TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

const ProgramBookingModal = ({
  isOpen,
  onClose,
  programTitle,
  programId,
  price,
}: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [count, setCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const totalPrice = price * count;

  const handlePaymentSuccess = async () => {
    try {
      await api.post("/reservations/programs", {
        // 백엔드 엔드포인트 확인 필요
        programId,
        visitDate: date,
        visitTime: time,
        count,
      });
      alert("프로그램 예약이 완료되었습니다!");
      onClose();
    } catch (error: any) {
      if (error.response?.status === 400)
        alert(error.response.data); // "입장권 먼저 구매하세요" 등
      else if (error.response?.status === 401) alert("로그인이 필요합니다.");
      else alert("예약 중 오류가 발생했습니다.");
    }
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
                onChange={(e) => setDate(e.target.value)}
              />
            </S.InputGroup>

            {/* 시간 선택 (2시간 간격) */}
            <S.InputGroup>
              <S.Label>시간 선택</S.Label>
              <S.Select value={time} onChange={(e) => setTime(e.target.value)}>
                {PROGRAM_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
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
              onClick={() => {
                if (!date) return alert("날짜를 선택해주세요");
                setShowPayment(true);
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
