import styled from "styled-components";

/* 화면 전체 중앙 정렬 */
export const SignupContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 50px; /* 헤더 높이 고려 */
  background: var(--bg-dark);
  cursor: pointer; /* 배경 클릭 가능하다는 힌트 */
`;

/* 가입 폼 카드 */
export const FormCard = styled.div`
  background: var(--bg-card);
  padding: 50px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative; /* 닫기 버튼 위치 기준 */
  cursor: default; /* 카드 내부는 기본 커서 */
`;

/* [NEW] 우측 상단 닫기 버튼 */
export const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--text-gray);
  font-size: 28px;
  cursor: pointer;
  transition: 0.3s;
  line-height: 1;

  &:hover {
    color: #fff;
    transform: rotate(90deg); /* 살짝 회전하는 효과 */
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  color: var(--accent-cyan);
  font-size: 32px;
`;

export const InputGroup = styled.div`
  margin-bottom: 25px;
`;

export const Label = styled.label`
  display: block;
  color: var(--text-gray);
  margin-bottom: 10px;
  font-size: 14px;
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

export const ErrorMsg = styled.span`
  display: block;
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
`;

export const SubmitBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan);
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;

  &:hover {
    background: #00dbe6;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: var(--text-gray);
  font-size: 14px;

  span {
    color: #fff;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 5px;
  }
`;
