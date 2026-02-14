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

  @media (max-width: 768px) {
    display: none;
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

/* ──────────── 모바일 반응형 컴포넌트 ──────────── */

/** 햄버거 버튼: 768px 이하에서만 표시, 3줄 → X 애니메이션 */
export const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 1100;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  /* 열림 상태: X 모양 */
  ${(props) =>
    props.$isOpen &&
    `
    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

/** 모바일 배경 오버레이: 메뉴 열림 시 뒤 화면 어둡게 */
export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
    transition: opacity 0.3s, visibility 0.3s;
  }
`;

/** 모바일 슬라이드 메뉴: 우측에서 슬라이드 인 */
export const MobileMenu = styled.nav<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100vh;
    background: rgba(10, 15, 28, 0.97);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1050;
    padding: 80px 30px 30px;
    gap: 0;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
    transition: transform 0.3s ease;
  }

  a, .mobile-menu-item {
    display: block;
    padding: 16px 0;
    font-size: 17px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  a:hover, .mobile-menu-item:hover {
    color: var(--accent-cyan);
  }

  .mobile-menu-item.accent {
    color: var(--accent-cyan);
    font-weight: bold;
  }
`;

/** 모바일 메뉴 내 구분선 */
export const MobileNavDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
`;

/** 모바일 메뉴 내 X 닫기 버튼 */
export const MobileCloseButton = styled.button`
  position: absolute;
  top: 22px;
  right: 22px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
  line-height: 1;

  &:hover {
    color: var(--accent-cyan);
  }
`;


