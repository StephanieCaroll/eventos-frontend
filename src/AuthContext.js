import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  isTokenExpired,
  logout as authLogout,
  registerSuccessfulLoginForJwt,
  decodeTokenData,
} from './views/util/AuthenticationService';

// Cria o contexto de autenticação
export const AuthContext = createContext({
  isAuthenticated: false,
  userRoles: [],
  userName: 'Convidado',
  userEmail: null,
  authToken: null,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  isAuthReady: false,
});

// Componente Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userName, setUserName] = useState('Convidado');
  const [userEmail, setUserEmail] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Função para verificar o status de autenticação do utilizador
  const checkAuthentication = useCallback(() => {
    const token = getToken();
    const expired = isTokenExpired();

    console.log('[AuthContext] Verificando autenticação...');
    console.log('[AuthContext] Token:', token ? 'Presente' : 'Ausente', 'Expirado:', expired);

    if (token && !expired) {
      const decodedData = decodeTokenData(token);
      setIsAuthenticated(true);
      setUserRoles(decodedData.roles);
      setUserName(decodedData.username);
      const emailFromToken = decodedData.email || decodedData.username;
      setUserEmail(emailFromToken);
      setAuthToken(token);
      console.log('[AuthContext] Utilizador autenticado. Papéis:', decodedData.roles, 'Nome:', decodedData.username, 'Email Set:', emailFromToken);
    } else {
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserName('Convidado');
      setUserEmail(null);
      setAuthToken(null);
      authLogout();
      console.log('[AuthContext] Utilizador não autenticado ou token expirado.');
    }
    setIsAuthReady(true);
    console.log('[AuthContext] Autenticação pronta.');
  }, []);

  // Efeito para verificar a autenticação ao carregar o componente
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Função de login que será exposta pelo contexto
  const login = (token, expiration) => {
    registerSuccessfulLoginForJwt(token, expiration);
    checkAuthentication();
  };

  // Função de logout que será exposta pelo contexto
  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserName('Convidado');
    setUserEmail(null);
    setAuthToken(null);
    console.log('[AuthContext] Logout realizado.');
  };

  // Função para verificar se o utilizador possui um determinado papel
  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRoles,
        userName,
        userEmail,
        authToken,
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