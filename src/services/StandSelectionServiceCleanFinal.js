const API_BASE_URL = 'http://localhost:8080';

const StandSelectionService = {
  getAuthToken: () => {
    return localStorage.getItem('token');
  },

  getHeaders: () => {
    const token = StandSelectionService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

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

  processReservation: async (standId, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand/processar-reserva`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          standId,
          eventoId,
          usuarioId,
          operacao,
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

  batchOperation: async (standIds, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/batch`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          standIds,
          eventoId,
          usuarioId,
          operacao,
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
  },

  // Buscar stands por evento
  getStandsByEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stand/selecao?eventoId=${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao buscar stands por evento:', error);
      throw error;
    }
  }
};

export default StandSelectionService;