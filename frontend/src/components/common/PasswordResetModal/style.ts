// frontend/src/components/common/PasswordResetModal/style.ts
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 10px 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 5px;
  text-align: center;

  strong {
    color: var(--accent-cyan); /* 포인트 컬러 적용 */
    font-weight: bold;
  }
`;

// LoginModal과 동일한 인풋 스타일 그룹
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const InputBox = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  background-color: #f9f9f9;
  transition: all 0.2s ease;

  &::placeholder {
    color: #aaa;
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: var(--accent-cyan); /* 프로젝트 메인 컬러 */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const BackLink = styled.span`
  text-align: center;
  font-size: 13px;
  color: #888;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;
