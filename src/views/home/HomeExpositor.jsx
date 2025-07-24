import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  Clapperboard,
  Edit,
  Globe,
  GraduationCap,
  Heart,
  LayoutList,
  Lightbulb,
  List,
  Mic,
  Monitor,
  Music,
  Paintbrush,
  Search,
  Star,
  Trash2,
  Trophy,
  Utensils
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useEvents } from "../../contexts/EventContext";


function cardStyle(color1, color2) {
  return {
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    borderRadius: 24,
    padding: 30,
    color: "#fff",
    boxShadow: `0 0 30px ${color1}88`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1,
    position: "relative",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
  };
}

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0a192f",
        color: "#fff",
        padding: "2em 0",
        textAlign: "center",
        borderTop: "1px solid #1e293b",
      }}
    >
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Events Stands. Todos os direitos
          reservados.
        </p>
        <p>
          Desenvolvido com{" "}
          <span role="img" aria-label="coração">
            ❤️
          </span>
        </p>
      </div>
    </footer>
  );
}

// Serviço para chamadas API de stands
const StandService = {
  getAvailableStands: async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/stand/disponiveis-evento/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar stands disponíveis:', error);
      throw error;
    }
  },
  
  selectStands: async (eventId, standIds, userId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Validação dos parâmetros
      if (!Array.isArray(standIds) || standIds.length === 0) {
        throw new Error('Lista de stands não pode estar vazia');
      }
      if (!eventId || isNaN(parseInt(eventId))) {
        throw new Error('ID do evento é obrigatório');
      }
      if (!userId) {
        throw new Error('ID do usuário é obrigatório');
      }

      const requestData = {
        standIds: standIds.map(id => parseInt(id)),
        eventoId: parseInt(eventId),
        usuarioId: userId.toString(),
        operacao: 'RESERVAR',
        observacoes: 'Seleção via interface do expositor'
      };

      console.log('Enviando dados para batch operation (HomeExpositor):', requestData);

      const response = await axios.post('http://localhost:8080/api/stand-selection/batch', requestData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao selecionar stands:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },
  
  getRegisteredStands: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado');

      const response = await axios.get(`http://localhost:8080/api/stand/registered`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId }
      });

      return response.data;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar stands registrados');
    }
  },

  deleteStand: async (standId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/stand/processar-reserva', {
        standId,
        operacao: 'LIBERAR'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao remover stand:', error);
      throw error;
    }
  },

  updateStand: async (standId, description) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/stand/${standId}`, {
        descricao: description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao atualizar stand:', error);
      throw error;
    }
  },

  getStandInfo: async (standId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/stand/${standId}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações do stand:', error);
      throw error;
    }
  }
};


export default function HomeExpositor() {
  const navigate = useNavigate();
  const { isAuthenticated, userRoles, userName, userId, logout } = useContext(AuthContext);
  const { events, favoritedEvents = [], toggleFavorite } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos os Eventos");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStandSelectionModal, setShowStandSelectionModal] = useState(false);
  const [availableStands, setAvailableStands] = useState([]);
  const [selectedStands, setSelectedStands] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [loadingStands, setLoadingStands] = useState(false);
  const [selectionError, setSelectionError] = useState(null);
  const [showStandRegistrationModal, setShowStandRegistrationModal] = useState(false);
  const [standDescription, setStandDescription] = useState('');
  const [selectedStandToRegister, setSelectedStandToRegister] = useState(null);
  const [registeredStands, setRegisteredStands] = useState([]);

  useEffect(() => {
    console.log("[HomeExpositor] Componente carregado.");
    console.log("[HomeExpositor] isAuthenticated:", isAuthenticated);
    console.log("[HomeExpositor] userRoles:", userRoles);
    console.log("[HomeExpositor] userName:", userName);
  console.log("[HomeExpositor] userId:", userId); 
  }, [isAuthenticated, userRoles, userName, userId]); 


  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const firstName = userName ? userName.split(" ")[0] : "Usuário";

  const categories = [
    { name: "Todos os Eventos", icon: <CalendarCheck size={20} /> },
    { name: "Eventos Ativos", icon: <Star size={20} /> },
    { name: "Eventos Passados", icon: <Clapperboard size={20} /> },
    { name: "Tecnologia", icon: <Monitor size={20} /> },
    { name: "Arte", icon: <Paintbrush size={20} /> },
    { name: "Entretenimento", icon: <Clapperboard size={20} /> },
    { name: "Conferencia", icon: <Mic size={20} /> },
    { name: "Workshop", icon: <Lightbulb size={20} /> },
    { name: "Show", icon: <Music size={20} /> },
    { name: "Feira", icon: <LayoutList size={20} /> },
    { name: "Esportivo", icon: <Trophy size={20} /> },
    { name: "Educacional", icon: <GraduationCap size={20} /> },
    { name: "Gastronomico", icon: <Utensils size={20} /> },
    { name: "Cultural", icon: <Globe size={20} /> },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "Todos os Eventos" ||
      (selectedCategory === "Eventos Ativos" && event.status === "Ativo") ||
      (selectedCategory === "Eventos Passados" &&
        event.status === "Encerrado") ||
      selectedCategory === event.category;

    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCardClick = async (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    
     console.log("UserID ao tentar buscar stands registrados:", userId);

    try {

      if (userId) { 
        const stands = await StandService.getRegisteredStands(userId);
        const filteredStands = stands.filter(stand => stand.eventId === event.id);
        setRegisteredStands(filteredStands);
      } else {
        console.warn('Não foi possível carregar stands registrados: Usuário não logado ou ID de usuário inválido.');
        setRegisteredStands([]); 

      }
    } catch (error) {
      console.error('Erro ao carregar stands registrados:', error); 
    
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setRegisteredStands([]);
  };

  const handleRegisterStandClick = async (eventId) => {
    try {
      setCurrentEventId(eventId);
      setLoadingStands(true);
      setSelectionError(null);
      
      const stands = await StandService.getAvailableStands(eventId);
      
      // Marca os stands que já estão ocupados/registrados
      const standsWithStatus = stands.map(stand => ({
        ...stand,
        ocupado: stand.ocupado || false,
        isRegisteredByMe: registeredStands.some(reg => reg.standId === stand.id && reg.eventId === eventId)
      }));
      
      setAvailableStands(standsWithStatus);
      setSelectedStands([]);
      setShowStandSelectionModal(true);
    } catch (error) {
      console.error('Erro ao buscar stands:', error);
      setSelectionError('Erro ao carregar stands disponíveis. Tente novamente mais tarde.');
    } finally {
      setLoadingStands(false);
    }
  };

  const handleStandSelection = (standId, isSelected) => {
    // Verifica se o stand está disponível para seleção
    const stand = availableStands.find(s => s.id === standId);
    if (!stand || stand.ocupado || stand.isRegisteredByMe) {
      return; // Não permite selecionar stands já ocupados
    }
    
    if (isSelected) {
      setSelectedStands([...selectedStands, standId]);
    } else {
      setSelectedStands(selectedStands.filter(id => id !== standId));
    }
  };

  const confirmStandSelection = async () => {
    try {
      setLoadingStands(true);
      setSelectionError(null);
      
      // Certifique-se que userId está disponível aqui também, se necessário para esta operação
      if (!userId) {
          alert('Você precisa estar logado para selecionar stands.');
          setSelectionError('Usuário não autenticado.');
          return;
      }

      await StandService.selectStands(currentEventId, selectedStands, userId);
      
      // Atualiza o estado dos stands marcando como ocupados
      setAvailableStands(prevStands => 
        prevStands.map(stand => 
          selectedStands.includes(stand.id)
            ? { ...stand, ocupado: true, isRegisteredByMe: true }
            : stand
        )
      );
      
      // Fechar modais e resetar estados
      setShowStandSelectionModal(false);
      setShowModal(false);
      setSelectedStands([]);
      
      // Mostrar feedback para o usuário
      alert('Stands selecionados com sucesso!');
    } catch (error) {
      console.error('Erro ao selecionar stands:', error);
      setSelectionError('Erro ao selecionar stands. Tente novamente.');
    } finally {
      setLoadingStands(false);
    }
  };

  const handleFavoriteClick = async (e, event) => {
    e.stopPropagation();
    await toggleFavorite(event);
  };

  const isEventFavorited = (eventId) => {
    return favoritedEvents.some((fav) => fav.id === eventId);
  };

  const handleDeleteStand = async (standId) => {
    try {
      await StandService.deleteStand(standId);
      setRegisteredStands(registeredStands.filter(stand => stand.id !== standId));
      alert('Stand removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover stand:', error);
      alert('Erro ao remover stand. Tente novamente.');
    }
  };

  const handleEditStand = (stand) => {
    setSelectedStandToRegister(stand.id);
    setStandDescription(stand.descricao);
    setShowStandRegistrationModal(true);
  };

  const handleRegisterStand = async () => {
    try {
      if (selectedStandToRegister && registeredStands.some(s => s.id === selectedStandToRegister)) {
        // Atualizar stand existente
        await StandService.updateStand(selectedStandToRegister, standDescription);
        
        setRegisteredStands(registeredStands.map(stand => 
          stand.id === selectedStandToRegister 
            ? {...stand, descricao: standDescription} 
            : stand
        ));
      } else {
        // Cadastrar novo stand
        const response = await axios.post('http://localhost:8080/api/stands/register', {
          eventId: currentEventId, 
          standId: selectedStandToRegister, 
          description: standDescription,
          userId: userId 
        });

        setRegisteredStands([...registeredStands, response.data]);
      }

      // Fecha o modal e limpa os campos
      setShowStandRegistrationModal(false);
      setStandDescription('');
      setSelectedStandToRegister(null);
      
      alert('Operação realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar/atualizar stand:', error);
      alert('Erro ao realizar operação. Tente novamente.');
    }
  };

  const availableStandsForRegistration = availableStands.filter(stand => 
    !registeredStands.some(reg => reg.id === stand.id && reg.eventId === currentEventId)
  );

  return (
    <div
      style={{
        backgroundColor: "#0a192f",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cabeçalho */}
      <section
        style={{
          padding: "1.5em 2em",
          background: "linear-gradient(135deg, #000000 0%, #0a192f 100%)",
          color: "#fff",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <h1
            style={{
              fontSize: "2.5em",
              fontWeight: "800",
              letterSpacing: "1px",
              color: "#3b82f6",
              margin: 0,
            }}
          >
            Events Stands - Expositor
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5em",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          {isAuthenticated && userName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8em",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px solid #3b82f6",
                }}
              >
                <img
                  src={`https://placehold.co/40x40/3b82f6/ffffff?text=${firstName
                    .charAt(0)
                    .toUpperCase()}`}
                  alt="Avatar do Usuário"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) =>
                    (e.target.src = `https://placehold.co/40x40/3b82f6/ffffff?text=${firstName
                      .charAt(0)
                      .toUpperCase()}`)
                  }
                />
              </div>
              <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                {firstName}
              </span>
            </div>
          )}
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#dc3545" }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                padding: "0.6em 1.5em",
                fontSize: "0.9em",
                fontWeight: "600",
                border: "none",
                borderRadius: 32,
                cursor: "pointer",
                boxShadow: "0 2px 12px #ff4d4f33",
                transition: "background 0.2s",
                outline: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
              onClick={handleLogout}
            >
              Sair <span style={{ marginLeft: 8, fontSize: 18 }}>→</span>
            </motion.button>
          )}
        </div>
      </section>

      {/* Corpo principal */}
      <div style={{ display: "flex", flex: 1, backgroundColor: "#0f172a" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "280px",
            backgroundColor: "#1e293b",
            padding: "2em 1.5em",
            borderRight: "1px solid #334155",
            boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            flexShrink: 0,
          }}
        >
          <h5
            style={{
              color: "#fff",
              marginBottom: "1.5em",
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
              fontSize: "1.4em",
            }}
          >
            <List size={24} color="#3b82f6" /> Filtros e Categorias
          </h5>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categories.map((cat) => (
              <li key={cat.name} style={{ marginBottom: "0.8em" }}>
                <motion.button
                  onClick={() => setSelectedCategory(cat.name)}
                  whileHover={{ x: 8, color: "#60a5fa" }}
                  style={{
                    background: "none",
                    border: "none",
                    color:
                      selectedCategory === cat.name ? "#3b82f6" : "#cbd5e1",
                    fontSize: "1.1em",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8em",
                    fontWeight:
                      selectedCategory === cat.name ? "bold" : "normal",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {cat.icon} {cat.name}
                </motion.button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <main style={{ flex: 1, padding: "4em 2em", overflowY: "auto" }}>
          <h2
            className="text-center text-white mb-5"
            style={{
              fontSize: "2.8em",
              fontWeight: "700",
              textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
            }}
          >
            Eventos Disponíveis
          </h2>

          {/* Barra de pesquisa */}
          <div
            style={{
              position: "relative",
              marginBottom: "3em",
              maxWidth: "700px",
              margin: "0 auto 3em auto",
            }}
          >
            <input
              type="text"
              placeholder="Buscar eventos por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "1em 1.5em 1em 3.5em",
                borderRadius: 30,
                border: "1px solid #334155",
                backgroundColor: "#1e293b",
                color: "#fff",
                fontSize: "1.1em",
                outline: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            />
            <Search
              size={24}
              color="#cbd5e1"
              style={{
                position: "absolute",
                left: "1em",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          {/* Lista de eventos */}
          <div className="row justify-content-center">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="col-lg-4 col-md-6 col-sm-12 p-3"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(59, 130, 246, 0.7)",
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleCardClick(event)}
                >
                  <div
                    style={{
                      ...cardStyle("#1e40af", "#2563eb"),
                      height: "auto",
                      minHeight: "350px",
                      justifyContent: "space-between",
                      padding: "25px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        marginBottom: "15px",
                        borderRadius: "15px",
                        overflow: "hidden",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h4
                      style={{
                        fontSize: "1.6em",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      {event.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.95em",
                        color: "#e0e0e0",
                        textAlign: "center",
                        flexGrow: 1,
                      }}
                    >
                      {event.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#0f172a",
                          padding: "5px 15px",
                          borderRadius: "20px",
                          fontSize: "0.85em",
                          fontWeight: "bold",
                          color: "#a78bfa",
                        }}
                      >
                        {event.category}
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            event.status === "Ativo" ? "#22c55e" : "#ef4444",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          display: "inline-block",
                          marginLeft: "8px",
                          verticalAlign: "middle",
                        }}
                        title={event.status}
                      ></span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-12 text-center p-5">
                <p style={{ fontSize: "1.5em", color: "#cbd5e1" }}>
                  Nenhum evento encontrado.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Detalhes do Evento */}
      <AnimatePresence>
        {showModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(5px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "linear-gradient(135deg, #1e293b, #0a192f)",
                borderRadius: 20,
                padding: "30px",
                color: "#fff",
                maxWidth: "800px",
                width: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                position: "relative",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.8em",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                &times;
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
                  }}
                >
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/600x400?text=Imagem+Indisponível")
                    }
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "2.2em",
                      marginBottom: "10px",
                      color: "#3b82f6",
                    }}
                  >
                    {selectedEvent.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      marginBottom: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#0f172a",
                        padding: "6px 15px",
                        borderRadius: "20px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        color: "#a78bfa",
                      }}
                    >
                      {selectedEvent.category || "Sem categoria"}
                    </span>

                    <span
                      style={{
                        backgroundColor:
                          selectedEvent.status === "Ativo"
                            ? "#22c55e33"
                            : "#ef444433",
                        color:
                          selectedEvent.status === "Ativo"
                            ? "#22c55e"
                            : "#ef4444",
                        padding: "6px 15px",
                        borderRadius: "20px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor:
                            selectedEvent.status === "Ativo"
                              ? "#22c55e"
                              : "#ef4444",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                        }}
                      ></span>
                      {selectedEvent.status || "Status não definido"}
                    </span>
                  </div>

                  {/* Descrição */}
                  {selectedEvent.description && (
                    <div
                      style={{
                        backgroundColor: "#1e293b",
                        padding: "15px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        border: "1px solid #334155",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.2em",
                          marginBottom: "10px",
                          color: "#3b82f6",
                        }}
                      >
                        Descrição
                      </h4>
                      <p style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Seção de Datas e Horários */}
                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #334155",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.2em",
                        marginBottom: "10px",
                        color: "#3b82f6",
                      }}
                    >
                      Datas e Horários
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Data Início
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.date
                            ? new Date(selectedEvent.date).toLocaleDateString(
                                "pt-BR"
                              )
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Data Fim
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.dataFim
                            ? new Date(
                                selectedEvent.dataFim
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Hora Início
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.horaInicio || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Hora Fim
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.horaFim || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Organização */}
                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #334155",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.2em",
                        marginBottom: "10px",
                        color: "#3b82f6",
                      }}
                    >
                      Organização
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Organizador
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.organizador || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Contato
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.contatoOrganizador || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Ingressos */}
                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #334155",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.2em",
                        marginBottom: "10px",
                        color: "#3b82f6",
                      }}
                    >
                      Informações de Ingressos
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Tipo de Ingresso
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.tipoIngresso || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Quantidade
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.quantidadeIngressos}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Início das Vendas
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.dataVendaInicio
                            ? new Date(
                                selectedEvent.dataVendaInicio
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.9em",
                            color: "#94a3b8",
                            marginBottom: "5px",
                          }}
                        >
                          Fim das Vendas
                        </p>
                        <p style={{ fontSize: "1em", fontWeight: "500" }}>
                          {selectedEvent.dataVendaFim
                            ? new Date(
                                selectedEvent.dataVendaFim
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Stands Ativos */}
                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #334155",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.2em",
                        marginBottom: "10px",
                        color: "#3b82f6",
                      }}
                    >
                      Stands Ativos
                    </h4>
                    
                    {selectedEvent.stands && selectedEvent.stands.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedEvent.stands.map((stand, index) => (
                          <span 
                            key={index}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.9em',
                              fontWeight: '500'
                            }}
                          >
                            {stand}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        Nenhum stand selecionado para este evento
                      </p>
                    )}
                  </div>

                  {/* Seção de Stands Registrados pelo Usuário */}
                  <div
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #334155",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.2em",
                        marginBottom: "10px",
                        color: "#3b82f6",
                      }}
                    >
                      Meus Stands Registrados
                    </h4>
                    
                    {registeredStands.length > 0 ? (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {registeredStands.map((stand, index) => (
                          <div 
                            key={index}
                            style={{
                              backgroundColor: '#1e40af',
                              padding: '12px',
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 'bold' }}>Stand {stand.codigo}</div>
                              <div style={{ fontSize: '0.9em', color: '#cbd5e1' }}>
                                {stand.descricao || 'Sem descrição'}
                              </div>
                            </div>
                            <div>
                              <button 
                                className="btn btn-sm btn-outline-danger me-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStand(stand.id);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStand(stand);
                                }}
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        Você não possui stands registrados para este evento
                      </p>
                    )}
                  </div>
                </div>

                {selectedEvent.status !== "Encerrado" && (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#10b981" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      backgroundColor: "#22c55e",
                      color: "#fff",
                      padding: "0.8em 2em",
                      fontSize: "1em",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: 30,
                      cursor: "pointer",
                      boxShadow: "0 4px 15px #22c55e55",
                      transition: "background 0.2s",
                      outline: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onClick={() => navigate(`/stand-registration/${selectedEvent.id}`)}
                  >
                    Cadastrar Stands para Este Evento
                  </motion.button>
                )}
                {isAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      backgroundColor: isEventFavorited(selectedEvent.id)
                        ? "#ff6347"
                        : "#6b7280",
                      color: "#fff",
                      padding: "0.8em 2em",
                      fontSize: "1em",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: 30,
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      transition: "background 0.2s",
                      outline: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(e, selectedEvent);
                    }}
                  >
                    <Heart
                      size={20}
                      fill={
                        isEventFavorited(selectedEvent.id) ? "#fff" : "none"
                      }
                      color={"#fff"}
                    />
                    {isEventFavorited(selectedEvent.id)
                      ? "Desfavoritar Evento"
                      : "Favoritar Evento"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Seleção de Stands */}
      <Modal 
        show={showStandSelectionModal} 
        onHide={() => setShowStandSelectionModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: '#1e293b', color: 'white' }}>
          <Modal.Title>Selecionar Stands para o Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#0f172a', color: 'white' }}>
          {loadingStands && !selectionError ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando stands disponíveis...</p>
            </div>
          ) : selectionError ? (
            <div className="alert alert-danger">
              {selectionError}
              <button 
                className="btn btn-sm btn-outline-light ms-3"
                onClick={() => handleRegisterStandClick(currentEventId)}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <h5 style={{ marginBottom: '20px' }}>Stands Disponíveis:</h5>
              {availableStands.length === 0 ? (
                <p>Não há stands disponíveis para este evento.</p>
              ) : (
                <div className="row">
                  {availableStands.map(stand => {
                    let borderColor = '#334155';
                    let backgroundColor = '#1e293b';
                    let textColor = 'white';
                    let isClickable = true;
                    
                    if (stand.isRegisteredByMe) {
                      borderColor = '#dc3545';
                      backgroundColor = '#dc354533';
                      textColor = '#dc3545';
                      isClickable = false;
                    } else if (stand.ocupado) {
                      borderColor = '#8b0000';
                      backgroundColor = '#8b000033';
                      textColor = '#ff6b6b';
                      isClickable = false;
                    } else if (selectedStands.includes(stand.id)) {
                      borderColor = '#3b82f6';
                      backgroundColor = '#3b82f633';
                      textColor = '#3b82f6';
                    } else {
                      borderColor = '#198754';
                      backgroundColor = '#19875433';
                      textColor = '#22c55e';
                    }
                    
                    return (
                      <div className="col-md-4 mb-3" key={stand.id}>
                        <div 
                          className="p-3 rounded"
                          style={{
                            border: `2px solid ${borderColor}`,
                            backgroundColor: backgroundColor,
                            cursor: isClickable ? 'pointer' : 'not-allowed',
                            opacity: isClickable ? 1 : 0.6,
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => isClickable && handleStandSelection(
                            stand.id, 
                            !selectedStands.includes(stand.id)
                          )}
                        >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedStands.includes(stand.id)}
                              onChange={(e) => isClickable && handleStandSelection(stand.id, e.target.checked)}
                              id={`stand-${stand.id}`}
                              disabled={!isClickable}
                            />
                            <label 
                              className="form-check-label" 
                              htmlFor={`stand-${stand.id}`}
                              style={{ color: textColor }}
                            >
                              <strong>Stand {stand.codigo}</strong>
                              {stand.localizacao && (
                                <div className="small" style={{ opacity: 0.8 }}>
                                  Local: {stand.localizacao}
                                </div>
                              )}
                              {stand.descricao && (
                                <div className="small mt-1" style={{ opacity: 0.8 }}>
                                  {stand.descricao}
                                </div>
                              )}
                              {stand.isRegisteredByMe && (
                                <div className="small mt-1" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                  Já registrado por você
                                </div>
                              )}
                              {stand.ocupado && !stand.isRegisteredByMe && (
                                <div className="small mt-1" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                  Ocupado por outro expositor
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1e293b' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowStandSelectionModal(false)}
            disabled={loadingStands}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmStandSelection}
            disabled={selectedStands.length === 0 || loadingStands}
          >
            {loadingStands ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processando...
              </>
            ) : (
              `Confirmar Seleção (${selectedStands.length} selecionados)`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Cadastro de Stand */}
      <Modal 
        show={showStandRegistrationModal} 
        onHide={() => {
          setShowStandRegistrationModal(false);
          setStandDescription('');
          setSelectedStandToRegister(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: '#1e293b', color: 'white' }}>
          <Modal.Title>
            {selectedStandToRegister && registeredStands.some(s => s.id === selectedStandToRegister) 
              ? 'Editar Stand' 
              : 'Cadastrar Stand'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#0f172a', color: 'white' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Selecione o Stand:</Form.Label>
              <Form.Select 
                value={selectedStandToRegister || ''}
                onChange={(e) => setSelectedStandToRegister(e.target.value)}
                required
                disabled={selectedStandToRegister && registeredStands.some(s => s.id === selectedStandToRegister)}
              >
                <option value="">Selecione um stand</option>
                {availableStandsForRegistration.map(stand => (
                  <option key={stand.id} value={stand.id}>
                    {stand.codigo} - {stand.localizacao || 'Localização não especificada'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição do Stand:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={standDescription}
                onChange={(e) => setStandDescription(e.target.value)}
                placeholder="Descreva o que você fará neste stand..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1e293b' }}>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowStandRegistrationModal(false);
              setStandDescription('');
              setSelectedStandToRegister(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRegisterStand}
            disabled={!selectedStandToRegister || !standDescription}
          >
            {selectedStandToRegister && registeredStands.some(s => s.id === selectedStandToRegister) 
              ? 'Atualizar Stand' 
              : 'Cadastrar Stand'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}