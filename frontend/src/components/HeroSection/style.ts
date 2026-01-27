import styled from "styled-components";

export const HeroContainer = styled.section`
  width: 100%;
  height: 100vh;

  /* 배경 이미지 설정 (HTML 레퍼런스 반영) */
  background:
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(10, 15, 28, 1)),
    url("https://placehold.co/1920x1080/051126/FFFFFF?text=Background+Video+Loop+(Deep+Sea)")
      no-repeat center/cover;

  /* [핵심] 정중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 상하 중앙 */
  align-items: center; /* 좌우 중앙 */
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const HeroDesc = styled.p`
  font-size: 20px;
  color: var(--text-gray);
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const HeroBtn = styled.button`
  padding: 15px 40px;
  background: transparent;
  border: 2px solid var(--accent-cyan);
  color: var(--accent-cyan);
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: var(--accent-cyan);
    color: #000;
    box-shadow: 0 0 30px var(--accent-cyan);
  }
`;
