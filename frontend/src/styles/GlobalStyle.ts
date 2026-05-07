/**
 * 전역 스타일 (styled-components)
 *
 * CSS 변수로 디자인 토큰을 정의해 컴포넌트 스타일 파일에서 일관되게 참조한다.
 * 다크 테마(--bg-dark)와 포인트 색상(--accent-cyan)이 전체 UI의 기조를 형성한다.
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-dark: #0a0f1c;
    --bg-card: #151e32;
    --accent-cyan: #00f2ff;
    --text-white: #ffffff;
    --text-gray: #aab2c0;
    --padding-section: 100px 20px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html { 
    scroll-behavior: smooth; 
    /* 고정 헤더(80px) 높이만큼 앵커 스크롤 위치를 보정한다 */
    scroll-padding-top: 80px;
  }

  body {
    width: 100%;
    max-width: none;
    font-family: "Noto Sans KR", sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-white);
    line-height: 1.6;
    overflow-x: hidden;
  }
  
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
  
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }
`;
