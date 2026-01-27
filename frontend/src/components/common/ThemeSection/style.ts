import styled from "styled-components";

/* [1] 배경 (화면 전체) */
export const SectionWrapper = styled.section`
  width: 100%;
  padding: 100px 20px;
  background-color: var(--bg-dark);

  /* 내용 중앙 정렬 */
  display: flex;
  justify-content: center;
`;

/* [2] 내용물 (최대 1200px) */
export const InnerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
`;

export const Title = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
  color: var(--accent-cyan);
`;

export const SearchBarContainer = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

export const SearchInput = styled.input`
  width: 50%;
  padding: 15px;
  border-radius: 30px;
  border: 1px solid var(--accent-cyan);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  outline: none;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ThemeCard = styled.div`
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }
`;

export const ThemeImg = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

export const ThemeInfo = styled.div`
  padding: 20px;
  text-align: center;
  h4 {
    color: #fff;
    margin-bottom: 10px;
    font-size: 18px;
  }
  p {
    color: var(--text-gray);
    font-size: 14px;
  }
`;
