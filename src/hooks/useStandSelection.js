import { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import StandSelectionService from '../services/StandSelectionService';

export const useStandSelection = () => {
  const { userEmail, userId } = useContext(AuthContext);
  const [standsData, setStandsData] = useState([]);
  const [selectedStands, setSelectedStands] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStands = async (eventoId, userId) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Usar os parâmetros fornecidos ou valores padrão
      const eventIdToUse = eventoId || null;
      const userIdToUse = userId || userEmail;
      
      let stands;
      if (eventIdToUse && userIdToUse) {
        // Busca stands específicos do evento com status de ocupação
        stands = await StandSelectionService.getStandsForSelection(eventIdToUse, userIdToUse);
      } else {
        // Busca todos os stands
        stands = await StandSelectionService.getAllStands();
      }
      
      setStandsData(Array.isArray(stands) ? stands : []);
    } catch (error) {
      console.error('Erro ao buscar stands:', error);
      setError('Erro ao carregar stands. Tente novamente.');
      setStandsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStandSelection = (standId) => {
    const newSelected = new Set(selectedStands);
    if (newSelected.has(standId)) {
      newSelected.delete(standId);
    } else {
      newSelected.add(standId);
    }
    setSelectedStands(newSelected);
  };

  const clearSelection = () => {
    setSelectedStands(new Set());
  };

  const selectAllAvailable = () => {
    const availableStands = standsData.filter(stand => stand?.disponivel);
    const newSelected = new Set([...selectedStands, ...availableStands.map(s => s.id)]);
    setSelectedStands(newSelected);
  };

  const processReservation = async (operation, eventoId = null, observacoes = '') => {
    if (selectedStands.size === 0) {
      throw new Error('Selecione ao menos um stand');
    }

    try {
      setIsLoading(true);
      setError('');
      
      const standIds = Array.from(selectedStands);
      const currentUserId = userId || userEmail;
      
      await StandSelectionService.batchOperation(
        standIds,
        eventoId,
        currentUserId,
        operation,
        observacoes
      );
      
      setSelectedStands(new Set());
      
      // Recarrega os dados com os parâmetros corretos para manter sincronização
      if (eventoId && currentUserId) {
        await fetchStands(eventoId, currentUserId);
      } else {
        await fetchStands();
      }
      
      return `${standIds.length} stand(s) ${operation === 'RESERVAR' ? 'reservado(s)' : 'liberado(s)'} com sucesso!`;
    } catch (error) {
      console.error(`Erro ao ${operation.toLowerCase()} stands:`, error);
      const errorMessage = error.response?.data?.message || `Erro ao ${operation.toLowerCase()} stands. Tente novamente.`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Remover o useEffect automático para evitar carregamentos desnecessários
  // useEffect(() => {
  //   fetchStands();
  // }, []);

  const refreshStands = async (eventoId = null, userIdParam = null) => {
    const eventIdToUse = eventoId;
    const userIdToUse = userIdParam || userId || userEmail;
    
    if (eventIdToUse && userIdToUse) {
      await fetchStands(eventIdToUse, userIdToUse);
    } else {
      await fetchStands();
    }
  };

  return {
    standsData,
    selectedStands,
    isLoading,
    setIsLoading,
    error,
    toggleStandSelection,
    clearSelection,
    selectAllAvailable,
    processReservation,
    fetchStands,
    refreshStands,
    setError
  };
};

export default useStandSelection;