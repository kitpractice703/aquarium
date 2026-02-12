/** 커뮤니티 섹션 스타일 */
import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  padding: 100px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-dark);
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--accent-cyan);
`;

/** 2열 그리드: FAQ(좌) + 후기(우), 모바일 900px 이하 1열 */
export const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const CommBox = styled.div`
  background: var(--bg-card);
  padding: 30px;
  border-radius: 15px;
`;

export const CommTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  span {
    font-size: 14px;
    color: var(--text-gray);
    cursor: pointer;
  }
`;

/** FAQ 아이템: $active 시 답변 표시 */
export const FaqItem = styled.div<{ $active: boolean }>`
  margin-bottom: 15px;
  cursor: pointer;
  .question {
    color: #fff;
    margin-bottom: 5px;
    font-weight: 500;
  }
  .answer {
    display: ${(props) => (props.$active ? "block" : "none")};
    padding-left: 10px;
    border-left: 2px solid var(--accent-cyan);
    color: var(--text-gray);
    font-size: 13px;
    margin-top: 5px;
    line-height: 1.5;
  }
`;

/** 후기 리스트 */
export const CommList = styled.ul`
  li {
    margin-bottom: 15px;
    font-size: 14px;
    color: var(--text-gray);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    &:hover {
      color: #fff;
      text-decoration: underline;
    }
    .rating {
      color: #ffdd57;
    }
  }
`;
