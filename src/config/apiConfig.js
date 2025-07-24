// URLs da API - Endpoints corretos
export const API_BASE_URL = 'http://localhost:8080';

export const API_URLS = {
  // Stands - Endpoints corretos do backend
  STANDS: `${API_BASE_URL}/api/stand`,
  STANDS_SELECAO: (eventoId, userId) => `${API_BASE_URL}/api/stand/selecao?eventoId=${eventoId}&userId=${encodeURIComponent(userId)}`,
  STANDS_PROCESSAR_RESERVA: `${API_BASE_URL}/api/stand/processar-reserva`,
  
  // Stand Selection
  STAND_SELECTION_GRID: `${API_BASE_URL}/api/stand-selection/grid`,
  STAND_SELECTION_BATCH: `${API_BASE_URL}/api/stand/batch-operation`,
  
  // Eventos
  EVENTOS: `${API_BASE_URL}/api/evento`,
  EVENT_AVAILABLE_STANDS: (eventoId) => `${API_BASE_URL}/api/evento/${eventoId}/stands-disponiveis`,
  
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
};

// Configuração padrão do Axios
export const getAxiosConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
};