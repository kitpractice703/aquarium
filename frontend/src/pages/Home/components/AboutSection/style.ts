import styled from "styled-components";

export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  background: var(--bg-card);
  padding: 30px;
  border-radius: 10px;
  /* [수정] 고정 높이를 최소 높이로 변경하여 내용이 많아져도 잘리지 않음 */
  min-height: 320px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 320px; /* 지도는 높이 고정 유지 */
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
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  font-size: 16px; /* 폰트 크기 약간 증가 */
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  span:first-child {
    color: #ddd;
  }
  span:last-child {
    font-weight: bold;
    color: #fff;
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
