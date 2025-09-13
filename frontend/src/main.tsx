import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Home from "./pages/Home.tsx";
import { SessionProvider } from "next-auth/react";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <Home />
    </SessionProvider>
  </StrictMode>
);
