import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const EventContext = createContext();

const API_BASE_URL = 'http://localhost:8080';

export const EventProvider = ({ children }) => {
    const { userEmail, authToken, isAuthenticated, isAuthReady } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [favoritedEvents, setFavoritedEvents] = useState([]); 
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState(null);

    // Função para buscar todos os eventos
    const fetchEvents = useCallback(async () => {
        setLoadingEvents(true);
        setErrorEvents(null);
        try {
            console.log("EventContext Depuração: Buscando todos os eventos. AuthToken presente:", !!authToken, "UserEmail:", userEmail); 
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            };
            const response = await axios.get(`${API_BASE_URL}/api/evento`, config);
            const fetchedAndMappedEvents = response.data.map(be => {
                const vendaInicioDate = new Date(be.dataVendaInicio);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                vendaInicioDate.setHours(0, 0, 0, 0);

                const statusCalculated = (!isNaN(vendaInicioDate.getTime()) && vendaInicioDate >= currentDate) ? 'Ativo' : 'Encerrado';

                return {
                    id: be.id,
                    name: be.nomeEvento,
                    description: be.descricao,
                    longDescription: be.descricao,
                    image: be.urlImagem, 
                    category: be.categoria,
                    status: statusCalculated,
                    date: be.dataInicio, 
                    dataFim: be.dataFim,
                    horaInicio: be.horaInicio,
                    horaFim: be.horaFim,
                    organizador: be.organizador,
                    contatoOrganizador: be.contatoOrganizador,
                    tipoIngresso: be.tipoIngresso,
                    quantidadeIngressos: be.quantidadeIngressos,
                    dataVendaInicio: be.dataVendaInicio,
                    dataVendaFim: be.dataVendaFim,
                };
            });
            setEvents(fetchedAndMappedEvents);
            console.log("EventContext Depuração: Eventos carregados e mapeados com sucesso.");
        } catch (error) {
            console.error("EventContext Depuração: Erro ao carregar eventos:", error.response?.data || error.message);
            setErrorEvents("Não foi possível carregar os eventos.");
            setEvents([]); 
        } finally {
            setLoadingEvents(false);
        }
    }, [authToken, userEmail]); 

    // Função para buscar eventos favoritados pelo usuário
    const fetchFavoritedEvents = useCallback(async () => {
        if (!isAuthenticated || !userEmail) {
            console.log("EventContext Depuração: Usuário não autenticado ou email ausente. Não buscando favoritos.");
            setFavoritedEvents([]); 
            return;
        }

        try {
            console.log("EventContext Depuração: Buscando eventos favoritos para:", userEmail);
            const response = await axios.get(`${API_BASE_URL}/api/clientes/by-email/${encodeURIComponent(userEmail)}/favorited-events`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            const mappedFavoritedEvents = response.data.map(favEvent => ({
                id: favEvent.id,
                name: favEvent.nomeEvento,     
                description: favEvent.descricao,
                longDescription: favEvent.descricao, 
                image: favEvent.urlImagem,       
                category: favEvent.categoria,
                status: favEvent.status,         
                date: favEvent.dataInicio,        
                dataFim: favEvent.dataFim,
                horaInicio: favEvent.horaInicio,
                horaFim: favEvent.horaFim,
                organizador: favEvent.organizador,
                contatoOrganizador: favEvent.contatoOrganizador,
                tipoIngresso: favEvent.tipoIngresso,
                quantidadeIngressos: favEvent.quantidadeIngressos,
                dataVendaInicio: favEvent.dataVendaInicio,
                dataVendaFim: favEvent.dataVendaFim,
            }));
            setFavoritedEvents(mappedFavoritedEvents); 
            console.log("EventContext Depuração: Eventos favoritos carregados e mapeados:", mappedFavoritedEvents.length);
        } catch (err) {
            console.error("EventContext Depuração: Erro ao buscar eventos favoritos:", err.response?.data || err.message);
            setFavoritedEvents([]); 
        }
    }, [isAuthenticated, userEmail, authToken]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        if (isAuthReady) {
            fetchFavoritedEvents();
        }
    }, [isAuthReady, fetchFavoritedEvents]);

    // Função para adicionar/remover um evento dos favoritos
    const toggleFavorite = useCallback(async (event) => {
        if (!isAuthenticated || !userEmail) {
            console.log('Você precisa estar logado para favoritar eventos.'); 
            return;
        }

        let isFavorited = false;
        try {
            isFavorited = favoritedEvents.some(fav => fav.id === event.id); 
            if (isFavorited) {
                console.log("EventContext Depuração: Desfavoritando evento:", event.id);
                await axios.delete(`${API_BASE_URL}/api/clientes/${userEmail}/desfavoritar/${event.id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            } else {
                console.log("EventContext Depuração: Favoritando evento:", event.id);
                await axios.post(`${API_BASE_URL}/api/clientes/${userEmail}/favoritar/${event.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            }
            
            await fetchFavoritedEvents();
            console.log(`Evento ${isFavorited ? 'desfavoritado' : 'favoritado'} com sucesso!`); 
        } catch (err) {
            console.error(`EventContext Depuração: Erro ao ${isFavorited ? 'desfavoritar' : 'favoritar'} evento:`, err.response?.data || err.message);
            console.log(`Erro ao ${isFavorited ? 'desfavoritar' : 'favoritar'} o evento. Verifique o console para mais detalhes.`); 
        }
    }, [isAuthenticated, userEmail, authToken, favoritedEvents, fetchFavoritedEvents]);

    const addEvent = async (newEvent) => {
        console.warn("Função addEvent não implementada no EventContext.");
    };

    const updateEvent = async (id, updatedEvent) => {
        console.warn("Função updateEvent não implementada no EventContext.");
    };

    const deleteEvent = async (id) => {
        console.warn("Função deleteEvent não implementada no EventContext.");
    };

    return (
        <EventContext.Provider value={{ 
            events, 
            loadingEvents, 
            errorEvents, 
            addEvent, 
            updateEvent, 
            deleteEvent, 
            favoritedEvents, 
            toggleFavorite
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents deve ser usado dentro de um EventProvider');
    }
    return context;
};
