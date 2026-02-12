/** 회원가입 페이지 스타일 */
import styled from "styled-components";

/** 전체 컨테이너: 중앙 정렬 + 상단 패딩 (헤더 높이 고려) */
export const SignupContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 50px;
  background: var(--bg-dark, #121212);
`;

/** 가입 폼 카드: 글래스모피즘 효과 */
export const FormCard = styled.div`
  background: var(--bg-card, rgba(0, 0, 0, 0.5));
  padding: 50px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  color: var(--accent-cyan);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: var(--text-gray, #ccc);
`;

/** 입력 필드: 포커스 시 시안 글로우 */
export const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  transition: 0.3s;

  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.1);
  }

  &::placeholder {
    color: #555;
  }
`;

/** 가입 버튼: 호버 시 상승 효과 */
export const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan);
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;

  &:hover {
    background: #00dbe6;
    transform: translateY(-2px);
  }
`;

/** 로그인 링크 */
export const LoginLink = styled.div`
  text-align: center;
  margin-top: 25px;
  color: var(--text-gray, #aaa);
  font-size: 14px;

  span {
    color: var(--accent-cyan);
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 5px;
    transition: 0.3s;

    &:hover {
      color: #fff;
    }
  }
`;
