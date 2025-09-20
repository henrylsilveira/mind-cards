import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Home from "./pages/Home.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard.tsx";
import { AuthProvider } from "./context/auth-provider.js";
import AuthCallback from "./pages/auth/AuthCallback.tsx";
import ProtectedRoute from "./components/protected/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />

          {/* ESTA É A ROTA QUE FALTAVA */}
          {/* Ela é pública, pois qualquer um precisa poder chegar nela após o redirect do Google. */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Rotas Protegidas */}
          {/* O `ProtectedRoute` vai verificar se o usuário está logado. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Adicione outras rotas protegidas aqui, como /profile, /settings, etc. */}
          </Route>

          {/* Opcional: Uma rota "catch-all" para páginas não encontradas */}
          <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
