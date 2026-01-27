import React, { useEffect } from "react";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CommonModal = ({ isOpen, onClose, title, children }: Props) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

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
