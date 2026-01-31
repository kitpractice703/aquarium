import styled from "styled-components";

/* 화면 전체를 감싸는 컨테이너 (중앙 정렬 + 배경) */
export const SignupContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 50px; /* 헤더 높이 고려 */
  background: var(--bg-dark, #121212);
`;

/* 실제 회원가입 폼이 들어가는 카드 영역 */
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
