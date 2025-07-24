import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles/StandGrid.css';
import StandVisualSelection from './StandVisualSelection';

const StandManagementButton = ({ selectedEventId, onStandUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Controlar scroll do body quando modal abre/fecha
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    }

    // Cleanup quando componente desmonta
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    if (!selectedEventId) {
      alert('Por favor, selecione um evento primeiro.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = (changesWereMade) => {
    setIsModalOpen(false);
    if (changesWereMade && onStandUpdate) {
      onStandUpdate();
    }
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
    color: 'white',
    height: '48px',
    padding: '0 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        style={buttonStyle}
        title="Gerenciar Stands"
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
        }}
      >
        ⚙️ Gerenciar Stands
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => handleCloseModal(false)}
        className="stand-management-modal"
        overlayClassName="modal-overlay-dark"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="stand-visual-selection-container">
          <StandVisualSelection
            onClose={handleCloseModal}
            eventId={selectedEventId}
            managementMode={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StandManagementButton;