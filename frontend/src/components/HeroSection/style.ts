import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Hero = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  overflow: hidden;
`;

export const VideoBg = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  filter: brightness(0.6);
`;

export const Content = styled.div`
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
  padding: 0 20px;
`;

export const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
  line-height: 1.2;
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const Desc = styled.p`
  font-size: 20px;
  color: var(--text-gray);
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const BtnMain = styled.button`
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
