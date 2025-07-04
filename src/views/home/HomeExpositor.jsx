import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, Search, List, Star, Clapperboard, Monitor, Paintbrush, Heart } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { useEvents } from '../../contexts/EventContext'; 

function cardStyle(color1, color2) {
    return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        borderRadius: 24,
        padding: 30,
        color: '#fff',
        boxShadow: `0 0 30px ${color1}88`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        position: 'relative',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer'
    };
}

function Footer() {
    return (
        <footer style={{ backgroundColor: '#0a192f', color: '#fff', padding: '2em 0', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Events Stands. Todos os direitos reservados.</p>
                <p>Desenvolvido com <span role="img" aria-label="coração">❤️</span></p>
            </div>
        </footer>
    );
}

export default function HomeExpositor() {
    const navigate = useNavigate();
    const { isAuthenticated, userRoles, userName, logout } = useContext(AuthContext);
    const { events, favoritedEvents = [], toggleFavorite } = useEvents(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos os Eventos');
    const [selectedEvent, setSelectedEvent] = useState(null); 

    useEffect(() => {
        console.log('[HomeExpositor] Componente carregado.');
        console.log('[HomeExpositor] isAuthenticated:', isAuthenticated);
        console.log('[HomeExpositor] userRoles:', userRoles);
        console.log('[HomeExpositor] userName:', userName);
    }, [isAuthenticated, userRoles, userName]);

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const firstName = userName ? userName.split(' ')[0] : 'Usuário';

    const categories = [
        { name: 'Todos os Eventos', icon: <CalendarCheck size={20} /> },
        { name: 'Eventos Ativos', icon: <Star size={20} /> },
        { name: 'Eventos Passados', icon: <Clapperboard size={20} /> },
        { name: 'Tecnologia', icon: <Monitor size={20} /> },
        { name: 'Arte', icon: <Paintbrush size={20} /> },
        { name: 'Entretenimento', icon: <Clapperboard size={20} /> }
    ];

    const filteredEvents = events.filter(event => { 
        const matchesCategory = selectedCategory === 'Todos os Eventos' ||
                                (selectedCategory === 'Eventos Ativos' && event.status === 'Ativo') ||
                                (selectedCategory === 'Eventos Passados' && event.status === 'Encerrado') ||
                                (selectedCategory === event.category);

        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                event.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleCardClick = (event) => {
        setSelectedEvent(event);
    };

    const handleRegisterStandClick = (eventId) => {
        navigate(`/cadastro-stand/${eventId}`);
        setSelectedEvent(null); 
    };

    const handleFavoriteClick = async (e, event) => {
        e.stopPropagation(); 
        await toggleFavorite(event);
    };

    const isEventFavorited = (eventId) => {
        return favoritedEvents.some(fav => fav.id === eventId);
    };

    return (
        <div style={{ backgroundColor: '#0a192f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <section style={{
                padding: '1.5em 2em',
                background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
                color: '#fff',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1em'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <h1 style={{ fontSize: '2.5em', fontWeight: '800', letterSpacing: '1px', color: '#3b82f6', margin: 0 }}>
                        Events Stands - Expositor
                    </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5em', flexShrink: 0, marginLeft: 'auto' }}>
                    {isAuthenticated && userName && (
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.8em', color: '#fff', cursor: 'pointer' }}
                            onClick={() => navigate('/profile')} 
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid #3b82f6'
                            }}>
                                <img
                                    src={`https://placehold.co/40x40/3b82f6/ffffff?text=${firstName.charAt(0).toUpperCase()}`}
                                    alt="Avatar do Usuário"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = `https://placehold.co/40x40/3b82f6/ffffff?text=${firstName.charAt(0).toUpperCase()}`}
                                />
                            </div>
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                {firstName}
                            </span>
                        </div>
                    )}
                    {isAuthenticated && (
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#dc3545' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                backgroundColor: '#ff4d4f',
                                color: '#fff',
                                padding: '0.6em 1.5em',
                                fontSize: '0.9em',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: 32,
                                cursor: 'pointer',
                                boxShadow: '0 2px 12px #ff4d4f33',
                                transition: 'background 0.2s',
                                outline: 'none',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                            onClick={handleLogout}
                        >
                            Sair <span style={{ marginLeft: 8, fontSize: 18 }}>→</span>
                        </motion.button>
                    )}
                </div>
            </section>

            <div style={{ display: 'flex', flex: 1, backgroundColor: '#0f172a' }}>
                <aside style={{
                    width: '280px',
                    backgroundColor: '#1e293b',
                    padding: '2em 1.5em',
                    borderRight: '1px solid #334155',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1em',
                    flexShrink: 0
                }}>
                    <h5 style={{ color: '#fff', marginBottom: '1.5em', display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1.4em' }}>
                        <List size={24} color="#3b82f6" /> Filtros e Categorias
                    </h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {categories.map(cat => (
                            <li key={cat.name} style={{ marginBottom: '0.8em' }}>
                                <motion.button
                                    onClick={() => setSelectedCategory(cat.name)}
                                    whileHover={{ x: 8, color: '#60a5fa' }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: selectedCategory === cat.name ? '#3b82f6' : '#cbd5e1',
                                        fontSize: '1.1em',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8em',
                                        fontWeight: selectedCategory === cat.name ? 'bold' : 'normal',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {cat.icon} {cat.name}
                                </motion.button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main style={{ flex: 1, padding: '4em 2em', overflowY: 'auto' }}>
                    <h2 className="text-center text-white mb-5" style={{ fontSize: '2.8em', fontWeight: '700', textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>Eventos Disponíveis</h2>

                    <div style={{ position: 'relative', marginBottom: '3em', maxWidth: '700px', margin: '0 auto 3em auto' }}>
                        <input
                            type="text"
                            placeholder="Buscar eventos por nome ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1em 1.5em 1em 3.5em',
                                borderRadius: 30,
                                border: '1px solid #334155',
                                backgroundColor: '#1e293b',
                                color: '#fff',
                                fontSize: '1.1em',
                                outline: 'none',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        />
                        <Search size={24} color="#cbd5e1" style={{ position: 'absolute', left: '1em', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    <div className="row justify-content-center">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                                <motion.div
                                    key={event.id}
                                    className="col-lg-4 col-md-6 col-sm-12 p-3"
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(59, 130, 246, 0.7)' }}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    onClick={() => handleCardClick(event)}
                                >
                                    <div style={{
                                        ...cardStyle('#1e40af', '#2563eb'),
                                        height: 'auto',
                                        minHeight: '350px',
                                        justifyContent: 'space-between',
                                        padding: '25px',
                                        position: 'relative'
                                    }}>
                                        <div style={{ width: '100%', height: '180px', marginBottom: '15px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                                            <img src={event.image} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <h4 style={{ fontSize: '1.6em', marginBottom: '10px', textAlign: 'center' }}>{event.name}</h4>
                                        <p style={{ fontSize: '0.95em', color: '#e0e0e0', textAlign: 'center', flexGrow: 1 }}>{event.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '15px' }}>
                                            <span style={{ backgroundColor: '#0f172a', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', color: '#a78bfa' }}>
                                                {event.category}
                                            </span>
                                            <span style={{
                                                backgroundColor: event.status === 'Ativo' ? '#22c55e' : '#ef4444',
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                marginLeft: '8px',
                                                verticalAlign: 'middle'
                                            }} title={event.status}></span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-12 text-center p-5">
                                <p style={{ fontSize: '1.5em', color: '#cbd5e1' }}>Nenhum evento encontrado para a sua busca ou categoria.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(135deg, #1e293b, #0a192f)',
                                borderRadius: 20,
                                padding: '30px',
                                color: '#fff',
                                maxWidth: '700px',
                                width: '90%',
                                maxHeight: '90vh', 
                                overflowY: 'auto', 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <button
                                onClick={() => setSelectedEvent(null)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '1.8em',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                &times;
                            </button>
                            <img src={selectedEvent.image} alt={selectedEvent.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.4)' }} />
                            <h3 style={{ fontSize: '2.2em', marginBottom: '15px', color: '#3b82f6' }}>{selectedEvent.name}</h3>
                            <p style={{ fontSize: '1.1em', lineHeight: '1.6', marginBottom: '20px' }}>{selectedEvent.longDescription}</p>
                            
                            <div style={{ textAlign: 'left', width: '100%', marginBottom: '20px', fontSize: '1em', color: '#e0e0e0' }}>
                                <p><strong>Categoria:</strong> {selectedEvent.category}</p>
                                <p><strong>Status:</strong> <span style={{ color: selectedEvent.status === 'Ativo' ? '#22c55e' : '#ef4444' }}>{selectedEvent.status}</span></p>
                                <p><strong>Data de Início:</strong> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                <p><strong>Data de Término:</strong> {selectedEvent.dataFim ? new Date(selectedEvent.dataFim).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                <p><strong>Hora de Início:</strong> {selectedEvent.horaInicio || 'N/A'}</p>
                                <p><strong>Hora de Término:</strong> {selectedEvent.horaFim || 'N/A'}</p>
                                <p><strong>Organizador:</strong> {selectedEvent.organizador || 'N/A'}</p>
                                <p><strong>Contato do Organizador:</strong> {selectedEvent.contatoOrganizador || 'N/A'}</p>
                                <p><strong>Tipo de Ingresso:</strong> {selectedEvent.tipoIngresso || 'N/A'}</p>
                                {selectedEvent.quantidadeIngressos && <p><strong>Quantidade de Ingressos:</strong> {selectedEvent.quantidadeIngressos}</p>}
                                <p><strong>Início das Vendas:</strong> {selectedEvent.dataVendaInicio ? new Date(selectedEvent.dataVendaInicio).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                <p><strong>Fim das Vendas:</strong> {selectedEvent.dataVendaFim ? new Date(selectedEvent.dataVendaFim).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>

                            {selectedEvent.status === 'Ativo' && ( 
                                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: '#10b981' }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            backgroundColor: '#22c55e',
                                            color: '#fff',
                                            padding: '0.8em 2em',
                                            fontSize: '1em',
                                            fontWeight: '600',
                                            border: 'none',
                                            borderRadius: 30,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px #22c55e55',
                                            transition: 'background 0.2s',
                                            outline: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onClick={() => handleRegisterStandClick(selectedEvent.id)}
                                    >
                                        Cadastrar Stands para Este Evento
                                    </motion.button>

                                    {isAuthenticated && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                backgroundColor: isEventFavorited(selectedEvent.id) ? '#ff6347' : '#6b7280', 
                                                color: '#fff',
                                                padding: '0.8em 2em',
                                                fontSize: '1em',
                                                fontWeight: '600',
                                                border: 'none',
                                                borderRadius: 30,
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                                transition: 'background 0.2s',
                                                outline: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onClick={(e) => handleFavoriteClick(e, selectedEvent)}
                                        >
                                            <Heart size={20} fill={isEventFavorited(selectedEvent.id) ? '#fff' : 'none'} color={'#fff'} />
                                            {isEventFavorited(selectedEvent.id) ? 'Desfavoritar Evento' : 'Favoritar Evento'}
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
