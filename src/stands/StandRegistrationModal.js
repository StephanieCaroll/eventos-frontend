import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import StandVisualSelection from '../components/StandVisualSelectionNew';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';
import '../styles/StandManagement.css';

const StandRegistrationModal = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { userName } = useContext(AuthContext);
  
  const [selectedStands, setSelectedStands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventInfo, setEventInfo] = useState(null);

  // Carregar informações do evento
  useEffect(() => {
    if (eventId) {
      loadEventInfo();
    }
  }, [eventId]);

  const loadEventInfo = async () => {
    try {
      const eventos = await StandSelectionService.getEventos();
      const evento = eventos.find(e => e.id === parseInt(eventId));
      setEventInfo(evento);
    } catch (error) {
      console.error('Erro ao carregar informações do evento:', error);
      setError('Erro ao carregar informações do evento.');
    }
  };

  // Reservar stands selecionados
  const handleReserveStands = async () => {
    if (selectedStands.length === 0) {
      setError('Selecione pelo menos um stand.');
      return;
    }

    if (!userName) {
      setError('Usuário não autenticado.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Processar cada stand individualmente
      const promises = selectedStands.map(standCode => 
        StandSelectionService.createStand(standCode, userName, eventId)
      );

      await Promise.all(promises);
      
      setSuccess(`${selectedStands.length} stand(s) reservado(s) com sucesso!`);
      setSelectedStands([]);
      
      setTimeout(() => {
        navigate('/homeExpositor');
      }, 2000);
    } catch (error) {
      console.error('Erro ao reservar stands:', error);
      setError('Erro ao reservar stands. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fechar seleção visual
  const handleVisualSelectionClose = (changesWereMade) => {
    if (changesWereMade) {
      // Se houve mudanças, processar as seleções
      if (selectedStands.length > 0) {
        handleReserveStands();
      }
    } else {
      // Se não houve mudanças, voltar para home
      navigate('/homeExpositor');
    }
  };

  const handleStandSelectionUpdate = (stands) => {
    setSelectedStands(stands);
  };

  return (
    <div 
      style={{
        backgroundColor: '#0a192f',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="stand-visual-selection-container">
        <StandVisualSelection
          onClose={handleVisualSelectionClose}
          eventId={eventId}
          eventName={eventInfo?.nomeEvento || 'Evento'}
          managementMode={false}
          onStandsUpdate={handleStandSelectionUpdate}
        />
      </div>
    </div>
  );
};

export default StandRegistrationModal;