const API_BASE_URL = 'http://localhost:8080';

const StandSelectionService = {
  // Obter token de autenticação
  getAuthToken: () => {
    return localStorage.getItem('token');
  },

  // Headers padrão com autenticação
  getHeaders: () => {
    const token = StandSelectionService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  // Lista stands para seleção visual
  getStandsForSelection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand/selecao`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands para seleção:', error);
      throw error;
    }
  },

  // Processar reserva/liberação individual
  processReservation: async (standId, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand/processar-reserva`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          standId,
          eventoId,
          usuarioId,
          operacao, // "RESERVAR" ou "LIBERAR"
          observacoes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      throw error;
    }
  },

  // Operações em lote (múltiplos stands)
  batchOperation: async (standIds, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/batch`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          standIds,
          eventoId,
          usuarioId,
          operacao, // "RESERVAR" ou "LIBERAR"
          observacoes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na operação em lote:', error);
      throw error;
    }
  },

  // Stands disponíveis para um evento específico
  getAvailableStands: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand/disponiveis-evento/${eventId}`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands disponíveis:', error);
      throw error;
    }
  },

  // Criar novo stand
  createStand: async (codigo, userId, eventoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          codigo,
          userId,
          eventoId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar stand:', error);
      throw error;
    }
  },

  // Buscar stands registrados do usuário
  getRegisteredStands: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand/registered?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands registrados:', error);
      throw error;
    }
  },

  // Buscar eventos disponíveis
  getEventos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evento`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }
};

export default StandSelectionService;