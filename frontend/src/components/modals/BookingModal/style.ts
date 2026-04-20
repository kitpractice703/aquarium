/** 관람 예매 모달 스타일 - 달력/인원/확인 단계 */
import styled from "styled-components";

export const StepTitle = styled.h3`
  font-size: 22px;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

/* Step 1: 달력 그리드 (7열) */
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

/** 날짜 버튼: 선택 시 시안 배경, 비활성 시 회색 + not-allowed */
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
  position: relative;

  &:hover {
    background: ${(props) => !props.$disabled && "rgba(0, 242, 255, 0.2)"};
  }
`;

/** 휴관일 표시 라벨 */
export const ClosedLabel = styled.span`
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: #ff6b6b;
  white-space: nowrap;
`;

/* Step 2: 시간 선택 (현재 미사용, 종일권으로 대체) */
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

/* Step 3: 인원 선택 카운터 */
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

/* Step 4: 결과 요약 박스 */
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
