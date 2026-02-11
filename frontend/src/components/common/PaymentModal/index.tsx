import * as S from "./style";
import { usePayment } from "./hooks/usePayment"; // 훅 가져오기

interface Props {
  amount: number;
  orderName: string;
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean; // isOpen도 받는 게 좋습니다 (PaymentModal을 사용하는 부모가 내려준다고 가정)
}

// isOpen이 Props에 없다면 PaymentModal이 렌더링될 때가 곧 열린 상태라고 가정할 수도 있습니다.
const PaymentModal = ({
  amount,
  orderName,
  onSuccess,
  onClose,
  isOpen = true,
}: Props) => {
  // [수정 2] 훅은 반드시 여기서! (Top Level)
  // "onSuccess 함수 줄 테니까, 결제 성공하면 이거 실행해줘" 라고 뇌에게 전달
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
              {/* [수정 3] 훅에서 가져온 handlePayment를 바로 연결 */}
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
