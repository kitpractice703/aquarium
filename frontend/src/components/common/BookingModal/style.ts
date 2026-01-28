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
  background-color: #151e32;
  width: 90%;
  max-width: 600px;
  height: auto;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(0, 242, 255, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  color: #fff; /* 글자색 강제 화이트 */
`;

export const Header = styled.div`
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #fff;
    font-size: 20px;
    span {
      color: var(--accent-cyan);
      margin-left: 5px;
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #fff;
    transform: rotate(90deg);
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.h3`
  font-size: 22px;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

/* [Step 1] 달력 스타일 */
export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
  text-align: center;
`;

export const DayHeader = styled.div`
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 10px;
`;

export const DateBtn = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid
    ${(props) =>
      props.$selected ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)"};
  background: ${(props) =>
    props.$selected ? "var(--accent-cyan)" : "transparent"};
  color: ${(props) =>
    props.$selected ? "#000" : props.$disabled ? "#444" : "#fff"};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: 0.2s;

  &:hover {
    background: ${(props) => !props.$disabled && "rgba(0, 242, 255, 0.2)"};
  }
`;

/* [Step 2] 시간 선택 */
export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

export const TimeBtn = styled.button<{ $selected: boolean }>`
  padding: 15px;
  border-radius: 10px;
  border: 1px solid
    ${(props) =>
      props.$selected ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)"};
  background: ${(props) =>
    props.$selected ? "var(--accent-cyan)" : "rgba(0,0,0,0.3)"};
  color: ${(props) => (props.$selected ? "#000" : "#fff")};
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 242, 255, 0.2);
    color: #fff;
  }
`;

/* [Step 3] 인원 선택 */
export const CounterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-bottom: 15px;

  .label {
    font-size: 16px;
    color: #fff;
    font-weight: bold;
  }
  .price {
    font-size: 13px;
    color: var(--text-gray);
    margin-top: 5px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 15px;

    button {
      width: 32px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #555;
      background: #333;
      color: #fff;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;

      &:hover {
        border-color: var(--accent-cyan);
        color: var(--accent-cyan);
      }
    }
    span {
      font-size: 18px;
      font-weight: bold;
      width: 20px;
      text-align: center;
    }
  }
`;

/* [Step 4] 결과 요약 */
export const SummaryBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 15px;
    color: #ddd;

    &.total {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 20px;
      font-weight: bold;
      color: var(--accent-cyan);
    }
  }
`;

export const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 15px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background: ${(props) => (props.$primary ? "var(--accent-cyan)" : "#333")};
  color: ${(props) => (props.$primary ? "#000" : "#fff")};
  transition: 0.3s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    filter: brightness(1.1);
  }
`;
