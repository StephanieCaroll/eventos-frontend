import { motion } from 'framer-motion';
import { ArrowLeft, Check, Filter, Grid, Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useStandSelection from '../hooks/useStandSelection';
import StandSelectionService from '../services/StandSelectionService';
import '../styles/StandGrid.css';

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

const StandVisualSelection = ({ onClose, eventId, eventName, managementMode = false, preSelectedStands = [], onStandsUpdate, hideEventSelector = false }) => {
  // Hook personalizado para gerenciar seleção de stands
  const {
    standsData,
    selectedStands,
    isLoading,
    error: standError,
    toggleStandSelection,
    clearSelection,
    selectAllAvailable,
    processReservation,
    setError: setStandError,
    fetchStands
  } = useStandSelection();

  // Estados locais para filtros e UI
  const [currentEvent, setCurrentEvent] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventos, setEventos] = useState([]);
  const [observacoes, setObservacoes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [preSelectedStandsSet, setPreSelectedStandsSet] = useState(new Set());
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const error = standError || localError;

  // Fetch dados iniciais
  useEffect(() => {
    fetchEventos();
    // Se estivermos em modo gerenciamento e tivermos um eventId, definir como evento atual
    if (managementMode && eventId) {
      setCurrentEvent(eventId.toString());
    }
    
    // Processar stands pré-selecionados (do formulário de texto)
    if (preSelectedStands && preSelectedStands.length > 0) {
      const standsSet = new Set(preSelectedStands);
      setPreSelectedStandsSet(standsSet);
    }
  }, [managementMode, eventId, preSelectedStands]);

  // Efeito para carregar stands quando evento muda
  useEffect(() => {
    if (currentEvent) {
      const loadStands = async () => {
        try {
          setLocalIsLoading(true);
          await fetchStands(currentEvent, null);
        } catch (error) {
          console.error('Erro ao carregar stands:', error);
          setLocalError('Erro ao carregar stands');
        } finally {
          setLocalIsLoading(false);
        }
      };
      loadStands();
    }
  }, [currentEvent]);

  const fetchEventos = async () => {
    try {
      const eventos = await StandSelectionService.getEventos();
      setEventos(eventos);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setLocalError('Erro ao carregar eventos. Tente novamente.');
    }
  };

  // Função para filtrar stands com verificação de segurança
  const filterStands = () => {
    if (!Array.isArray(standsData)) return [];
    
    return standsData.filter(stand => {
      // Verificação de segurança para propriedades indefinidas
      const codigo = stand?.codigo || '';
      const eventoNome = stand?.eventoNome || '';
      const eventoId = stand?.eventoId;
      const disponivel = stand?.disponivel;

      // Filtro por evento
      if (currentEvent && eventoId && eventoId.toString() !== currentEvent) {
        return false;
      }

      // Filtro por disponibilidade
      if (filterAvailability === 'disponivel' && !disponivel) {
        return false;
      }
      if (filterAvailability === 'ocupado' && disponivel) {
        return false;
      }

      // Filtro por busca
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        return codigo.toLowerCase().includes(searchLower) || 
               eventoNome.toLowerCase().includes(searchLower);
      }

      return true;
    });
  };

  // Gerar grid visual de stands baseado na lista do FormEvento
  const generateStandGrid = () => {
    const filteredStands = filterStands();
    
    // Organizar stands por fileiras baseado na lista STANDS_DISPONIVEIS
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
            const stand = filteredStands.find(s => s?.codigo === codigo);
            const isSelected = selectedStands.has(stand?.id);
            const isAvailable = stand?.disponivel ?? false;
            const isPreSelected = preSelectedStandsSet.has(codigo);
            
            // Determinar o status do stand
            let standStatus;
            let standColor;
            let standBorderColor;
            let standBackgroundColor;
            
            if (isSelected) {
              standStatus = 'selecionado';
              standColor = '#3b82f6';
              standBorderColor = '#3b82f6';
              standBackgroundColor = '#3b82f620';
            } else if (isPreSelected) {
              standStatus = 'pré-selecionado (formulário)';
              standColor = '#f59e0b';
              standBorderColor = '#f59e0b';
              standBackgroundColor = '#f59e0b15';
            } else if (isAvailable) {
              standStatus = 'disponível';
              standColor = '#22c55e';
              standBorderColor = '#22c55e';
              standBackgroundColor = '#22c55e15';
            } else {
              standStatus = 'ocupado';
              standColor = '#ef4444';
              standBorderColor = '#ef4444';
              standBackgroundColor = '#ef444415';
            }
            
            return (
              <OverlayTrigger
                key={codigo}
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-${codigo}`}>
                    <div style={{ textAlign: 'left' }}>
                      <strong>Stand {codigo}</strong><br/>
                      Status: {standStatus}<br/>
                      {stand?.eventoNome && `Evento: ${stand.eventoNome}`}<br/>
                      {stand?.usuarioNome && `Expositor: ${stand.usuarioNome}`}
                      {isPreSelected && <><br/>📝 Stand já selecionado no formulário</>}
                    </div>
                  </Tooltip>
                }
              >
                <motion.div
                  className="stand-cell"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: standBorderColor,
                    backgroundColor: standBackgroundColor,
                    cursor: (stand && (isAvailable || isPreSelected)) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: standColor,
                    transition: 'all 0.3s ease',
                    opacity: stand ? 1 : 0.4,
                    boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
                  }}
                  onClick={() => (stand && (isAvailable || isPreSelected)) && toggleStandSelection(stand.id)}
                >
                  {codigo}
                  {isPreSelected && <span style={{ fontSize: '8px', marginLeft: '2px' }}>📝</span>}
                </motion.div>
              </OverlayTrigger>
            );
          })}
        </div>
      </div>
    ));
  };

  // Seleção em lote
  const handleSelectAllAvailable = () => {
    selectAllAvailable();
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  // Processar reserva/liberação usando o hook
  const handleProcessReservation = async (operacao) => {
    if (selectedStands.size === 0) {
      setLocalError('Selecione ao menos um stand');
      return;
    }

    try {
      const message = await processReservation(
        operacao,
        currentEvent ? parseInt(currentEvent) : null,
        observacoes
      );
      
      setSuccessMessage(message);
      setObservacoes('');
      
      // Após salvar com sucesso, fechar o modal e voltar
      setTimeout(() => {
        setSuccessMessage('');
        if (onClose) {
          onClose(true); // Passa true indicando que houve mudanças
        }
      }, 1500);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  // Função para fechar sem salvar
  const handleClose = () => {
    if (onClose) {
      onClose(false); // Passa false indicando que não houve mudanças
    }
  };

  // Função para fechar e retornar stands selecionados
  const handleCloseWithStands = () => {
    if (onStandsUpdate && !managementMode) {
      // Combinar stands pré-selecionados e selecionados visualmente
      const selectedStandsCodes = filteredStands
        .filter(stand => selectedStands.has(stand?.id))
        .map(stand => stand.codigo);
      
      const allSelectedStands = [...new Set([...preSelectedStands, ...selectedStandsCodes])];
      onStandsUpdate(allSelectedStands);
    }
    
    if (onClose) {
      onClose(true); // Indica que houve mudanças
    }
  };

  // Função para fechar sem salvar
  const handleCloseWithoutSaving = () => {
    if (onClose) {
      onClose(false); // Indica que não houve mudanças
    }
  };

  const filteredStands = filterStands();
  const selectedStandsInfo = filteredStands.filter(stand => selectedStands.has(stand?.id));

  return (
    <div style={{ 
      backgroundColor: managementMode && !hideEventSelector ? '#0a192f' : 'transparent', 
      color: '#ffffff', 
      minHeight: managementMode && !hideEventSelector ? '100vh' : 'auto',
      width: '100%',
      position: managementMode && !hideEventSelector ? 'fixed' : 'relative',
      top: managementMode && !hideEventSelector ? 0 : 'auto',
      left: managementMode && !hideEventSelector ? 0 : 'auto',
      right: managementMode && !hideEventSelector ? 0 : 'auto',
      bottom: managementMode && !hideEventSelector ? 0 : 'auto',
      zIndex: managementMode && !hideEventSelector ? 9999 : 'auto',
      overflow: managementMode && !hideEventSelector ? 'auto' : 'visible',
      padding: managementMode && !hideEventSelector ? '30px' : '0'
    }}>
      {/* Header com título */}
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
          {managementMode ? `Gerenciar Stands - ${eventName || 'Evento'}` : 'Gerenciamento Visual de Stands'}
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.1em' }}>
          {managementMode 
            ? `Selecione e gerencie stands para ${eventName || 'este evento'}`
            : 'Selecione e gerencie stands para seus eventos'
          }
        </p>
      </motion.div>

      {/* Header com filtros */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 rounded-4"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          border: '1px solid #334155'
        }}
      >
        <div className="row g-3">
          {!managementMode && (
            <div className="col-md-3">
              <Form.Label style={{ color: '#e2e8f0', fontWeight: '600' }}>Evento</Form.Label>
              <Form.Select
                value={currentEvent}
                onChange={(e) => setCurrentEvent(e.target.value)}
                style={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#e2e8f0'
                }}
              >
                <option value="">Todos os Eventos</option>
                {eventos.map(evento => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nomeEvento || evento.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          )}
          
          <div className={managementMode ? "col-md-4" : "col-md-3"}>
            <Form.Label style={{ color: '#e2e8f0', fontWeight: '600' }}>Disponibilidade</Form.Label>
            <Form.Select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              style={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                color: '#e2e8f0'
              }}
            >
              <option value="todos">Todos</option>
              <option value="disponivel">Disponíveis</option>
              <option value="ocupado">Ocupados</option>
            </Form.Select>
          </div>
          
          <div className={managementMode ? "col-md-5" : "col-md-4"}>
            <Form.Label style={{ color: '#e2e8f0', fontWeight: '600' }}>Busca</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Buscar por código do stand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#e2e8f0',
                  paddingLeft: '40px'
                }}
              />
              <Search 
                size={16} 
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#6b7280' }}
              />
            </div>
          </div>
          
          <div className={managementMode ? "col-md-3" : "col-md-2"} style={{ display: 'flex', alignItems: 'end' }}>
            <Button 
              variant="outline-light" 
              onClick={() => {
                setLocalError('');
                setStandError('');
              }}
              disabled={isLoading}
              style={{ borderColor: '#334155' }}
            >
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mensagens */}
      {error && (
        <Alert variant="danger" onClose={() => {
          setLocalError('');
          setStandError('');
        }} dismissible>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

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
              <h5 className="mb-0 d-flex align-items-center">
                <Grid size={20} className="me-2" style={{ color: '#3b82f6' }} />
                Grid de Stands
              </h5>
              <div className="mt-3">
                <Badge bg="success" className="me-2">Disponível</Badge>
                <Badge bg="danger" className="me-2">
                  {managementMode ? 'Reservado (clique para liberar)' : 'Ocupado'}
                </Badge>
                <Badge bg="primary">Selecionado</Badge>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3" style={{ color: '#cbd5e1' }}>Carregando stands...</p>
                </div>
              ) : (
                <div className="stand-grid">
                  {generateStandGrid()}
                </div>
              )}
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
              <h5 className="mb-0 d-flex align-items-center">
                <Users size={20} className="me-2" style={{ color: '#3b82f6' }} />
                Stands Selecionados ({selectedStands.size})
              </h5>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2 mb-2"
                  onClick={handleSelectAllAvailable}
                  style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
                >
                  Selecionar Todos Disponíveis
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="mb-2"
                  onClick={handleClearSelection}
                  style={{ borderColor: '#6b7280', color: '#6b7280' }}
                >
                  Limpar Seleção
                </Button>
              </div>

              {selectedStandsInfo.length > 0 && (
                <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedStandsInfo.map(stand => (
                    <motion.div 
                      key={stand.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="d-flex justify-content-between align-items-center mb-2 p-3 rounded-3"
                      style={{
                        backgroundColor: '#334155',
                        border: '1px solid #475569'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#3b82f6' }}>{stand.codigo}</strong>
                        {stand.eventoNome && (
                          <div style={{ fontSize: '0.9em', color: '#cbd5e1' }}>
                            {stand.eventoNome}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => toggleStandSelection(stand.id)}
                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                      >
                        <X size={14} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e2e8f0', fontWeight: '600' }}>
                  Observações (opcional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Adicione observações sobre a reserva..."
                  style={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#e2e8f0'
                  }}
                />
              </Form.Group>

              <div className="d-grid gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#16a34a' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn d-flex align-items-center justify-content-center"
                  onClick={() => handleProcessReservation('RESERVAR')}
                  disabled={selectedStands.size === 0 || isLoading}
                  style={{
                    backgroundColor: '#22c55e',
                    border: 'none',
                    color: '#fff',
                    padding: '12px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <Check size={16} className="me-2" />
                  {managementMode ? 'Salvar Alterações' : `Reservar Selecionados (${selectedStands.size})`}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn d-flex align-items-center justify-content-center"
                  onClick={() => handleProcessReservation('LIBERAR')}
                  disabled={selectedStands.size === 0 || isLoading}
                  style={{
                    backgroundColor: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    padding: '12px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <X size={16} className="me-2" />
                  Liberar Selecionados ({selectedStands.size})
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Botão para voltar */}
      <div className="mt-4 text-center">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
          whileTap={{ scale: 0.97 }}
          className="btn d-flex align-items-center mx-auto"
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: 30,
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
          onClick={handleClose}
        >
          <ArrowLeft size={18} className="me-2" />
          Voltar
        </motion.button>
      </div>
    </div>
  );
};

export default StandVisualSelection;