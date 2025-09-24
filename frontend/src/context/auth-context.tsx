import { createContext, useContext } from "react";

// Descreve o payload que esperamos de dentro do nosso JWT
interface UserPayload {
  id: string;
  iat: number;
  exp: number;
  sessionToken: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
    emailVerified: boolean;
    name: string;
    image: string;
    password: string;
    provider: string;
    updatedAt: string;
    Status:{
      best_streak: number;
      total_themes: number;
      total_cards: number;
      total_corrects: number;
      total_games: number;
      total_score: number;
      total_wrongs: number;
      updated_at: string;
      userId: string;
    }
  }
  // Campos padrão do JWT (iat: issued at, exp: expiration time)
}
interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (jwtToken: string) => void;
  logout: () => void;
}
// --- 2. CRIAÇÃO DO CONTEXTO E HOOK ---

// Criamos o contexto com um valor inicial nulo e a tipagem correta
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook customizado para consumir o contexto de forma segura e tipada
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
