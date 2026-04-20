import CommonModal from "../Modal";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LoginRequestModal = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="알림">
      <S.Container>
        <S.Message>로그인 후 이용 가능합니다.</S.Message>
        <S.Button onClick={onConfirm}>로그인 하러가기</S.Button>
      </S.Container>
    </CommonModal>
  );
};

export default LoginRequestModal;
