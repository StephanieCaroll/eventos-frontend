import { useState } from 'react';

const StandManagementButton = ({ selectedEventId, onStandUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!selectedEventId) {
      alert('Por favor, selecione um evento primeiro.');
      return;
    }
    setIsModalOpen(true);
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: '48px',
    padding: '0 30px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%'
  };

  const closeButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        style={buttonStyle}
        title="Gerenciar Stands"
      >
        ⚙️ Gerenciar Stands
      </button>

      {isModalOpen && (
        <div 
          style={modalOverlayStyle}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Gerenciar Stands - Evento {selectedEventId}</h3>
            <p>Modal de gerenciamento de stands será implementado aqui.</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={closeButtonStyle}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandManagementButton;