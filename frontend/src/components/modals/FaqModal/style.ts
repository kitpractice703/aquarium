/** FAQ 모달 스타일 */
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
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Container = styled.div`
  background: var(--bg-card);
  width: 90%;
  max-width: 800px;
  height: 80vh;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(0, 242, 255, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #fff;
    font-size: 24px;
    span {
      color: var(--accent-cyan);
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 28px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #fff;
    transform: rotate(90deg);
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;

/** 아코디언 아이템 */
export const AccordionItem = styled.div`
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child {
    border-bottom: none;
  }
`;

/** 질문 헤더: 열림 시 배경 변경 + 시안 텍스트 색상 */
export const Question = styled.div<{ $isOpen: boolean }>`
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) =>
    props.$isOpen ? "rgba(255, 255, 255, 0.05)" : "transparent"};
  border-radius: 10px;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .q-text {
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => (props.$isOpen ? "var(--accent-cyan)" : "#fff")};
  }

  .icon {
    font-size: 20px;
    color: #888;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
    transition: 0.3s;
  }
`;

/** 답변: max-height 트랜지션으로 부드러운 펼침/접힘 */
export const Answer = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;

  p {
    padding: 20px;
    color: var(--text-gray);
    font-size: 15px;
    line-height: 1.6;
    border-left: 2px solid var(--accent-cyan);
    margin: 10px 0 20px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0 10px 10px 0;
  }
`;
