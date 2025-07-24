import { Check, Grid, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Alert, Badge, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';
import StandVisualSelection from './StandVisualSelectionNew';

// Lista de stands disponíveis
const STANDS_DISPONIVEIS = [
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

const StandReservationForm = ({ eventId, eventName, onStandsUpdate }) => {
  const [selectedStands, setSelectedStands] = useState([]);
  const [availableStands, setAvailableStands] = useState([]);
  const [showVisualSelection, setShowVisualSelection] = useState(false);
  const [showManualSelection, setShowManualSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { userName } = useContext(AuthContext);

  // Carregar stands disponíveis para o evento
  useEffect(() => {
    if (eventId) {
      loadAvailableStands();
    }
  }, [eventId]);

  const loadAvailableStands = async () => {
    setIsLoading(true);
    try {
      const stands = await StandSelectionService.getAvailableStands(eventId);
      setAvailableStands(stands || []);
    } catch (error) {
      console.error('Erro ao carregar stands:', error);
      setError('Erro ao carregar stands disponíveis.');
    } finally {
      setIsLoading(false);
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
      
      // Atualizar lista de stands disponíveis
      await loadAvailableStands();
      
      // Notificar componente pai se necessário
      if (onStandsUpdate) {
        onStandsUpdate(selectedStands);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao reservar stands:', error);
      setError('Erro ao reservar stands. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar seleção de stand
  const toggleStand = (standCode) => {
    setSelectedStands(prev => 
      prev.includes(standCode)
        ? prev.filter(s => s !== standCode)
        : [...prev, standCode]
    );
  };

  // Filtrar stands por busca
  const filteredStands = STANDS_DISPONIVEIS.filter(stand =>
    stand.toLowerCase().includes(searchTerm.toLowerCase()) &&
    availableStands.some(available => available.codigo === stand)
  );

  // Fechar seleção visual
  const handleVisualSelectionClose = (changesWereMade) => {
    setShowVisualSelection(false);
    if (changesWereMade) {
      loadAvailableStands();
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      border: '1px solid #334155'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: '#3b82f6', margin: 0, fontSize: '1.4em' }}>
          Reservar Stands {eventName && `- ${eventName}`}
        </h5>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowVisualSelection(true)}
            style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
          >
            <Grid size={16} className="me-1" />
            Seleção Visual
          </Button>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      {/* Stands selecionados */}
      {selectedStands.length > 0 && (
        <div className="mb-3">
          <h6 style={{ color: '#e2e8f0', marginBottom: '10px' }}>
            Stands Selecionados ({selectedStands.length}):
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedStands.map(stand => (
              <Badge
                key={stand}
                bg="primary"
                className="d-flex align-items-center gap-1"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleStand(stand)}
              >
                {typeof stand === 'object' ? (stand.codigo || stand.id || stand) : stand}
                <X size={12} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Botão de reserva */}
      <div className="d-grid">
        <Button
          variant="success"
          onClick={handleReserveStands}
          disabled={selectedStands.length === 0 || isLoading}
          style={{
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            fontWeight: '600'
          }}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Processando...
            </>
          ) : (
            <>
              <Check size={16} className="me-2" />
              Reservar {selectedStands.length > 0 ? `${selectedStands.length} Stand(s)` : 'Stands'}
            </>
          )}
        </Button>
      </div>

      {/* Modal de Seleção Visual */}
      <Modal
        show={showVisualSelection}
        onHide={() => setShowVisualSelection(false)}
        size="xl"
        fullscreen
      >
        <Modal.Body className="p-0">
          <StandVisualSelection
            onClose={handleVisualSelectionClose}
            eventId={eventId}
            eventName={eventName}
            managementMode={false}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StandReservationForm;