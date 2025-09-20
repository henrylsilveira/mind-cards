import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';


const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // 1. Lidar com o estado de carregamento inicial
  // É importante esperar o AuthProvider verificar se existe um token no localStorage.
  // Sem isso, um usuário já logado poderia ser redirecionado para /login ao recarregar a página.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Verificando autenticação...
      </div>
    );
  }

  // 2. A lógica principal de proteção
  // Se o usuário está autenticado, renderize a rota filha.
  // O componente <Outlet /> é um placeholder que o React Router substitui
  // pela rota que está sendo acessada (ex: <DashboardPage />).
  if (isAuthenticated) {
    return <Outlet />;
  }

  // 3. Se não estiver autenticado, redirecione para a página de login.
  // A prop "replace" substitui a entrada no histórico de navegação,
  // impedindo que o usuário use o botão "voltar" para acessar a página protegida novamente.
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;