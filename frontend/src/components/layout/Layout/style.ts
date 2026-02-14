/** Layout 컴포넌트 스타일 */
import styled from "styled-components";

/** 전체 페이지 래퍼: Flexbox 세로 배치로 Header-Content-Footer 구조 형성 */
export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

/** 메인 콘텐츠 영역: flex: 1로 남은 공간 채움 (푸터 하단 고정 효과) */
export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;
