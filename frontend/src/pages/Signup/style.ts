import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-dark);
  padding: 50px 0;
`;

export const FormBox = styled.div`
  width: 450px;
  padding: 40px;
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 30px;
  color: var(--accent-cyan);
`;

export const InputGroup = styled.div`
  text-align: left;
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 5px;
  margin-left: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan);
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
  &:hover {
    background: #00dbe6;
  }
`;
