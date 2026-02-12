/** 히어로 섹션 스타일 */
import styled, { keyframes } from "styled-components";

/** 페이드인 애니메이션: 아래에서 위로 등장 */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/** 히어로 섹션 컨테이너: 풀스크린 (100vh) */
export const Hero = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  overflow: hidden;
  background-color: #000;
`;

/** 배경 영상: 절대 위치로 전체 영역 커버, 60% 투명도 */
export const VideoBg = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율 유지하며 꽉 채움 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  opacity: 0.6;
`;

/** 히어로 콘텐츠: 영상 위에 표시, 페이드인 애니메이션 */
export const Content = styled.div`
  z-index: 1;
  position: relative;
  animation: ${fadeIn} 1s ease-out;
  padding: 0 20px;
`;

export const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
  line-height: 1.2;
  color: #fff;
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

/** CTA 버튼: 시안 테두리, 호버 시 배경 채움 + 글로우 효과 */
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
