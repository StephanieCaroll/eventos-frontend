import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const StandRegistrationModal = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); 
        
        if (!token) throw new Error('Token de autenticação não encontrado');
        if (!eventId || isNaN(eventId)) throw new Error('ID do evento inválido');

        const decodedToken = jwtDecode(token);
      
        const userId = decodedToken.id; 

        if (!userId) {
            throw new Error('ID do usuário não encontrado no token JWT. Por favor, verifique o payload do seu token em jwt.io e ajuste a propriedade.');
        }

        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { 
            eventId: parseInt(eventId),
            userId: userId 
          }
        };

        const [availableResponse, myStandsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/stand/disponiveis', config),
          axios.get('http://localhost:8080/api/stand/usuario', config)
        ]);

        setStands(availableResponse.data.map(stand => ({
          ...stand,
          isRegisteredByMe: myStandsResponse.data.some(s => s.id === stand.id)
        })));

      } catch (err) {
        console.error('Erro detalhado:', err);
        const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Erro ao carregar stands. Verifique o console para mais detalhes.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStands();
  }, [eventId]);

  const handleStandSelection = (stand) => {
    if (!stand.isRegisteredByMe) {
      setSelectedStand(stand);
      setDescription(stand.descricao || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStand) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Autenticação necessária');
      }

      const decodedToken = jwtDecode(token);
     
      const userId = decodedToken.id; 

      if (!userId) {
          throw new Error('ID do usuário não encontrado no token JWT para registrar o stand.');
      }

      await axios.post('http://localhost:8080/api/stand/registrar', {
        eventId: parseInt(eventId),
        standId: selectedStand.id,
        descricao: description,
        userId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowSuccess(true);
      setTimeout(() => navigate('/homeExpositor'), 1500);
    } catch (err) {
      console.error('Erro ao cadastrar stand:', err);
      let errorMessage = 'Erro ao cadastrar stand';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                       err.response.data?.error || 
                       `Erro ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Sem resposta do servidor - verifique sua conexão';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availableStands = stands.filter(stand => !stand.isRegisteredByMe);

  return (
    <div className="bg-dark text-white min-vh-100 p-4">
      <div className="container">
        <h2 className="mb-4 text-center text-primary">Cadastro de Stand</h2>

        {showSuccess && (
          <Alert variant="success" className="text-center">
            Stand cadastrado com sucesso!
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={6} md={12}>
            <Card className="bg-secondary text-white shadow">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Mapa do Evento</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div style={{ position: 'relative' }}>
                  <img 
                    src="/MapaDoEvento.jpg"
                    alt="Mapa do Evento" 
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 'auto' }}
                    onLoad={() => setImageLoaded(true)}
                  />
                  
                  {imageLoaded && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                      {stands.map((stand) => (
                        <div
                          key={stand.id}
                          style={{
                            position: 'absolute',
                            left: `${stand.posicaoX || 0}%`,
                            top: `${stand.posicaoY || 0}%`,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: stand.isRegisteredByMe
                              ? '#dc3545'
                              : selectedStand?.id === stand.id
                                ? '#0d6efd'
                                : '#198754',
                            border: '2px solid white',
                            cursor: stand.isRegisteredByMe ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleStandSelection(stand)}
                          title={`Stand ${stand.codigo}${stand.isRegisteredByMe ? ' (Indisponível)' : ''}`}
                        >
                          {stand.codigo}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={12}>
            <Card className="bg-secondary text-white shadow">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Informações do Stand</h4>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Carregando...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stand Selecionado:</Form.Label>
                      <Form.Control
                        value={selectedStand ? `Stand ${selectedStand.codigo}` : 'Nenhum stand selecionado'}
                        readOnly
                        className="bg-dark text-white"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Descrição do Stand:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o que será apresentado neste stand..."
                        required
                        disabled={!selectedStand}
                        className="bg-dark text-white"
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!selectedStand || loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Cadastrando...
                          </>
                        ) : 'Confirmar Cadastro'}
                      </Button>

                      <Button
                        variant="outline-light"
                        onClick={() => navigate('/homeExpositor')}
                        disabled={loading}
                      >
                        Voltar
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h3 className="mt-5 mb-3 text-primary">Stands Disponíveis</h3>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : availableStands.length === 0 ? (
          <Alert variant="info" className="text-center">
            Não há stands disponíveis para cadastro
          </Alert>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            {availableStands.map(stand => (
              <div key={stand.id} className="col">
                <Card
                  className={`h-100 ${selectedStand?.id === stand.id ? 'border-primary' : 'border-secondary'}`}
                  onClick={() => handleStandSelection(stand)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="text-center">
                    <Card.Title className="text-primary fs-4">{stand.codigo}</Card.Title>
                    <Card.Text className="text-white-50">
                      {stand.descricao || 'Sem descrição'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandRegistrationModal;