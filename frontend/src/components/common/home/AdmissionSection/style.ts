import styled from "styled-components";

export const Section = styled.section`
  padding: 80px 0;
  background-color: var(--bg-card); /* 메인 배경보다 살짝 밝게 */
`;

export const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: 0.3s;

  &:hover {
    border-color: var(--accent-cyan);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
  }
`;

export const Icon = styled.div`
  font-size: 40px;
  margin-bottom: 20px;
  color: var(--accent-cyan);
`;

export const Title = styled.h3`
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
`;

export const Desc = styled.div`
  color: var(--text-gray);
  line-height: 1.8;
  font-size: 16px;

  strong {
    color: #fff;
    font-weight: bold;
  }
  span {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #888;
  }
`;
