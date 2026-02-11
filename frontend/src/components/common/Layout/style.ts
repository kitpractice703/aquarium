import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const MainContent = styled.main`
  flex: 1; /* Header, Footer 제외한 나머지 공간 채우기 */
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  /* Header 높이만큼 패딩이 필요할 수 있음 (GlobalStyle에서 처리 중이라면 생략 가능) */
`;
