import styled from "styled-components";

/* [공통 섹션 스타일] */
export const Section = styled.section`
  padding: 100px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-dark);
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 60px;
  color: var(--accent-cyan);
`;

/* [2. About Section Styles] */
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
`;

/* [4. Program Section Styles] */
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

/* [5. Booking Section Styles] */
export const BookingSection = styled.section`
  background: var(--accent-cyan);
  color: #000;
  text-align: center;
  padding: 60px 20px;
`;

/* [6. Community Section Styles] */
export const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2단 그리드 */
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
