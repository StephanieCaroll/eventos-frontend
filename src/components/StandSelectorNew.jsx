import { Grid } from 'lucide-react';
import { useContext, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { AuthContext } from '../AuthContext';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';
import StandVisualSelection from './StandVisualSelectionRedirect';

const StandSelectorNew = ({ 
  selectedStands = [], 
  onStandsChange, 
  eventId = null,
  eventName = null,
  showReservationButton = true
}) => {
  const [showVisualSelection, setShowVisualSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { userName } = useContext(AuthContext);

  const handleVisualSelectionClose = (changesWereMade) => {
    setShowVisualSelection(false);
    if (changesWereMade) {
      // Notificar o componente pai sobre mudanças
      if (onStandsChange) {
        onStandsChange([]);
      }
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
      
      // Limpar seleção
      if (onStandsChange) {
        onStandsChange([]);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao reservar stands:', error);
      setError('Erro ao reservar stands. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Mensagens */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-3">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible className="mb-3">
          {success}
        </Alert>
      )}

      {/* Botão principal de seleção visual */}
      <Button
        variant="primary"
        onClick={() => setShowVisualSelection(true)}
        className="w-100 mb-3"
        style={{
          padding: "16px 20px",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: "600",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: 'none'
        }}
      >
        <Grid size={20} />
        {selectedStands.length > 0
          ? `Stands selecionados: ${selectedStands.map(stand => 
              typeof stand === 'object' ? (stand.codigo || stand.id || stand) : stand
            ).join(", ")}`
          : "Abrir Seleção Visual de Stands"}
      </Button>

      {/* Botão de reserva (se habilitado) */}
      {showReservationButton && selectedStands.length > 0 && (
        <Button
          variant="success"
          onClick={handleReserveStands}
          disabled={isLoading}
          className="w-100"
          style={{
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px'
          }}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Processando...
            </>
          ) : (
            `Reservar ${selectedStands.length} Stand(s)`
          )}
        </Button>
      )}

      {/* Modal de Seleção Visual */}
      <Modal
        isOpen={showVisualSelection}
        onRequestClose={() => setShowVisualSelection(false)}
        className="stand-management-modal"
        overlayClassName="modal-overlay-dark"
        ariaHideApp={false}
      >
        <div className="stand-visual-selection-container">
          <StandVisualSelection
            onClose={handleVisualSelectionClose}
            eventId={eventId}
            eventName={eventName}
            managementMode={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StandSelectorNew;