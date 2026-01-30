import CommonModal from "../Modal";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // "예매하러 가기" 눌렀을 때 실행될 함수
}

const Container = styled.div`
  text-align: center;
  padding: 30px 10px;
`;

const Message = styled.p`
  font-size: 18px;
  color: #fff;
  margin-bottom: 10px;
  line-height: 1.6;

  strong {
    color: var(--accent-cyan);
    font-weight: bold;
  }
`;

const SubMessage = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 12px 30px;
  background: var(--accent-cyan);
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  transition: 0.3s;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
  }
`;

const TicketNoticeModal = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="알림">
      <Container>
        <Message>
          해당 날짜의 <strong>관람권(입장권)</strong>이 없습니다.
        </Message>
        <SubMessage>관람권 예매 후 프로그램을 이용하실 수 있습니다.</SubMessage>
        <Button onClick={onConfirm}>관람권 예매하러 가기</Button>
      </Container>
    </CommonModal>
  );
};

export default TicketNoticeModal;
