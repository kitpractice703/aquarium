import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // [필수] 여기서 라우터가 시작됨
import "./index.css";
import App from "./App.tsx";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      {" "}
      {/* 최상위 라우터 */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
