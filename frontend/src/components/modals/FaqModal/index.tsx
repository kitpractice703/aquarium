import { useRef } from "react";
import * as S from "./style";
import { useFaq } from "./hooks/useFaq";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal = ({ isOpen, onClose }: Props) => {
  const { faqList, openIndex, handleToggle } = useFaq(isOpen);

  const mouseDownOnOverlay = useRef(false);

  if (!isOpen) return null;

  return (
    <S.Overlay
      onMouseDown={() => { mouseDownOnOverlay.current = true; }}
      onMouseUp={() => {
        if (mouseDownOnOverlay.current) onClose();
        mouseDownOnOverlay.current = false;
      }}
    >
      <S.Container
        onMouseDown={(e) => { e.stopPropagation(); mouseDownOnOverlay.current = false; }}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <S.Header>
          <h2>
            자주 묻는 질문 <span>FAQ</span>
          </h2>
          <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
        </S.Header>

        <S.Content>
          {faqList.map((item) => (
            <S.AccordionItem key={item.id}>
              <S.Question
                $isOpen={openIndex === item.id}
                onClick={() => handleToggle(item.id)}
              >
                <S.QuestionText $isOpen={openIndex === item.id}>
                  <span>[{item.category}]</span>
                  {item.question}
                </S.QuestionText>
                <div className="icon">▼</div>
              </S.Question>

              <S.Answer $isOpen={openIndex === item.id}>
                <p>{item.answer}</p>
              </S.Answer>
            </S.AccordionItem>
          ))}
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default FaqModal;
