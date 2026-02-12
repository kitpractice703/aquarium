/** Header 컴포넌트 스타일 */
import styled from "styled-components";

/** 고정 헤더 배경: 상단 고정, 반투명 블러 효과 */
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

  display: flex;
  justify-content: center;
  align-items: center;
`;

/** 헤더 내부 콘텐츠 (최대 1200px, 좌우 정렬) */
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

/** 메인 내비게이션 (모바일 768px 이하에서 숨김 처리) */
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

/** 사용자 메뉴 영역 (로그인/회원가입 또는 사용자명/로그아웃) */
export const UserMenu = styled.div`
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: var(--text-gray);

  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

  span {
    cursor: pointer;
    transition: 0.3s;
  }
  span:hover {
    color: #fff;
  }

  @media (max-width: 480px) {
    gap: 10px;
    font-size: 13px;
  }
`;

/** 모달용 입력 그룹 스타일 */
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
/** 시안 컬러 액션 버튼 (로그인, 회원가입 등) */
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

/** Google OAuth2 소셜 로그인 버튼 */
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

/** GNB 예매하기 버튼 (라운드형 시안 버튼) */
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
