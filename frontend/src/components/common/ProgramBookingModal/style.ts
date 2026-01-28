import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  background: #222;
  width: 90%;
  max-width: 500px;
  border-radius: 15px;
  overflow: hidden;
  color: #fff;
  border: 1px solid #444;
`;

export const Header = styled.div`
  padding: 20px;
  background: #333;
  display: flex;
  justify-content: space-between;
  h2 {
    margin: 0;
    font-size: 18px;
    color: var(--accent-cyan);
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

export const Content = styled.div`
  padding: 20px;
`;

export const StepTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #eee;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #aaa;
  font-size: 14px;
`;
export const Select = styled.select`
  width: 100%;
  padding: 10px;
  background: #444;
  color: #fff;
  border: 1px solid #555;
  border-radius: 5px;
`;
export const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #444;
  color: #fff;
  border: 1px solid #555;
  border-radius: 5px;
`;

export const Summary = styled.div`
  background: rgba(0, 242, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .total {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: bold;
    font-size: 18px;
    color: var(--accent-cyan);
  }
`;

export const Footer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: flex-end;
`;
export const Button = styled.button`
  background: var(--accent-cyan);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
