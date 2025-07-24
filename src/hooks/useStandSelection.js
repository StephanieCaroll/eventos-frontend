import { useEffect, useState } from 'react';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';

const useStandSelection = (eventId) => {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStands = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        const standsData = await StandSelectionService.getEventStandsForExpositor(eventId);
        setStands(standsData || []);
      } catch (err) {
        console.error('Erro ao buscar stands:', err);
        setError(err.message || 'Erro ao carregar stands');
        // Em caso de erro, usar array vazio
        setStands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStands();
  }, [eventId]);

  const updateStandSelection = (standId, selected) => {
    setStands(prevStands => 
      prevStands.map(stand => 
        stand.id === standId 
          ? { ...stand, selected }
          : stand
      )
    );
  };

  const getSelectedStands = () => {
    return stands.filter(stand => stand.selected);
  };

  return {
    stands,
    loading,
    error,
    updateStandSelection,
    getSelectedStands,
    setStands
  };
};

export default useStandSelection;