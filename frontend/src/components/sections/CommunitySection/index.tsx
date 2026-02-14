/**
 * 커뮤니티 섹션 컴포넌트
 * - 홈 페이지 내 FAQ 미리보기 + 관람 후기 미리보기 (2열 그리드)
 * - FAQ: 3개 항목 아코디언, "+" 클릭 시 전체 FAQ 모달 열기
 * - 후기: 최근 5개 표시, "more" 클릭 시 전체 후기 모달 열기
 */
import * as S from "./style";
import type { ReviewData } from "../../../types/api";

interface Props {
  reviews: ReviewData[];
  onOpenFaq: () => void;
  onOpenReview: () => void;
  faqIndex: number | null;
  onToggleFaq: (idx: number) => void;
}

/** 홈 페이지용 FAQ 요약 데이터 */
const HOME_FAQ_DATA = [
  {
    q: "Q. 예매 취소는 언제까지 가능한가요?",
    a: "관람일 전일 23:59까지 100% 환불 가능합니다. 당일 취소는 불가능하며, 천재지변으로 인한 시설 폐쇄 시에는 전액 환불해 드립니다. 환불은 당사 고객센터(1234-1234)로 문의바랍니다.",
  },
  {
    q: "Q. 주차장 이용 안내",
    a: "아쿠아리움 이용객은 지하 2층부터 4층 주차장을 최대 4시간까지 무료로 이용하실 수 있습니다. 이후 10분당 500원의 요금이 부과됩니다.",
  },
  {
    q: "Q. 음식물 반입이 되나요?",
    a: "쾌적한 관람 환경과 해양 생물의 안전을 위해 생수를 제외한 모든 음식물 반입은 제한됩니다. 내부 카페테리아를 이용해 주세요.",
  },
];

const CommunitySection = ({
  reviews,
  onOpenFaq,
  onOpenReview,
  faqIndex,
  onToggleFaq,
}: Props) => {
  return (
    <S.Section id="community">
      <S.Container>
        <S.SectionTitle>커뮤니티</S.SectionTitle>
        <S.CommunityGrid>
          {/* FAQ 미리보기 */}
          <S.CommBox>
            <S.CommTitle>
              자주 묻는 질문 <span onClick={onOpenFaq}>+</span>
            </S.CommTitle>
            {HOME_FAQ_DATA.map((item, idx) => (
              <S.FaqItem
                key={idx}
                $active={faqIndex === idx}
                onClick={() => onToggleFaq(idx)}
              >
                <div className="question">{item.q}</div>
                <div className="answer">{item.a}</div>
              </S.FaqItem>
            ))}
          </S.CommBox>

          {/* 관람 후기 미리보기 */}
          <S.CommBox>
            <S.CommTitle>
              관람 후기 <span onClick={onOpenReview}>more</span>
            </S.CommTitle>
            <S.CommList>
              {reviews.length === 0 ? (
                <li>아직 등록된 후기가 없습니다.</li>
              ) : (
                reviews.slice(0, 5).map((review) => (
                  <li key={review.id} onClick={onOpenReview}>
                    <div className="review-title">{review.title}</div>
                    <span className="rating">{"★".repeat(review.rating)}</span>
                  </li>
                ))
              )}
            </S.CommList>
          </S.CommBox>
        </S.CommunityGrid>
      </S.Container>
    </S.Section>
  );
};

export default CommunitySection;
