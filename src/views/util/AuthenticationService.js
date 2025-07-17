// Centraliza as operações de autenticação e manipulação de JWT.
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token';
export const EXPIRATION_SESSION_ATTRIBUTE_NAME = 'expiration';
export const ROLES_SESSION_ATTRIBUTE_NAME = 'userRoles';
export const USERNAME_SESSION_ATTRIBUTE_NAME = 'username';
export const EMAIL_SESSION_ATTRIBUTE_NAME = 'userEmail';
export const USER_ID_SESSION_ATTRIBUTE_NAME = 'userId'; 

export const registerSuccessfulLoginForJwt = (token, expirationInSeconds) => {
  const expirationMs = parseInt(expirationInSeconds, 10) * 1000;

  localStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token);
  localStorage.setItem(EXPIRATION_SESSION_ATTRIBUTE_NAME, expirationMs.toString());

  const decodedData = decodeTokenData(token);
  localStorage.setItem(ROLES_SESSION_ATTRIBUTE_NAME, JSON.stringify(decodedData.roles));
  localStorage.setItem(USERNAME_SESSION_ATTRIBUTE_NAME, decodedData.username);
  localStorage.setItem(EMAIL_SESSION_ATTRIBUTE_NAME, decodedData.email);
 
  localStorage.setItem(USER_ID_SESSION_ATTRIBUTE_NAME, decodedData.userId);

  setupAxiosInterceptors();
};

export const setupAxiosInterceptors = () => {
  let token = createJWTToken(localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME));

  if (isUserLoggedIn()) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const createJWTToken = (token) => {
  return 'Bearer ' + token;
};

export const logout = () => {
  localStorage.clear(); 
  delete axios.defaults.headers.common['Authorization'];
};

export const isTokenExpired = () => {
  let expirationMs = localStorage.getItem(EXPIRATION_SESSION_ATTRIBUTE_NAME);
 
  return expirationMs === null || parseInt(expirationMs, 10) < new Date().getTime();
};

export const isUserLoggedIn = () => {
  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
  if (token === null || token === '') {
    return false;
  }
  return !isTokenExpired();
};

export const getToken = () => {
  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
  if (token === null) return '';
  return token;
};

export const decodeTokenData = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const roles = decodedToken.roles || decodedToken.authorities || decodedToken.scope || [];
    const username = decodedToken.sub || 'Utilizador Desconhecido';
    const email = decodedToken.email || decodedToken.sub || null;
   
    const userId = decodedToken.userId || decodedToken.sub || decodedToken.id || null;

    console.log("AuthenticationService: Decoded Token Payload (raw):", decodedToken);
    console.log("AuthenticationService: Decoded Token Data (processed):", { roles, username, email, userId }); 

    if (typeof roles === 'string') {
      return { roles: roles.split(' '), username, email, userId }; 
    }

    if (!Array.isArray(roles)) {
        console.warn("Claim 'roles' no JWT não é um array. Convertendo para array vazio.");
        return { roles: [], username, email, userId };
    }

    return { roles, username, email, userId }; 
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return { roles: [], username: 'Utilizador Desconhecido', email: null, userId: null }; 
  }
};

export const getUserRoles = () => {
  const rolesString = localStorage.getItem(ROLES_SESSION_ATTRIBUTE_NAME);
  try {
    return rolesString ? JSON.parse(rolesString) : [];
  } catch (error) {
    console.error('Erro ao fazer o parse dos papéis do localStorage:', error);
    return [];
  }
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_SESSION_ATTRIBUTE_NAME) || 'Utilizador Desconhecido';
};

export const getUserEmail = () => {
  return localStorage.getItem(EMAIL_SESSION_ATTRIBUTE_NAME) || null;
};

export const getUserId = () => {
    return localStorage.getItem(USER_ID_SESSION_ATTRIBUTE_NAME) || null;
};