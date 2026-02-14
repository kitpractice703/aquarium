/**
 * FAQ 모달 컴포넌트
 * - 아코디언 UI: 질문 클릭 시 답변 토글
 * - 카테고리별 질문 리스트 (예매/환불, 시설이용, 관람, 할인, 기타)
 */
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
              {/* 질문 헤더: 클릭 시 답변 토글, 열림 시 아이콘 회전 */}
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

              {/* 답변: max-height 애니메이션으로 펼침/접힘 */}
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
