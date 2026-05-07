/**
 * 애플리케이션 진입점
 *
 * 프로바이더 래핑 순서:
 *   GlobalStyle  → 전역 CSS 변수 및 리셋 스타일을 최상위에 주입
 *   BrowserRouter → HTML5 History API 기반 클라이언트 사이드 라우팅 활성화
 *   AuthProvider  → 로그인 상태·토큰·모달 제어를 전역 Context로 공급
 *   App           → 실제 라우트 트리 렌더링
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
