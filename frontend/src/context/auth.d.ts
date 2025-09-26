export interface UserPayload {
  userId: string;
  sessionToken: string;
  name?: string; // Opcional, dependendo do seu JWT
  picture?: string; // Opcional
  iat: number;
  exp: number;
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
    Status: {
      best_streak: number;
      total_themes: number;
      total_cards: number;
      total_corrects: number;
      total_games: number;
      total_score: number;
      total_wrongs: number;
      updated_at: string;
      userId: string;
    };
  };
}

export interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (jwtToken: string) => void;
  logout: () => void;
}
