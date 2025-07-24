import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import StandSelectionService from '../services/StandSelectionServiceCleanFinal';

// Lista completa de stands disponíveis
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

const StandSelectorManager = ({ 
  onClose, 
  eventId = null,
  eventName,
  initialSelectedStands = [],
  onStandsUpdate 
}) => {
  const [standsDisponiveis, setStandsDisponiveis] = useState([]);
  const [standsVinculados, setStandsVinculados] = useState([]);
  const [selectedStands, setSelectedStands] = useState(new Set(initialSelectedStands));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStandsData();
  }, [eventId]);

  const loadStandsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Se tem eventId, buscar stands já vinculados
      if (eventId) {
        const vinculados = await StandSelectionService.getStandsVinculadosAoEvento(eventId);
        setStandsVinculados(vinculados || []);
        
        // Pré-selecionar stands já vinculados
        const standCodes = vinculados.map(stand => stand.codigo);
        setSelectedStands(new Set(standCodes));
      }
      
      // Buscar stands disponíveis para vincular
      const disponiveis = await StandSelectionService.getStandsSemVinculo();
      setStandsDisponiveis(disponiveis || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados dos stands:', error);
      setError('Erro ao carregar stands disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const handleStandClick = (standCode) => {
    setSelectedStands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(standCode)) {
        newSet.delete(standCode);
      } else {
        newSet.add(standCode);
      }
      return newSet;
    });
  };

  const handleConfirm = async () => {
    if (!eventId) {
      // Modo criação de evento - apenas notificar componente pai
      if (onStandsUpdate) {
        onStandsUpdate(Array.from(selectedStands));
      }
      if (onClose) {
        onClose(true);
      }
      return;
    }

    // Modo edição - salvar no backend
    try {
      setSaving(true);
      setError('');
      
      const standIds = Array.from(selectedStands).map(codigo => {
        const stand = standsDisponiveis.find(s => s.codigo === codigo);
        return stand ? stand.id : null;
      }).filter(id => id !== null);

      await StandSelectionService.vincularStandsAoEvento(eventId, standIds);
      
      if (onStandsUpdate) {
        onStandsUpdate(Array.from(selectedStands));
      }
      
      if (onClose) {
        onClose(true);
      }
      
    } catch (error) {
      console.error('Erro ao vincular stands:', error);
      setError('Erro ao salvar stands. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const getStandStatus = (standCode) => {
    const isSelected = selectedStands.has(standCode);
    const standDisponivel = standsDisponiveis.find(s => s.codigo === standCode);
    const standVinculado = standsVinculados.find(s => s.codigo === standCode);
    
    if (isSelected) return { color: '#3b82f6', status: 'selecionado' };
    if (standVinculado) return { color: '#22c55e', status: 'vinculado' };
    if (standDisponivel) return { color: '#94a3b8', status: 'disponivel' };
    return { color: '#ef4444', status: 'ocupado' };
  };

  const renderStandGrid = () => {
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

    return Object.entries(standsByRow).map(([fileira, codes]) => (
      <div key={fileira} style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#3b82f6'
          }}>
            {fileira}
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {codes.map(codigo => {
              const { color, status } = getStandStatus(codigo);
              const isDisabled = status === 'ocupado';
              
              return (
                <motion.div
                  key={codigo}
                  whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: color,
                    border: selectedStands.has(codigo) ? '3px solid #fff' : '2px solid transparent',
                    borderRadius: '12px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: '14px',
                    opacity: isDisabled ? 0.6 : 1,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={() => !isDisabled && handleStandClick(codigo)}
                  title={`Stand ${codigo} - ${status}`}
                >
                  {codigo}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#0a192f', 
        color: '#fff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando stands...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#0a192f', 
      color: '#fff', 
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '30px',
        borderBottom: '1px solid #334155',
        paddingBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#3b82f6', 
          marginBottom: '10px',
          fontSize: '2em',
          fontWeight: '700'
        }}>
          Gerenciar Stands {eventName && `- ${eventName}`}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1em' }}>
          Selecione os stands que estarão disponíveis para este evento
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Legenda */}
      <div style={{
        background: '#1e293b',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #334155'
      }}>
        <h5 style={{ color: '#e2e8f0', marginBottom: '15px' }}>Legenda:</h5>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#94a3b8', 
              borderRadius: '50%' 
            }}></div>
            <span>Disponível para vincular</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#3b82f6', 
              borderRadius: '50%' 
            }}></div>
            <span>Selecionado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#22c55e', 
              borderRadius: '50%' 
            }}></div>
            <span>Já vinculado ao evento</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#ef4444', 
              borderRadius: '50%' 
            }}></div>
            <span>Ocupado por outro evento</span>
          </div>
        </div>
      </div>

      {/* Grid de Stands */}
      <div style={{
        background: '#1e293b',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #334155'
      }}>
        <h5 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Stands Disponíveis:</h5>
        {renderStandGrid()}
      </div>

      {/* Stands Selecionados */}
      {selectedStands.size > 0 && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <h6 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '1.2em' }}>
            Stands Selecionados ({selectedStands.size}):
          </h6>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Array.from(selectedStands).map(codigo => (
              <Badge
                key={codigo}
                bg="primary"
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => handleStandClick(codigo)}
              >
                {codigo}
                <X size={14} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        <Button
          variant="outline-light"
          onClick={handleCancel}
          size="lg"
          disabled={saving}
          style={{
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={18} className="me-2" />
          Cancelar
        </Button>
        
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={saving}
          size="lg"
          style={{
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: '600',
            backgroundColor: '#22c55e',
            borderColor: '#22c55e'
          }}
        >
          {saving ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Salvando...</span>
              </div>
              Salvando...
            </>
          ) : (
            <>
              <Check size={18} className="me-2" />
              {eventId ? 'Salvar Vinculação' : 'Confirmar Seleção'} ({selectedStands.size})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StandSelectorManager;