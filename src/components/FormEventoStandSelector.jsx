import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import StandVisualSelection from './StandVisualSelection';

const FormEventoStandSelector = ({ onStandSelect, selectedEventId, userEmail, preSelectedStands = [] }) => {
  const [selectedStands, setSelectedStands] = useState(preSelectedStands);

  const handleStandSelection = (stands) => {
    setSelectedStands(stands);
    if (onStandSelect) {
      onStandSelect(stands);
    }
  };

  // Atualizar stands selecionados quando preSelectedStands mudar
  useEffect(() => {
    setSelectedStands(preSelectedStands);
  }, [preSelectedStands]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="stand-selector-container"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        margin: '20px 0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
    >
      <h3 style={{ 
        color: 'white', 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Seleção Visual de Stands
      </h3>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <StandVisualSelection
          eventId={selectedEventId}
          userEmail={userEmail}
          onStandUpdate={handleStandSelection}
          showControls={true}
          managementMode={true}
          hideEventSelector={true}
        />
      </div>
      
      {selectedStands.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'white'
          }}
        >
          <p><strong>Stands Selecionados:</strong> {selectedStands.length}</p>
          <div style={{ fontSize: '14px', marginTop: '5px' }}>
            {selectedStands.map(stand => {
              const standCode = typeof stand === 'object' && stand !== null ? 
                (stand.codigo || stand.id || String(stand)) : String(stand);
              return `Stand ${standCode}`;
            }).join(', ')}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FormEventoStandSelector;