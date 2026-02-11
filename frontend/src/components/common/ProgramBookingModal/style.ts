import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Container = styled.div`
  width: 90%;
  max-width: 500px;
  background: #222;
  border-radius: 15px;
  padding: 30px;
  position: relative;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #aaa;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  appearance: none; /* 기본 화살표 제거하고 커스텀 할 때 유용 */

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FixedInfo = styled.div`
  color: #fff;
  font-weight: bold;
  padding: 12px;
  background: #333;
  border-radius: 8px;
  border: 1px solid #444;
  opacity: 0.8;
`;

/* 수량 조절 버튼 영역 */
export const CounterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;

  .label {
    font-size: 16px;
    font-weight: bold;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 15px;

    button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #555;
      background: #444;
      color: #fff;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background: #555;
      }
    }

    span {
      font-size: 18px;
      font-weight: bold;
      min-width: 20px;
      text-align: center;
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #444;

  .price {
    font-size: 20px;
    font-weight: bold;
    color: var(--accent-cyan);
  }
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background: ${(props) => (props.$primary ? "var(--accent-cyan)" : "#444")};
  color: ${(props) => (props.$primary ? "#000" : "#fff")};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;
