/** FAQ 모달 - 카테고리별 아코디언 */
import * as S from "./style";
import { useFaq } from "./hooks/useFaq";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal = ({ isOpen, onClose }: Props) => {
  const { faqList, openIndex, handleToggle } = useFaq(isOpen);

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
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
                <div className="q-text">
                  <span
                    style={{
                      color: "#888",
                      fontWeight: "normal",
                      marginRight: "10px",
                      fontSize: "14px",
                    }}
                  >
                    [{item.category}]
                  </span>
                  {item.question}
                </div>
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
