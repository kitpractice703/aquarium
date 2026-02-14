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

/* ── 볼륨 컨트롤 (우측 하단) ── */

/** 볼륨 컨트롤 컨테이너: 우측 하단 고정 */
export const VolumeControl = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

/** 볼륨 토글 버튼: 글래스모피즘 원형 */
export const VolumeBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: var(--accent-cyan);
    box-shadow: 0 0 15px rgba(0, 242, 255, 0.3);
  }
`;

/** 볼륨 슬라이더 래퍼: 호버 시 나타나는 수평 슬라이더 */
export const VolumeSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 8px 14px;
  animation: ${fadeIn} 0.2s ease-out;
`;

/** 볼륨 슬라이더: 시안 컬러 커스텀 */
export const VolumeSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  /* 트랙 채움 효과 (Webkit) */
  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      var(--accent-cyan, #00f2ff) 0%,
      var(--accent-cyan, #00f2ff) calc(var(--value, 50) * 1%),
      rgba(255, 255, 255, 0.2) calc(var(--value, 50) * 1%)
    );
  }

  /* 슬라이더 핸들 (Webkit) */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: var(--accent-cyan, #00f2ff);
    border-radius: 50%;
    border: 2px solid #fff;
    margin-top: -5px;
    box-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
    cursor: pointer;
  }

  /* 슬라이더 핸들 (Firefox) */
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: var(--accent-cyan, #00f2ff);
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
    cursor: pointer;
  }

  /* 트랙 (Firefox) */
  &::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
  }

  &::-moz-range-progress {
    height: 4px;
    border-radius: 2px;
    background: var(--accent-cyan, #00f2ff);
  }

  @media (max-width: 768px) {
    width: 80px;
  }
`;
