import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import StandSelectionService from '../services/StandSelectionServiceFinal';

const useStandSelection = () => {
  const [standsData, setStandsData] = useState([]);
  const [selectedStands, setSelectedStands] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userName } = useContext(AuthContext);

  // Carregar dados dos stands
  const loadStands = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const stands = await StandSelectionService.getStandsForSelection();
      setStandsData(stands || []);
    } catch (error) {
      console.error('Erro ao carregar stands:', error);
      setError('Erro ao carregar stands. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadStands();
  }, []);

  // Alternar seleção de um stand
  const toggleStandSelection = (standId) => {
    setSelectedStands(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(standId)) {
        newSelection.delete(standId);
      } else {
        newSelection.add(standId);
      }
      return newSelection;
    });
  };

  // Limpar seleção
  const clearSelection = () => {
    setSelectedStands(new Set());
  };

  // Selecionar todos os stands disponíveis
  const selectAllAvailable = () => {
    const availableStands = standsData
      .filter(stand => stand?.disponivel)
      .map(stand => stand.id);
    
    setSelectedStands(new Set(availableStands));
  };

  // Processar reserva/liberação
  const processReservation = async (operacao, eventoId = null, observacoes = '') => {
    if (selectedStands.size === 0) {
      throw new Error('Nenhum stand selecionado');
    }

    if (!userName) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError('');

    try {
      const standIds = Array.from(selectedStands);
      
      // Se for um único stand, usar endpoint individual
      if (standIds.length === 1) {
        await StandSelectionService.processReservation(
          standIds[0],
          eventoId,
          userName,
          operacao,
          observacoes
        );
      } else {
        // Para múltiplos stands, usar operação em lote
        await StandSelectionService.batchOperation(
          standIds,
          eventoId,
          userName,
          operacao,
          observacoes
        );
      }

      // Recarregar dados após operação
      await loadStands();
      
      // Limpar seleção
      clearSelection();

      const message = operacao === 'RESERVAR' 
        ? `${standIds.length} stand(s) reservado(s) com sucesso!`
        : `${standIds.length} stand(s) liberado(s) com sucesso!`;
      
      return message;
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      const errorMessage = error.message || 'Erro ao processar operação. Tente novamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo stand
  const createStand = async (codigo, eventoId) => {
    if (!userName) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError('');

    try {
      await StandSelectionService.createStand(codigo, userName, eventoId);
      await loadStands(); // Recarregar dados
      return 'Stand criado com sucesso!';
    } catch (error) {
      console.error('Erro ao criar stand:', error);
      const errorMessage = error.message || 'Erro ao criar stand. Tente novamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    standsData,
    selectedStands,
    isLoading,
    error,
    setError,
    toggleStandSelection,
    clearSelection,
    selectAllAvailable,
    processReservation,
    createStand,
    loadStands
  };
};

export default useStandSelection;