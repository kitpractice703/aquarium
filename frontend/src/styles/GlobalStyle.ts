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
    scroll-behavior: smooth; /* 👈 핵심: 부드러운 스크롤 */
  }

  body {
    font-family: "Noto Sans KR", sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-white);
    line-height: 1.6;
    overflow-x: hidden;
  }
  
  a { text-decoration: none; color: inherit; transition: 0.3s; }
  ul { list-style: none; }
  button { font-family: "Noto Sans KR", sans-serif; }
  
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }
`;
