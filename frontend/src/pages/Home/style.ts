import styled from "styled-components";

/* [1] 공통 레이아웃: 섹션 전체는 꽉 차게, 내용은 중앙 정렬 */
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
  margin-bottom: 60px;
  color: var(--accent-cyan);
`;

/* [2] 소개 (About) & 오시는 길 */
export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  background: var(--bg-card);
  padding: 30px;
  border-radius: 10px;
  margin-top: 20px;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background: #222;
  margin-top: 15px;
`;

/* [3] 프로그램 (Programs) */
export const ProgramLayout = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProgramCol = styled.div`
  flex: 1;
  background: var(--bg-card);
  padding: 40px;
  border-radius: 20px;
`;

export const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    text-align: left;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  th {
    color: var(--text-gray);
    font-weight: normal;
  }
`;

/* [4] 예매 배너 (Booking) */
export const BookingSection = styled.section`
  width: 100%;
  background: var(--accent-cyan);
  color: #000;
  padding: 60px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 30px;
    font-weight: 500;
    font-size: 18px;
  }
  button {
    padding: 15px 50px;
    background: #000;
    color: #fff;
    border: none;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
    &:hover {
      background: #333;
    }
  }
`;

/* [5] 커뮤니티 (Community) */
export const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
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
  }
`;

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
