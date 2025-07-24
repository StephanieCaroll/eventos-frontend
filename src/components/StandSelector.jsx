import { Grid } from 'lucide-react';
import { useContext, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { AuthContext } from '../AuthContext';
import StandSelectionService from '../services/StandSelectionService';
import StandVisualSelection from './StandVisualSelection';

const StandSelector = ({ 
  selectedStands = [], 
  onStandsChange, 
  eventId = null,
  eventName = null,
  showReservationButton = false
}) => {
  const [showVisualSelection, setShowVisualSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { userName } = useContext(AuthContext);

  const handleVisualSelectionClose = (changesWereMade) => {
    setShowVisualSelection(false);
    if (changesWereMade && onStandsChange) {
      // Atualizar lista após mudanças
      onStandsChange([]);
    }
  };

  const handleStandsUpdate = (updatedStands) => {
    if (onStandsChange) {
      onStandsChange(updatedStands);
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
      <div className="d-grid gap-2 mb-3">
        <Button
          variant="primary"
          onClick={() => setShowVisualSelection(true)}
          size="lg"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Grid size={20} />
          {selectedStands.length > 0 
            ? `Stands Selecionados: ${selectedStands.join(', ')}`
            : 'Abrir Seleção Visual de Stands'
          }
        </Button>
      </div>

      {/* Botão de reserva (se habilitado) */}
      {showReservationButton && selectedStands.length > 0 && (
        <div className="d-grid">
          <Button
            variant="success"
            onClick={handleReserveStands}
            disabled={isLoading}
            style={{
              fontWeight: '600',
              borderRadius: '8px',
              padding: '12px'
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
              `Reservar ${selectedStands.length} Stand(s)`
            )}
          </Button>
        </div>
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
            preSelectedStands={selectedStands}
            onStandsUpdate={handleStandsUpdate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StandSelector;