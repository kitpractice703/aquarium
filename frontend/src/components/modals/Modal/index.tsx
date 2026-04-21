import { useRef } from "react";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  height?: string;
  footer?: React.ReactNode;
}

const CommonModal = ({ isOpen, onClose, title, children, maxWidth, height, footer }: Props) => {
  const mouseDownOnOverlay = useRef(false);

  if (!isOpen) return null;

  return (
    <S.Overlay
      $isOpen={isOpen}
      onMouseDown={() => { mouseDownOnOverlay.current = true; }}
      onMouseUp={() => {
        if (mouseDownOnOverlay.current) onClose();
        mouseDownOnOverlay.current = false;
      }}
    >
      <S.Container
        $maxWidth={maxWidth}
        $height={height}
        onMouseDown={(e) => { e.stopPropagation(); mouseDownOnOverlay.current = false; }}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <S.Header>
          <S.Title>{title}</S.Title>
          <S.CloseBtn onClick={onClose}>&times;</S.CloseBtn>
        </S.Header>
        <S.Content>{children}</S.Content>
        {footer && <S.Footer>{footer}</S.Footer>}
      </S.Container>
    </S.Overlay>
  );
};

export default CommonModal;
