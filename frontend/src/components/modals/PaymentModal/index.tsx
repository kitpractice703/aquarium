import * as S from "./style";
import { usePayment } from "./hooks/usePayment";

interface Props {
  amount: number;
  orderName: string;
  onSuccess: () => void;
  onClose: () => void;
  isOpen?: boolean;
}

const PaymentModal = ({
  amount,
  orderName,
  onSuccess,
  onClose,
  isOpen = true,
}: Props) => {
  const { step, handlePayment } = usePayment(isOpen, onSuccess);

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
              <S.PayBtn onClick={onClose} style={{ marginTop: "20px" }}>확인</S.PayBtn>
            </S.StatusView>
          )}
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default PaymentModal;
