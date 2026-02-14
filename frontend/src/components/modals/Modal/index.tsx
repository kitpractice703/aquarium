/**
 * 공통 모달 컴포넌트
 * - 오버레이 + 슬라이드업 애니메이션 컨테이너
 * - 오버레이 클릭 시 닫힘, 컨테이너 클릭은 전파 차단
 * - 모든 모달(로그인, 예매, 후기 등)이 이 컴포넌트를 래핑하여 사용
 */
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
      {/* stopPropagation: 모달 내부 클릭 시 닫힘 방지 */}
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
