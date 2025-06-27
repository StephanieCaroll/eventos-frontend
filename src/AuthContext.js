// src/AuthContext.js
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

    if (token && !expired) {
      const decodedData = decodeTokenData(token);
      setIsAuthenticated(true);
      setUserRoles(decodedData.roles);
      setUserName(decodedData.username);
      setUserEmail(decodedData.email || decodedData.username);
      setAuthToken(token);
    } else {
      setIsAuthenticated(false);
      setUserRoles([]);
      setUserName('Convidado');
      setUserEmail(null);
      setAuthToken(null);
      authLogout();
    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const login = (token, expiration) => {
    registerSuccessfulLoginForJwt(token, expiration);
    checkAuthentication();
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
    setUserRoles([]);
    setUserName('Convidado');
    setUserEmail(null);
    setAuthToken(null);
  };

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