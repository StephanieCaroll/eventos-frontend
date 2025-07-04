import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  isTokenExpired,
  logout as authLogout, 
  registerSuccessfulLoginForJwt,
  decodeTokenData,
} from './views/util/AuthenticationService';

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

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userName, setUserName] = useState('Convidado');
  const [userEmail, setUserEmail] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const checkAuthentication = useCallback(() => {
    const token = getToken();
    const expired = isTokenExpired();

    // Adicione console.log para depurar o token e seu estado
    console.log('AuthContext: checkAuthentication executado.');
    console.log('AuthContext: Token encontrado:', token ? 'Sim' : 'Não');
    console.log('AuthContext: Token expirado:', expired);

    if (token && !expired) {
      const decodedData = decodeTokenData(token);
      setIsAuthenticated(true);
      setUserRoles(decodedData.roles || []); 
      setUserName(decodedData.username);
      setUserEmail(decodedData.email || decodedData.username);
      setAuthToken(token);
      console.log('AuthContext: Usuário está autenticado.');
    } else {
      // Se não há token válido, apenas reseta o estado, mas NÃO CHAMA authLogout() aqui
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserName('Convidado');
      setUserEmail(null);
      setAuthToken(null);
      console.log('AuthContext: Usuário NÃO está autenticado (ou token expirado/ausente).');

    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const login = useCallback((token, expiration) => {
    registerSuccessfulLoginForJwt(token, expiration);
    checkAuthentication(); 
  }, [checkAuthentication]);


  const logout = useCallback(() => {
    authLogout(); 
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserName('Convidado');
    setUserEmail(null);
    setAuthToken(null);
    setIsAuthReady(true); 
    console.log('AuthContext: Logout realizado com sucesso.');
  }, []);

  const hasRole = useCallback((role) => {
    return userRoles.includes(role);
  }, [userRoles]); 

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