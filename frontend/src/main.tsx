import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Home from "./pages/Home.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard.tsx";
import { AuthProvider } from "./context/auth-provider.js";
import AuthCallback from "./pages/auth/AuthCallback.tsx";
import ProtectedRoute from "./components/protected/ProtectedRoute.tsx";
import CardsPage from "./pages/Cards.tsx";
import RankingsPage from "./pages/Ranking.tsx";
import { Bounce, ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GamePage from "./pages/Game.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
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
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/game" element={<GamePage />} />
              {/* Adicione outras rotas protegidas aqui, como /profile, /settings, etc. */}
            </Route>

            {/* Opcional: Uma rota "catch-all" para páginas não encontradas */}
            <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
