/** 비밀번호 재설정 모달 스타일 */
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
  color: var(--text-gray);
  line-height: 1.5;
  margin-bottom: 5px;
  text-align: center;

  strong {
    color: #fff;
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
  color: var(--text-gray);
`;

/** 다크 테마 입력 필드: 포커스 시 시안 글로우 */
export const InputBox = styled.input`
  width: 100%;
  padding: 12px;
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
  background: var(--accent-cyan);
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

/** 로그인으로 돌아가기 링크 */
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
