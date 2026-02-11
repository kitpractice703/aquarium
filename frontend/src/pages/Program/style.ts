import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-bottom: 100px;
  background-color: var(--bg-dark);
  min-height: 100vh;
`;

export const Banner = styled.div`
  width: 100%;
  height: 300px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/images/program_banner.jpg") no-repeat center/cover;
  /* 배너 이미지가 없으면 배경색으로 대체 */
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: -50px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #333; /* 이미지가 로딩되기 전 배경색 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 25px;
`;

export const CardTitle = styled.h3`
  font-size: 22px;
  color: #fff;
  margin-bottom: 15px;
  color: var(--accent-cyan);
`;

export const CardDesc = styled.p`
  font-size: 15px;
  color: var(--text-gray);
  line-height: 1.6;

  /* 긴 텍스트는 3줄까지만 보여주고 말줄임(...) 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const EmptyMessage = styled.div`
  grid-column: 1 / -1; /* 그리드 전체 너비 차지 */
  text-align: center;
  padding: 100px 0;
  color: #a0a0a0;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

export const LoadingMessage = styled.p`
  color: white;
  text-align: center;
  grid-column: 1 / -1; /* 그리드 전체 너비 차지 (왼쪽 끝 ~ 오른쪽 끝) */
  padding: 100px 0; /* 위아래 여백을 넉넉하게 줌 */
  font-size: 20px; /* 글자 크기도 조금 키워서 잘 보이게 */
  font-weight: bold;
  letter-spacing: 1px;
`;
