import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./auth-context";

// --- 1. DEFINIÇÃO DOS TIPOS ---

// Descreve o payload que esperamos de dentro do nosso JWT
interface UserPayload {
  id: string;
  email: string;
  verified_email: boolean;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
  // Campos padrão do JWT (iat: issued at, exp: expiration time)
  iat: number;
  exp: number;
}

// Descreve o que nosso contexto vai fornecer
interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (jwtToken: string) => void;
  logout: () => void;
}

// Descreve as props que o nosso Provider vai receber
interface AuthProviderProps {
  children: ReactNode; // 'ReactNode' é o tipo correto para 'children'
}

// --- 3. O COMPONENTE PROVIDER ---

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estados tipados
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // Usamos o tipo genérico no jwtDecode para garantir o formato do retorno
          const decodedUser = jwtDecode<UserPayload>(storedToken);
          if (decodedUser.exp * 1000 > Date.now()) {
            setUser(decodedUser);
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Erro ao decodificar token. Removendo...", error);
          localStorage.removeItem("token");
        }
      }
    } catch (e) {
      console.error("Erro inesperado no useEffect do AuthProvider:", e);
    } finally {
      setLoading(false);
    }

    return () => {
      console.log("AuthProvider UNMOUNTED.");
    };
  }, []); // Dependência vazia = roda apenas uma vez

  // Funções tipadas com useCallback
  const login = useCallback((jwtToken: string): void => {
    try {
      localStorage.setItem("token", jwtToken);
      const decodedUser = jwtDecode<UserPayload>(jwtToken);
      setUser(decodedUser);
      setToken(jwtToken);
    } catch (error) {
      console.error("Erro ao fazer login: token inválido", error);
    }
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }, []);

  // Valor do contexto memorizado e tipado
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, token, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
