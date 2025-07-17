import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  isTokenExpired,
  logout as authLogout,
  registerSuccessfulLoginForJwt,
  decodeTokenData,
  getUserId, 
} from './views/util/AuthenticationService'; 

export const AuthContext = createContext({
  isAuthenticated: false,
  userRoles: [],
  userName: 'Convidado',
  userEmail: null,
  userId: null, 
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
  const [userId, setUserId] = useState(null); 
  const [authToken, setAuthToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const checkAuthentication = useCallback(() => {
    const token = getToken();
    const expired = isTokenExpired();

    console.log('[AuthContext] Verificando autenticação...');
    console.log('[AuthContext] Token existe:', token ? 'Sim' : 'Não');
    console.log('[AuthContext] Token expirado:', expired);

    if (token && !expired) {
      try {
        const decodedData = decodeTokenData(token);
        console.log('[AuthContext] Dados decodificados:', decodedData);

        setIsAuthenticated(true);
        setUserRoles(decodedData.roles || []);
        setUserName(decodedData.username || 'Usuário');
        setUserEmail(decodedData.email || null);
        setUserId(decodedData.userId || null);
        setAuthToken(token);

        console.log('[AuthContext] Usuário autenticado com sucesso. userId:', decodedData.userId);
      } catch (error) {
        console.error('[AuthContext] Erro ao decodificar token:', error);
        logout(); 
      }
    } else {
      console.log('[AuthContext] Nenhum token válido encontrado ou token expirado. Realizando logout...');
    
      authLogout(); 
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserName('Convidado');
      setUserEmail(null);
      setUserId(null);
      setAuthToken(null);
    }
    setIsAuthReady(true);
  }, []); 

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]); 

  const login = useCallback((token, expiration) => {
    console.log('[AuthContext] Realizando login...');
    registerSuccessfulLoginForJwt(token, expiration);
    checkAuthentication();
  }, [checkAuthentication]);

  const logout = useCallback(() => {
    console.log('[AuthContext] Realizando logout...');
    authLogout();
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserName('Convidado');
    setUserEmail(null);
    setUserId(null);
    setAuthToken(null);
  
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
        userId,
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