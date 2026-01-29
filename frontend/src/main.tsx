import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    {/* [FIX] basename 속성 추가!
        이제 라우터가 '/aquarium' 뒤에 오는 주소부터 읽기 시작합니다. */}
    <BrowserRouter basename="/aquarium">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
