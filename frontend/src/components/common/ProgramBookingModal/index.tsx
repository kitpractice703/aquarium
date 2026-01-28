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
      await api.post("/programs", {
        // [Backend] ReservationController 수정 필요
        programId: programId,
        visitDate: date,
        visitTime: time,
        count: count,
      });

      setShowPayment(false);
      alert("프로그램 예약이 완료되었습니다!");
      onClose();
    } catch (error: any) {
      console.error(error);
      setShowPayment(false);
      if (error.response?.status === 400) {
        alert(error.response.data); // "입장권을 먼저 예매해주세요" 메시지 출력
      } else if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert("예약 중 오류가 발생했습니다.");
      }
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
            <S.InputGroup>
              <S.Label>방문 날짜 (입장권 날짜와 동일해야 함)</S.Label>
              <S.Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>시간 선택</S.Label>
              <S.Select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </S.Select>
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
                <span>단가</span>
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
