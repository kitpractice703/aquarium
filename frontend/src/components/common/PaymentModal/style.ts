import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  background: white;
  width: 360px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const Header = styled.div`
  background: #333;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

export const Content = styled.div`
  padding: 20px;
`;

export const AmountBox = styled.div`
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px dashed #eee;
  .label {
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
  }
  .amount {
    font-size: 28px;
    font-weight: 800;
    color: #007bff;
  }
  .order-name {
    font-size: 14px;
    color: #555;
    margin-top: 5px;
  }
`;

export const CardForm = styled.div`
  .input-group {
    margin-bottom: 20px;
  }
  label {
    display: block;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
  }
  .card-inputs {
    display: flex;
    gap: 8px;
  }
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    text-align: center;
    font-size: 16px;
  }
`;

export const PayBtn = styled.button`
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export const StatusView = styled.div`
  text-align: center;
  padding: 20px 0;
  p {
    margin: 10px 0 0;
    font-weight: bold;
    color: #333;
  }
  .sub {
    font-weight: normal;
    font-size: 13px;
    color: #888;
  }
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;

export const CheckIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto;
`;
