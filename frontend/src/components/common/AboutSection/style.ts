/** 소개 섹션 스타일 */
import styled from "styled-components";

/** 2열 그리드: 이용 안내(좌) + 지도(우), 모바일 900px 이하 1열 */
export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SubTitle = styled.h4`
  margin-bottom: 15px;
  color: #fff;
  padding-left: 5px;
  font-size: 20px;
  font-weight: bold;
`;

/** 이용 안내 박스: 다크 카드 스타일, min-height로 컨텐츠 유동 대응 */
export const InfoBox = styled.div`
  background: var(--bg-card);
  padding: 30px;
  border-radius: 10px;
  min-height: 320px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

/** 카카오 지도 래퍼: 고정 높이 320px */
export const MapWrapper = styled.div`
  width: 100%;
  height: 320px;
  border-radius: 10px;
  overflow: hidden;
  background: #222;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  > div {
    width: 100%;
    height: 100%;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
`;

export const Section = styled.section`
  width: 100%;
  padding: 100px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-dark);
  display: flex;
  justify-content: center;
`;

export const DescArea = styled.div`
  margin-top: 15px;
  padding: 0 5px;

  p {
    margin-top: 5px;
    font-size: 14px;
    color: var(--text-gray);

    &:first-child {
      margin-top: 15px;
      font-size: 16px;
      color: #fff;
      font-weight: bold;
    }
  }
`;

/** 정보 항목: $isWarning 시 빨간색으로 강조 (휴관일 등) */
export const InfoItem = styled.div<{ $isWarning?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  span:first-child {
    color: ${(props) => (props.$isWarning ? "#ff6b6b" : "#ddd")};
  }

  span:last-child {
    font-weight: bold;
    color: ${(props) => (props.$isWarning ? "#ff6b6b" : "#fff")};
  }
`;

export const IntroDesc = styled.p`
  text-align: center;
  font-size: 18px;
  color: #ddd;
  line-height: 1.8;
  margin-bottom: 60px;
  word-break: keep-all;
  span {
    color: var(--accent-cyan);
    font-weight: bold;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--accent-cyan);
`;
