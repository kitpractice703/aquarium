/**
 * 전역 스타일 정의 (styled-components createGlobalStyle)
 * - CSS 변수: 다크 테마 색상 팔레트 (bg-dark, accent-cyan 등)
 * - 글꼴: Noto Sans KR (한국어 최적화)
 * - 스크롤바: 커스텀 디자인 (다크 배경 + 시안 호버)
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* CSS 변수: 전역 테마 색상 */
  :root {
    --bg-dark: #0a0f1c;
    --bg-card: #151e32;
    --accent-cyan: #00f2ff;
    --text-white: #ffffff;
    --text-gray: #aab2c0;
    --padding-section: 100px 20px;
  }

  /* 리셋 스타일 */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html { 
    scroll-behavior: smooth; 
    scroll-padding-top: 80px; /* 고정 헤더 높이만큼 스크롤 오프셋 */
  }

  body {
    width: 100%;
    max-width: none;
    font-family: "Noto Sans KR", sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-white);
    line-height: 1.6;
    overflow-x: hidden; /* 가로 스크롤 방지 */
  }
  
  /* 루트 레이아웃: 최소 높이 100vh (푸터 하단 고정) */
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: none;
  }

  a { text-decoration: none; color: inherit; transition: 0.3s; }
  ul { list-style: none; }
  button { font-family: "Noto Sans KR", sans-serif; }
  
  /* 커스텀 스크롤바 */
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }
`;
