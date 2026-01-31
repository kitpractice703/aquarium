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
  color: var(--text-gray); /* LoginModal과 동일한 회색 */
  line-height: 1.5;
  margin-bottom: 5px;
  text-align: center;

  strong {
    color: #fff; /* 강조 텍스트 흰색 */
    font-weight: bold;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: var(--text-gray); /* 라벨 색상 통일 */
`;

export const InputBox = styled.input`
  width: 100%;
  padding: 12px;
  /* LoginModal과 동일한 다크 테마 배경 */
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  transition: 0.3s;

  &::placeholder {
    color: #555;
  }

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.1);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan); /* 포인트 컬러 */
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;

  &:hover {
    background: #00dbe6;
  }
`;

export const BackLink = styled.span`
  text-align: center;
  font-size: 13px;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 5px;

  &:hover {
    color: #fff;
  }
`;
