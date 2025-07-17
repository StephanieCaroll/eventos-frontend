import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const EventContext = createContext();

const API_BASE_URL = 'http://localhost:8080';
const STANDS_STORAGE_KEY = 'eventStandsData';

const createLocalDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString + 'T00:00:00');
};

export const formatDateForInput = (dateObject) => {
  if (!dateObject) return '';
  const date = new Date(dateObject);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};

const calculateEventStatus = (dataVendaInicio) => {
  if (!dataVendaInicio) return 'Encerrado';
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const inicio = createLocalDate(dataVendaInicio);
  return inicio && inicio.getTime() >= currentDate.getTime() ? 'Ativo' : 'Encerrado';
};

const processStandsData = (stands) => {
  if (!stands) return [];
  if (Array.isArray(stands)) return stands.filter(stand => stand);
  if (typeof stands === 'string') {
    return stands.split(',')
      .map(stand => stand.trim())
      .filter(stand => stand);
  }
  return [];
};

export const EventProvider = ({ children }) => {
  const { userEmail, authToken, isAuthenticated, isAuthReady } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [favoritedEvents, setFavoritedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);
  
  // Carrega os stands do localStorage ao iniciar
  const [lastStandsData, setLastStandsData] = useState(() => {
    try {
      const saved = localStorage.getItem(STANDS_STORAGE_KEY);
      return saved ? new Map(JSON.parse(saved)) : new Map();
    } catch {
      return new Map();
    }
  });

  // Salva os stands no localStorage sempre que mudam
  useEffect(() => {
    try {
      localStorage.setItem(
        STANDS_STORAGE_KEY,
        JSON.stringify(Array.from(lastStandsData.entries()))
      );
    } catch (error) {
      console.error("Error saving stands to localStorage:", error);
    }
  }, [lastStandsData]);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    setErrorEvents(null);
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${authToken}` }
      };
      const response = await axios.get(`${API_BASE_URL}/api/evento`, config);

      const updatedEvents = response.data.map(event => {
        // Prioridade: 1. Dados da API, 2. localStorage, 3. Array vazio
        const apiStands = processStandsData(event.stands);
        const savedStands = lastStandsData.get(event.id) || [];
        const finalStands = apiStands.length > 0 ? apiStands : savedStands;

        return {
          id: event.id,
          name: event.nomeEvento || '',
          description: event.descricao || '',
          longDescription: event.descricao || '',
          image: event.urlImagem || '',
          category: event.categoria || '',
          status: calculateEventStatus(event.dataVendaInicio),
          date: createLocalDate(event.dataInicio),
          dataFim: createLocalDate(event.dataFim),
          horaInicio: event.horaInicio || '',
          horaFim: event.horaFim || '',
          organizador: event.organizador || '',
          contatoOrganizador: event.contatoOrganizador || '',
          tipoIngresso: event.tipoIngresso || '',
          quantidadeIngressos: event.quantidadeIngressos || 0,
          dataVendaInicio: createLocalDate(event.dataVendaInicio),
          dataVendaFim: createLocalDate(event.dataVendaFim),
          stands: finalStands,
          standsInput: finalStands.join(', ')
        };
      });

      setEvents(updatedEvents);
    } catch (error) {
      console.error("Event fetch error:", error);
      setErrorEvents("Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  }, [authToken, lastStandsData]);

  const addEvent = useCallback(async (newEventData) => {
    setLoadingEvents(true);
    try {
      const processedStands = processStandsData(newEventData.stands || newEventData.standsInput);
      const payload = {
        ...newEventData,
        stands: processedStands
      };

      const response = await axios.post(`${API_BASE_URL}/api/evento`, payload, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Atualiza o cache local de stands
      setLastStandsData(prev => new Map(prev).set(response.data.id, processedStands));

      await fetchEvents();
      return {
        ...response.data,
        stands: response.data.stands || processedStands,
        standsInput: (response.data.stands || processedStands).join(', ')
      };
    } catch (error) {
      console.error("Add event error:", error);
      throw error;
    } finally {
      setLoadingEvents(false);
    }
  }, [authToken, fetchEvents]);

  const updateEvent = useCallback(async (id, updatedEventData) => {
    setLoadingEvents(true);
    try {
      const processedStands = processStandsData(updatedEventData.stands || updatedEventData.standsInput);
      const payload = {
        ...updatedEventData,
        stands: processedStands
      };

      const response = await axios.put(`${API_BASE_URL}/api/evento/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Atualiza o cache local de stands
      setLastStandsData(prev => new Map(prev).set(id, processedStands));

      await fetchEvents();
      return {
        ...response.data,
        stands: response.data.stands || processedStands,
        standsInput: (response.data.stands || processedStands).join(', ')
      };
    } catch (error) {
      console.error("Update event error:", error);
      throw error;
    } finally {
      setLoadingEvents(false);
    }
  }, [authToken, fetchEvents]);

  const deleteEvent = useCallback(async (id) => {
    setLoadingEvents(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/evento/${id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      // Remove o cache local dos stands
      setLastStandsData(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });

      await fetchEvents();
      setFavoritedEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error("Delete event error:", error);
      throw error;
    } finally {
      setLoadingEvents(false);
    }
  }, [authToken, fetchEvents]);

  const fetchFavoritedEvents = useCallback(async () => {
    if (!isAuthenticated || !userEmail) {
      setFavoritedEvents([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/clientes/by-email/${encodeURIComponent(userEmail)}/favorited-events`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const mappedEvents = response.data.map(event => ({
        id: event.id,
        name: event.nomeEvento || '',
        description: event.descricao || '',
        image: event.urlImagem || '',
        category: event.categoria || '',
        status: calculateEventStatus(event.dataVendaInicio),
        date: createLocalDate(event.dataInicio),
        dataFim: createLocalDate(event.dataFim),
        horaInicio: event.horaInicio || '',
        horaFim: event.horaFim || '',
        organizador: event.organizador || '',
        contatoOrganizador: event.contatoOrganizador || '',
        tipoIngresso: event.tipoIngresso || '',
        quantidadeIngressos: event.quantidadeIngressos || 0,
        dataVendaInicio: createLocalDate(event.dataVendaInicio),
        dataVendaFim: createLocalDate(event.dataVendaFim),
        stands: event.stands || [],
        standsInput: (event.stands || []).join(', ')
      }));

      setFavoritedEvents(mappedEvents);
    } catch (error) {
      console.error("Fetch favorites error:", error);
    }
  }, [isAuthenticated, userEmail, authToken]);

  const toggleFavorite = useCallback(async (event) => {
    if (!isAuthenticated || !userEmail) return;

    try {
      const isFavorited = favoritedEvents.some(fav => fav.id === event.id);
      const endpoint = isFavorited ? 'desfavoritar' : 'favoritar';
      
      await axios[isFavorited ? 'delete' : 'post'](
        `${API_BASE_URL}/api/clientes/${userEmail}/${endpoint}/${event.id}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      await fetchFavoritedEvents();
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  }, [isAuthenticated, userEmail, authToken, favoritedEvents, fetchFavoritedEvents]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { if (isAuthReady) fetchFavoritedEvents(); }, [isAuthReady, fetchFavoritedEvents]);

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
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};