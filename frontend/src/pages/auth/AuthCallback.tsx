import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';


const AuthCallback: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URLSearchParams é uma forma fácil de ler os parâmetros da URL (a parte depois do "?")
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); // Tentamos pegar o 'token' da URL

    if (token) {
      console.log("Token recebido na callback, finalizando login...");
      // Se encontramos um token, chamamos a função de login do nosso contexto
      login(token);

      // E então redirecionamos o usuário para o dashboard.
      // O `replace: true` impede que o usuário volte para esta página de callback com o botão "voltar" do navegador.
      navigate('/dashboard', { replace: true });
    } else {
      // Se não houver token, algo deu errado. Enviamos o usuário de volta para a página de login.
      console.error("Callback de autenticação chamado sem um token.");
      navigate('/', { replace: true });
    }
    
    // As dependências garantem que este efeito rode apenas se algo relevante mudar.
  }, [login, navigate, location]);

  // Enquanto o useEffect processa, exibimos uma mensagem de carregamento.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Processando sua autenticação...
    </div>
  );
};

export default AuthCallback;