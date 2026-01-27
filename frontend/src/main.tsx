import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalStyle } from "./styles/GlobalStyle.ts";
import { AuthProvider } from "./context/AuthContext.tsx"; // 👈 추가

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      {" "}
      {/* 👈 이걸로 감싸야 작동함 */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
