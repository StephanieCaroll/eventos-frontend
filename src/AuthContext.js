// src/AuthContext.js
// Este arquivo define o contexto de autenticação e o provedor para a aplicação React.
import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  isTokenExpired,
  logout as authLogout, // Renomeia para evitar conflito com a função local de logout do contexto
  registerSuccessfulLoginForJwt,
  decodeTokenData, // Importa decodeTokenData
  getUsername // Importa getUsername para verificar o valor inicial
} from './views/util/AuthenticationService'; // Caminho de importação para 'src/views/util'

// Cria o contexto de autenticação
export const AuthContext = createContext({
  isAuthenticated: false,
  userRoles: [],
  userName: 'Convidado', // Adiciona userName ao contexto
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  isAuthReady: false, // Indica se a verificação inicial de autenticação foi concluída
});

// Componente Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userName, setUserName] = useState('Convidado'); // Novo estado para userName
  const [isAuthReady, setIsAuthReady] = useState(false); // Novo estado para prontidão da autenticação

  // Função para verificar o status de autenticação do usuário
  const checkAuthentication = useCallback(() => {
    const token = getToken();
    const expired = isTokenExpired();
    
    console.log('[AuthContext] Verificando autenticação...');
    console.log('[AuthContext] Token:', token ? 'Presente' : 'Ausente', 'Expirado:', expired);

    if (token && !expired) {
      const decodedData = decodeTokenData(token); // Usa decodeTokenData
      setIsAuthenticated(true);
      setUserRoles(decodedData.roles);
      setUserName(decodedData.username); // Define o nome de usuário
      console.log('[AuthContext] Usuário autenticado. Papéis:', decodedData.roles, 'Nome:', decodedData.username);
    } else {
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserName('Convidado'); // Limpa o nome de usuário
      authLogout(); // Garante que o token inválido seja removido do localStorage
      console.log('[AuthContext] Usuário não autenticado ou token expirado.');
    }
    setIsAuthReady(true); // Marca que a verificação inicial foi concluída
    console.log('[AuthContext] Autenticação pronta.');
  }, []);

  // Efeito para verificar a autenticação ao carregar o componente
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Função de login que será exposta pelo contexto
  const login = (token, expiration) => {
    // 'expiration' aqui é o tokenExpiresInSeconds do backend
    registerSuccessfulLoginForJwt(token, expiration);
    // Não precisa decodificar novamente aqui, pois registerSuccessfulLoginForJwt já faz isso
    checkAuthentication(); // Atualiza o estado de autenticação após o login com os dados frescos
  };

  // Função de logout que será exposta pelo contexto
  const logout = () => {
    authLogout(); // Chama a função de logout do serviço de autenticação
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserName('Convidado'); // Limpa o nome de usuário ao fazer logout
    console.log('[AuthContext] Logout realizado.');
  };

  // Função para verificar se o usuário possui um determinado papel
  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRoles,
        userName, // Expõe o nome de usuário
        login,
        logout,
        hasRole,
        isAuthReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
