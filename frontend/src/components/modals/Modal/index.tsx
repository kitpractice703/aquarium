/** 공통 모달 래퍼 - 오버레이 클릭 닫힘, 슬라이드업 애니메이션 */
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CommonModal = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <S.Overlay $isOpen={isOpen} onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>{title}</S.Title>
          <S.CloseBtn onClick={onClose}>&times;</S.CloseBtn>
        </S.Header>
        <S.Content>{children}</S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default CommonModal;
