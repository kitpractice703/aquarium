import styled from "styled-components";

/* [1] 배경 (화면 전체 너비) */
export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 0 20px;

  background: rgba(10, 15, 28, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  /* 내용물 중앙 정렬 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* [2] 내용물 (최대 1200px) */
export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
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
  align-items: center;

  a {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;
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

  /* [추가] 텍스트 줄바꿈 방지 */
  white-space: nowrap;

  span {
    cursor: pointer;
    transition: 0.3s;
  }
  span:hover {
    color: #fff;
  }

  /* [추가] 모바일 화면(좁은 화면)일 때 간격과 글자 크기 살짝 줄이기 */
  @media (max-width: 480px) {
    gap: 10px;
    font-size: 13px;
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

/* 구글 로그인 버튼 (스타일 복구) */
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

export const BookingButton = styled.button`
  background: var(--accent-cyan);
  color: #000;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 10px;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 219, 230, 0.3);
  }
`;
