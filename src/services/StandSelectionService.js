import axios from 'axios';
import { API_BASE_URL, API_URLS, getAxiosConfig } from '../config/apiConfig';

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
  getStandsForSelection: async (eventoId = null, userId = null) => {
    try {
      let url = `${API_BASE_URL}/api/stand/selecao`;
      const params = new URLSearchParams();

      if (eventoId && eventoId !== 'null') {
        params.append('eventoId', eventoId);
      }
      if (userId && userId !== 'null') {
        params.append('userId', userId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Buscando stands com URL:', url);
      const response = await axios.get(url, getAxiosConfig());
      
      // Garantir que retorna array vazio se não houver dados
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar stands para seleção:', error);
      // Retornar array vazio em caso de erro para evitar quebras
      return [];
    }
  },

  // Grid visual de stands organizados
  getStandGrid: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stand-selection/grid`, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar grid de stands:', error);
      throw error;
    }
  },

  // Stands disponíveis para um evento específico
  getAvailableStands: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stand/disponiveis-evento/${eventId}`, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar stands disponíveis:', error);
      throw error;
    }
  },

  // Processar reserva/liberação individual
  processReservation: async (standId, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      const response = await axios.post(API_URLS.STANDS_PROCESSAR_RESERVA, {
        standId,
        eventoId,
        usuarioId,
        operacao, // "RESERVAR" ou "LIBERAR"
        observacoes
      }, getAxiosConfig());
      
      return response.data;
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      throw error;
    }
  },

  // Alternar seleção de um stand individual
  toggleStandSelection: async (standId, eventoId, usuarioId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/stand-selection/toggle`, {
        standId,
        eventoId,
        usuarioId
      }, getAxiosConfig());

      return response.data;
    } catch (error) {
      console.error('Erro ao alternar seleção:', error);
      throw error;
    }
  },

  // Operações em lote (múltiplos stands) - CORRIGIDO
  batchOperation: async (standIds, eventoId, usuarioId, operacao, observacoes = '') => {
    try {
      // Validação dos parâmetros
      if (!standIds || !Array.isArray(standIds) || standIds.length === 0) {
        throw new Error('Lista de stands não pode estar vazia');
      }
      if (!eventoId || isNaN(parseInt(eventoId))) {
        throw new Error('ID do evento é obrigatório e deve ser um número');
      }
      if (!usuarioId || typeof usuarioId !== 'string') {
        throw new Error('ID do usuário é obrigatório');
      }
      if (!operacao || !['RESERVAR', 'LIBERAR'].includes(operacao)) {
        throw new Error('Operação deve ser RESERVAR ou LIBERAR');
      }

      const requestData = {
        standIds: standIds.map(id => parseInt(id)), // Garantir que são números
        eventoId: parseInt(eventoId),
        usuarioId: usuarioId.toString(),
        operacao: operacao.toUpperCase(),
        observacoes: observacoes || ''
      };

      console.log('Enviando dados para batch operation:', requestData);

      const response = await axios.post(API_URLS.STAND_SELECTION_BATCH, requestData, getAxiosConfig());
      
      return response.data;
    } catch (error) {
      console.error('Erro na operação em lote:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Alias para compatibilidade com código existente
  batchStandOperation: async (standIds, eventoId, usuarioId, operacao, observacoes = '') => {
    return StandSelectionService.batchOperation(standIds, eventoId, usuarioId, operacao, observacoes);
  },

  // Criar novo stand
  createStand: async (codigo, userId, eventoId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/stand`, {
        codigo,
        userId,
        eventoId
      }, getAxiosConfig());

      return response.data;
    } catch (error) {
      console.error('Erro ao criar stand:', error);
      throw error;
    }
  },

  // Listar todos os stands
  getAllStands: async () => {
    try {
      const response = await axios.get(API_URLS.STANDS, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os stands:', error);
      throw error;
    }
  },

  // Buscar eventos disponíveis
  getEventos: async () => {
    try {
      const response = await axios.get(API_URLS.EVENTOS, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  },

  // Buscar stands registrados do usuário
  getRegisteredStands: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stand/registered?userId=${encodeURIComponent(userId)}`, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar stands registrados:', error);
      throw error;
    }
  },

  // Funções para compatibilidade com código existente
  getAvailableStandsForEvent: async (eventId) => {
    return StandSelectionService.getAvailableStands(eventId);
  },

  getUserStandsByEvent: async (userId, eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stand/usuario`, {
        params: { userId, eventoId: eventId },
        ...getAxiosConfig()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar stands do usuário por evento:', error);
      throw error;
    }
  },

  getUserRegisteredStands: async (userId) => {
    return StandSelectionService.getRegisteredStands(userId);
  },

  // Stands disponíveis para seleção em um evento (do EventoController)
  async getEventAvailableStands(eventoId) {
    try {
      const response = await axios.get(API_URLS.EVENT_AVAILABLE_STANDS(eventoId), getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar stands disponíveis do evento:', error);
      throw error;
    }
  }
};

export default StandSelectionService;

// Função de debug para testar o endpoint batch
export const debugBatchOperation = async (standIds, eventoId, usuarioId, operacao) => {
  const requestData = {
    standIds: standIds.map(id => parseInt(id)),
    eventoId: parseInt(eventoId),
    usuarioId: usuarioId.toString(),
    operacao: operacao.toUpperCase(),
    observacoes: 'Teste de debug'
  };

  console.log('=== DEBUG BATCH OPERATION ===');
  console.log('URL:', 'http://localhost:8080/api/stand-selection/batch');
  console.log('Method:', 'POST');
  console.log('Headers:', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  console.log('Request Data:', JSON.stringify(requestData, null, 2));
  console.log('============================');

  try {
    const response = await axios.post(
      'http://localhost:8080/api/stand-selection/batch',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    console.log('✅ Sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    throw error;
  }
};