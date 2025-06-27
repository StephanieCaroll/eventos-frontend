// Centraliza as operações de autenticação e manipulação de JWT.
//Resolvi comentar esse código pq ele é de DIFICIL entendimento, mas o importante é que ele funciona. :)
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // decodifica o token JWT

export const TOKEN_SESSION_ATTRIBUTE_NAME = 'token';
export const EXPIRATION_SESSION_ATTRIBUTE_NAME = 'expiration';
export const ROLES_SESSION_ATTRIBUTE_NAME = 'userRoles'; // Atributo para armazenar os papéis do usuário
export const USERNAME_SESSION_ATTRIBUTE_NAME = 'username'; // Atributo para armazenar o nome de usuário

// Registra um login bem-sucedido, armazenando o token, sua expiração, papéis e nome de usuário.
// O 'expirationInSeconds' recebido aqui DEVE ser o timestamp 'exp' do JWT (em segundos) do backend.
export const registerSuccessfulLoginForJwt = (token, expirationInSeconds) => { 
  // Converte a expiração de segundos para milissegundos para armazenar
  const expirationMs = parseInt(expirationInSeconds, 10) * 1000;

  localStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token);
  localStorage.setItem(EXPIRATION_SESSION_ATTRIBUTE_NAME, expirationMs.toString()); // Armazena a expiração em milissegundos

  // Decodifica o token para extrair os dados e armazena-os no localStorage
  const decodedData = decodeTokenData(token);
  localStorage.setItem(ROLES_SESSION_ATTRIBUTE_NAME, JSON.stringify(decodedData.roles));
  localStorage.setItem(USERNAME_SESSION_ATTRIBUTE_NAME, decodedData.username);

  setupAxiosInterceptors(); // Configura os cabeçalhos do Axios com o novo token
};

// Configura os interceptores do Axios para adicionar o token JWT em todas as requisições.
export const setupAxiosInterceptors = () => {
  let token = createJWTToken(localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME));

  if (isUserLoggedIn()) {
    axios.defaults.headers.common['Authorization'] = token; // Adiciona o cabeçalho de autorização se o usuário estiver logado
  } else {
    delete axios.defaults.headers.common['Authorization']; // Remove o cabeçalho se não houver token válido
  }
};

// Adiciona o prefixo "Bearer " ao token JWT.
export const createJWTToken = (token) => {
  return 'Bearer ' + token;
};

// Realiza o logout, limpando todos os dados de autenticação do localStorage e do Axios.
export const logout = () => {
  localStorage.clear(); // Limpa todos os itens relacionados à sessão
  delete axios.defaults.headers.common['Authorization']; // Remove o cabeçalho de autorização
};

// Verifica se o token JWT armazenado expirou.
export const isTokenExpired = () => {
  let expirationMs = localStorage.getItem(EXPIRATION_SESSION_ATTRIBUTE_NAME);
  // Se não houver expiração, ou se a data atual (milissegundos) for maior ou igual à expiração (milissegundos), retorna true.
  return expirationMs === null || parseInt(expirationMs, 10) < new Date().getTime(); 
};

// Verifica se o usuário está logado (possui um token válido e não expirado).
export const isUserLoggedIn = () => {
  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
  if (token === null || token === '') { // Adicionado verificação para string vazia
    return false; // Não logado se não houver token
  }
  // Se houver um token, verifica se ele está expirado.
  // IMPORTANTE: isTokenExpired depende da `expirationMs` estar corretamente armazenada (em milissegundos).
  return !isTokenExpired(); 
};

// Retorna o token JWT armazenado.
export const getToken = () => {
  let token = localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
  if (token === null) return ''; // Retorna string vazia se não houver token
  return token;
};

// Decodifica o token JWT e retorna os papéis e o nome de usuário.
export const decodeTokenData = (token) => { 
  try {
    const decodedToken = jwtDecode(token);
    // IMPORTANTE: O nome da claim 'roles' deve corresponder ao que seu backend envia.
    // Se o backend usar 'authorities' ou 'scope', ajuste aqui:
    const roles = decodedToken.roles || decodedToken.authorities || decodedToken.scope || []; 
    const username = decodedToken.sub || 'Usuário Desconhecido'; // 'sub' é o campo padrão para o assunto/usuário

    // Converte roles para array se for uma string separada por espaço (comum em alguns JWTs)
    if (typeof roles === 'string') {
      return { roles: roles.split(' '), username };
    }
    
    // Garante que roles é um array
    if (!Array.isArray(roles)) {
        console.warn("Claim 'roles' no JWT não é um array. Convertendo para array vazio.");
        return { roles: [], username };
    }

    return { roles, username }; 
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return { roles: [], username: 'Usuário Desconhecido' }; // Retorna padrão em caso de erro
  }
};

// Retorna os papéis do usuário armazenados no localStorage.
export const getUserRoles = () => {
  const rolesString = localStorage.getItem(ROLES_SESSION_ATTRIBUTE_NAME);
  try {
    return rolesString ? JSON.parse(rolesString) : []; // Tenta fazer o parse da string JSON de papéis
  } catch (error) {
    console.error('Erro ao parsear papéis do localStorage:', error);
    return []; // Em caso de erro no parse, retorna array vazio
  }
};

// Retorna o nome de usuário armazenado no localStorage.
export const getUsername = () => {
  return localStorage.getItem(USERNAME_SESSION_ATTRIBUTE_NAME) || 'Usuário Desconhecido';
};
