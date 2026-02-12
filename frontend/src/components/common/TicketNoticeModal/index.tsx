/**
 * 관람권 미보유 안내 모달
 * - 프로그램 예약 시 당일 관람권이 없으면 표시
 * - 확인 클릭 시 관람권 예매 페이지로 안내
 */
import CommonModal from "../Modal";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TicketNoticeModal = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="알림">
      <S.Container>
        <S.Message>
          해당 날짜의 <strong>관람권(입장권)</strong>이 없습니다.
        </S.Message>
        <S.SubMessage>
          관람권 예매 후 프로그램을 이용하실 수 있습니다.
        </S.SubMessage>
        <S.Button onClick={onConfirm}>관람권 예매하러 가기</S.Button>
      </S.Container>
    </CommonModal>
  );
};

export default TicketNoticeModal;
