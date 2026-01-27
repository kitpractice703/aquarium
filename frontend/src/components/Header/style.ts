import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 15, 28, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-cyan);
  letter-spacing: 1px;
  cursor: pointer;
`;

export const Gnb = styled.nav`
  display: flex;
  gap: 30px;
  a {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
  }
  a:hover {
    color: var(--accent-cyan);
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserMenu = styled.div`
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: var(--text-gray);
  span {
    cursor: pointer;
    transition: 0.3s;
  }
  span:hover {
    color: #fff;
  }
`;

/* 모달 내부 스타일 */
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
  &:hover {
    background: #00dbe6;
  }
`;

/* 구글 로그인 버튼 (흰색 배경) */
export const GoogleBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #fff;
  color: #333;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
  &:hover {
    background: #f1f1f1;
  }
`;
