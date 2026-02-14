/** 로그인 모달 스타일 */
import styled from "styled-components";

export const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  color: var(--text-gray);
  margin-bottom: 8px;
  font-size: 14px;
`;

/** 다크 테마 입력 필드: 포커스 시 시안 보더 */
export const InputBox = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
  }
`;

export const BtnAction = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan);
  color: #000;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
  &:hover {
    background: #00dbe6;
  }
`;

/** Google 소셜 로그인 버튼: 흰색 배경, Google 로고 아이콘 포함 */
export const GoogleBtn = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
  &:hover {
    background: #f1f1f1;
  }
`;

/** 비밀번호 재설정 링크 */
export const ResetLink = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--accent-cyan);
  }

  span {
    font-size: 12px;
    color: #666;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: #333;
    }
  }
`;

/** 회원가입 유도 링크 */
export const SignupLink = styled.div`
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;

  span {
    color: #007bff;
    font-weight: 600;
    cursor: pointer;
    margin-left: 8px;

    &:hover {
      text-decoration: underline;
      color: #0056b3;
    }
  }
`;
