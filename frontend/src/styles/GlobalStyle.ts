import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-dark: #0a0f1c;      /* 심해 같은 아주 어두운 남색 */
    --bg-card: #151e32;      /* 카드 배경 */
    --accent-cyan: #00f2ff;  /* 발광 생물 같은 네온 시안 */
    --text-white: #ffffff;
    --text-gray: #aab2c0;
    --padding-section: 100px 20px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: "Noto Sans KR", sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-white);
    line-height: 1.6;
    overflow-x: hidden; /* 가로 스크롤 방지 */
  }
  
  a { text-decoration: none; color: inherit; transition: 0.3s; }
  ul { list-style: none; }
  button { font-family: "Noto Sans KR", sans-serif; }
  
  /* 스크롤바 커스텀 (심해 느낌) */
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }
`;
