import styled from "styled-components";

export const Section = styled.section`
  padding: 100px 0;
  background-color: var(--bg-dark);
`;

export const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  text-align: center;
  color: #fff;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ThemeCard = styled.div`
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

export const CardInfo = styled.div`
  padding: 20px;
  text-align: center;
`;

export const ThemeTitle = styled.h4<{ $color: string }>`
  color: ${(props) => props.$color};
  font-size: 20px;
  margin-bottom: 10px;
`;

export const ThemeSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-gray);
`;
