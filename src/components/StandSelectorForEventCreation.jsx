import { motion } from 'framer-motion';
import { useState } from 'react';

// Lista completa de stands disponíveis (mesma do FormEvento)
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

const StandSelectorForEventCreation = ({ onStandsSelected, initialSelection = [], onClose }) => {
  const [selectedStands, setSelectedStands] = useState(new Set(initialSelection));

  // Função para alternar seleção de stand
  const toggleStandSelection = (standCode) => {
    const newSelected = new Set(selectedStands);
    if (newSelected.has(standCode)) {
      newSelected.delete(standCode);
    } else {
      newSelected.add(standCode);
    }
    setSelectedStands(newSelected);
  };

  // Gerar grid visual de stands
  const generateStandGrid = () => {
    // Organizar stands por fileiras
    const standsByRow = {
      'A': STANDS_DISPONIVEIS.filter(s => s.startsWith('A')),
      'B': STANDS_DISPONIVEIS.filter(s => s.startsWith('B')),
      'C': STANDS_DISPONIVEIS.filter(s => s.startsWith('C')),
      'D': STANDS_DISPONIVEIS.filter(s => s.startsWith('D')),
      'E': STANDS_DISPONIVEIS.filter(s => s.startsWith('E')),
      'F': STANDS_DISPONIVEIS.filter(s => s.startsWith('F')),
      'G': STANDS_DISPONIVEIS.filter(s => s.startsWith('G')),
      'H': STANDS_DISPONIVEIS.filter(s => s.startsWith('H')),
      'I': STANDS_DISPONIVEIS.filter(s => s.startsWith('I'))
    };
    
    return Object.entries(standsByRow).map(([fileira, standsCodes]) => (
      <div key={fileira} className="d-flex mb-3 align-items-center">
        <div className="me-3 d-flex align-items-center justify-content-center" style={{ 
          width: '40px', 
          height: '40px',
          fontWeight: 'bold', 
          color: '#3b82f6',
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #334155'
        }}>
          {fileira}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {standsCodes.map(codigo => {
            const isSelected = selectedStands.has(codigo);
            
            return (
              <motion.div
                key={codigo}
                className="stand-cell"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: isSelected ? '#3b82f6' : '#22c55e',
                  backgroundColor: isSelected ? '#3b82f620' : '#22c55e15',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: isSelected ? '#3b82f6' : '#22c55e',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
                }}
                onClick={() => toggleStandSelection(codigo)}
              >
                {codigo}
              </motion.div>
            );
          })}
        </div>
      </div>
    ));
  };

  const handleConfirm = () => {
    if (onStandsSelected) {
      onStandsSelected(Array.from(selectedStands));
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#0a192f', 
      color: '#ffffff', 
      minHeight: '80vh',
      padding: '30px'
    }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 style={{
          fontSize: '2.5em',
          fontWeight: '700',
          color: '#3b82f6',
          textShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
          marginBottom: '0.5em'
        }}>
          Selecionar Stands para o Evento
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.1em' }}>
          Escolha quais stands estarão disponíveis para este evento
        </p>
      </motion.div>

      {/* Legenda */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 p-3 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #334155'
        }}
      >
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <div className="d-flex align-items-center">
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#22c55e15',
              border: '2px solid #22c55e',
              borderRadius: '4px',
              marginRight: '8px'
            }}></div>
            <span style={{ color: '#22c55e' }}>Disponível para seleção</span>
          </div>
          <div className="d-flex align-items-center">
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#3b82f620',
              border: '2px solid #3b82f6',
              borderRadius: '4px',
              marginRight: '8px'
            }}></div>
            <span style={{ color: '#3b82f6' }}>Selecionado</span>
          </div>
        </div>
      </motion.div>

      <div className="row">
        {/* Grid principal */}
        <div className="col-lg-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-4"
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              border: '1px solid #334155'
            }}
          >
            <div className="p-4" style={{ borderBottom: '1px solid #334155' }}>
              <h5 className="mb-0">Grid de Stands - Cadastro de Evento</h5>
            </div>
            <div className="p-4">
              <div className="stand-grid">
                {generateStandGrid()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar com stands selecionados */}
        <div className="col-lg-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-100 rounded-4"
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              border: '1px solid #334155'
            }}
          >
            <div className="p-4" style={{ borderBottom: '1px solid #334155' }}>
              <h5 className="mb-0">
                Stands Selecionados ({selectedStands.size})
              </h5>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <button 
                  className="btn btn-outline-primary btn-sm me-2 mb-2"
                  onClick={() => setSelectedStands(new Set(STANDS_DISPONIVEIS))}
                >
                  Selecionar Todos
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm mb-2"
                  onClick={() => setSelectedStands(new Set())}
                >
                  Limpar Seleção
                </button>
              </div>

              {selectedStands.size > 0 && (
                <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div className="d-flex flex-wrap gap-2">
                    {Array.from(selectedStands).map(stand => (
                      <span 
                        key={stand}
                        className="badge"
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleStandSelection(stand)}
                      >
                        {stand} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-grid gap-3">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleConfirm}
                  style={{
                    backgroundColor: '#22c55e',
                    border: 'none',
                    padding: '12px',
                    fontWeight: '600',
                    borderRadius: '12px'
                  }}
                >
                  Confirmar Seleção ({selectedStands.size} stands)
                </button>
                
                <button
                  className="btn btn-outline-light"
                  onClick={onClose}
                  style={{
                    borderColor: '#6b7280',
                    color: '#6b7280'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StandSelectorForEventCreation;