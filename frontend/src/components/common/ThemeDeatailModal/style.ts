import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(0, 242, 255, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 32px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    color: #fff;
    transform: rotate(90deg);
    transition: 0.3s;
  }
`;

export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

export const TabItem = styled.div<{ $active: boolean; $color: string }>`
  flex: 1;
  padding: 25px;
  text-align: center;
  font-size: 18px;
  color: ${(props) => (props.$active ? "#fff" : "#888")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  cursor: pointer;
  transition: 0.3s;
  border-bottom: 3px solid
    ${(props) => (props.$active ? props.$color : "transparent")};
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  @media (max-width: 768px) {
    padding: 15px;
    font-size: 14px;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  padding: 50px;
  gap: 60px;
  align-items: center;
  overflow-y: auto;
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    padding: 30px;
    gap: 30px;
  }
`;

export const InfoArea = styled.div`
  flex: 1;
  animation: ${fadeIn} 0.5s ease;
`;

export const Title = styled.h2<{ $color: string }>`
  font-size: 56px;
  margin-bottom: 30px;
  color: ${(props) => props.$color};
  text-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

export const Desc = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #ccc;
  white-space: pre-line;
`;

/* [핵심 수정] 높이(height) 고정을 풀고, 16:9 비율(aspect-ratio)을 적용했습니다. */
export const VideoArea = styled.div<{ $color: string }>`
  flex: 1.2;
  width: 100%;
  aspect-ratio: 16 / 9; /* 영상 비율 16:9 고정 */
  background: #000;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid ${(props) => props.$color};
  animation: ${fadeIn} 0.5s ease;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 900px) {
    width: 100%;
    flex: none;
  }
`;
