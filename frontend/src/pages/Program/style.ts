import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  background-color: var(--bg-dark);
`;

export const Banner = styled.div`
  width: 100%;
  height: 300px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/images/theme_light.jpg") no-repeat center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
`;

export const Content = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 50px auto;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.15);
    border-color: var(--accent-cyan);
  }
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #000;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 20px;
`;

export const CardTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: #fff;
`;

export const CardDesc = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  line-height: 1.6;
`;
