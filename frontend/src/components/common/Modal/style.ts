import styled, { keyframes } from "styled-components";

export const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px); /* 핵심: 뒤쪽 뿌옇게 */
  z-index: 9999;
  justify-content: center;
  align-items: center;
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Container = styled.div`
  background-color: var(--bg-card);
  width: 90%;
  max-width: 450px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  &:hover {
    color: #fff;
  }
`;

export const Content = styled.div`
  padding: 30px 25px;
`;
