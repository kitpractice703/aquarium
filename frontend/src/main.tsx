/**
 * 애플리케이션 진입점 (Entry Point)
 * - StrictMode: 개발 환경에서 잠재적 문제 감지
 * - GlobalStyle: styled-components 전역 스타일 적용
 * - BrowserRouter: React Router의 HTML5 히스토리 API 기반 라우팅
 * - AuthProvider: 전역 인증 상태 컨텍스트 제공
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
