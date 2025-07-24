import { useCallback, useState } from 'react';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';

const useStandSelection = () => {
  const [standsData, setStandsData] = useState([]);
  const [selectedStands, setSelectedStands] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStands = useCallback(async (eventId, userEmail) => {
    try {
      setIsLoading(true);
      setError('');
      
      const stands = await StandSelectionService.getStandsByEvent(eventId);
      setStandsData(stands);
    } catch (err) {
      console.error('Erro ao buscar stands:', err);
      setError('Erro ao carregar stands');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStandSelection = useCallback((standId) => {
    setSelectedStands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(standId)) {
        newSet.delete(standId);
      } else {
        newSet.add(standId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedStands(new Set());
  }, []);

  const selectAllAvailable = useCallback(() => {
    const availableStands = standsData
      .filter(stand => stand.disponivel)
      .map(stand => stand.id);
    setSelectedStands(new Set(availableStands));
  }, [standsData]);

  const processReservation = useCallback(async (operation, eventId, observacoes) => {
    // Placeholder para processamento de reservas
    return `${selectedStands.size} stand(s) processado(s) com sucesso!`;
  }, [selectedStands.size]);

  return {
    standsData,
    selectedStands,
    isLoading,
    error,
    toggleStandSelection,
    clearSelection,
    selectAllAvailable,
    processReservation,
    setError,
    fetchStands
  };
};

export default useStandSelection;