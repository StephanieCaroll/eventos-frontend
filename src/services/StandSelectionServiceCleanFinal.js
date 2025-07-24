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

  // ========== ENDPOINTS ESPECÍFICOS PARA GERENCIADOR ==========
  
  // GERENCIADOR: Stands sem vínculo para vincular aos eventos
  getStandsSemVinculo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evento/stands-sem-vinculo`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands sem vínculo:', error);
      throw error;
    }
  },

  // GERENCIADOR: Vincular stands ao evento
  vincularStandsAoEvento: async (eventoId, standIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evento/${eventoId}/vincular-stands`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          standIds: standIds
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao vincular stands ao evento:', error);
      throw error;
    }
  },

  // GERENCIADOR: Stands vinculados ao evento
  getStandsVinculadosAoEvento: async (eventoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evento/${eventoId}/stands-disponiveis`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands vinculados ao evento:', error);
      throw error;
    }
  },

  // EXPOSITOR: Grid de stands por evento
  getStandGridByEvent: async (eventoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/grid?eventoId=${eventoId}`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar grid de stands do evento:', error);
      throw error;
    }
  },

  // EXPOSITOR: Operações em lote com estrutura correta
  batchOperationExpositor: async (userId, eventoId, standIds, tipoOperacao, descricaoReserva = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/batch`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          userId,
          eventoId,
          standIds,
          tipoOperacao, // "RESERVAR" ou "LIBERAR"
          descricaoReserva
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na operação em lote do expositor:', error);
      throw error;
    }
  },

  // EXPOSITOR: Toggle individual com estrutura correta
  toggleStandSelectionExpositor: async (userId, eventoId, standId, tipoOperacao) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/toggle`, {
        method: 'POST',
        headers: StandSelectionService.getHeaders(),
        body: JSON.stringify({
          userId,
          eventoId,
          standId,
          tipoOperacao // "RESERVAR" ou "LIBERAR"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao alternar seleção individual:', error);
      throw error;
    }
  },

  // EXPOSITOR: Buscar stands do evento (somente stands vinculados a esse evento)
  getEventStandsForExpositor: async (eventoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stand-selection/grid?eventoId=${eventoId}`, {
        method: 'GET',
        headers: StandSelectionService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar stands do evento para expositor:', error);
      throw error;
    }
  },

  // EXPOSITOR: Reservar stands em lote
  reservarStandsExpositor: async (userId, eventoId, standIds, descricaoReserva = '') => {
    return StandSelectionService.batchOperationExpositor(userId, eventoId, standIds, 'RESERVAR', descricaoReserva);
  },

  // EXPOSITOR: Liberar stands em lote
  liberarStandsExpositor: async (userId, eventoId, standIds, descricaoReserva = '') => {
    return StandSelectionService.batchOperationExpositor(userId, eventoId, standIds, 'LIBERAR', descricaoReserva);
  },

  // Buscar stands por evento específico
  getStandsByEvent: async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/stand-selection/grid?eventoId=${eventId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        // Se não conseguir conectar com o backend, retornar dados mock
        console.warn('Backend não disponível, usando dados mock');
        return StandSelectionService.generateMockStands();
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao buscar stands por evento:', error);
      // Retornar stands mock em caso de erro
      return StandSelectionService.generateMockStands();
    }
  },

  // Gerar stands mock para desenvolvimento
  generateMockStands: () => {
    const standsDisponiveis = [
      "A1", "A2", "A3", "A4",
      "B1", "B2", "B3", "B4", 
      "C1", "C2", "C3", "C4",
      "D1", "D2",
      "E1", "E2",
      "F1", "F2", 
      "G1", "G2", "G3",
      "H1", "H2", "H3",
      "I1", "I2", "I3"
    ];

    return standsDisponiveis.map((codigo, index) => ({
      id: index + 1,
      codigo: codigo,
      descricao: `Stand ${codigo}`,
      disponivel: Math.random() > 0.3, // 70% de chance de estar disponível
      ocupado: Math.random() < 0.3,    // 30% de chance de estar ocupado
      emailUsuario: null,
      eventoId: null,
      posicaoX: (index % 5) * 20 + 10,
      posicaoY: Math.floor(index / 5) * 15 + 10
    }));
  },

  // Métodos genéricos existentes (para compatibilidade)
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
  }
};

export default StandSelectionService;