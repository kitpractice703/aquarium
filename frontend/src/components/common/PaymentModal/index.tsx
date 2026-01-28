import { useState } from "react";
import * as S from "./style"; // 스타일 파일 import

interface Props {
  amount: number;
  orderName: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentModal = ({ amount, orderName, onSuccess, onClose }: Props) => {
  // [수정] 불필요한 isProcessing 제거, useEffect 제거
  const [step, setStep] = useState<"INPUT" | "PROCESSING" | "SUCCESS">("INPUT");

  const handlePayment = () => {
    setStep("PROCESSING");

    // 1.5초 뒤에 성공 처리
    setTimeout(() => {
      setStep("SUCCESS");

      // 1초 뒤에 부모에게 알림
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <S.Overlay>
      <S.Container>
        <S.Header>
          <h3>NAQUARIUM PAY</h3>
          <S.CloseBtn onClick={onClose}>&times;</S.CloseBtn>
        </S.Header>

        <S.Content>
          <S.AmountBox>
            <div className="label">총 결제금액</div>
            <div className="amount">{amount.toLocaleString()}원</div>
            <div className="order-name">{orderName}</div>
          </S.AmountBox>

          {step === "INPUT" && (
            <S.CardForm>
              <div className="input-group">
                <label>카드 번호</label>
                <div className="card-inputs">
                  <input type="text" placeholder="0000" maxLength={4} />
                  <input type="text" placeholder="0000" maxLength={4} />
                  <input type="text" placeholder="0000" maxLength={4} />
                  <input type="text" placeholder="0000" maxLength={4} />
                </div>
              </div>
              <S.PayBtn onClick={handlePayment}>결제하기</S.PayBtn>
            </S.CardForm>
          )}

          {step === "PROCESSING" && (
            <S.StatusView>
              <S.Spinner />
              <p>결제 승인 중입니다...</p>
              <p className="sub">잠시만 기다려주세요.</p>
            </S.StatusView>
          )}

          {step === "SUCCESS" && (
            <S.StatusView>
              <S.CheckIcon>✔</S.CheckIcon>
              <p>결제가 완료되었습니다!</p>
            </S.StatusView>
          )}
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default PaymentModal;
