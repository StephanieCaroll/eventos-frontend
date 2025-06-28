import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const { authToken, isAuthenticated, isAuthReady } = useContext(AuthContext);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            console.log("EventContext Depuração: Início do useEffect. isAuthReady:", isAuthReady, "isAuthenticated:", isAuthenticated, "authToken presente:", !!authToken);

            if (isAuthReady && isAuthenticated && authToken) {
                console.log("EventContext Depuração: Condição de busca de eventos atendida. Buscando do backend...");
                try {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    };
                    const response = await axios.get("http://localhost:8080/api/evento", config);
                    console.log("EventContext Depuração: Eventos carregados do backend (dados brutos):", response.data);

                    const fetchedAndMappedEvents = response.data.map(be => {
                        const vendaInicioDate = new Date(be.dataVendaInicio);
                        const currentDate = new Date();

                        // Ajusta a data atual para o início do dia para comparação apenas de data
                        currentDate.setHours(0, 0, 0, 0);
                        vendaInicioDate.setHours(0, 0, 0, 0);

                        // O evento está 'Ativo' se a data de início das vendas for igual ou posterior ao dia de hoje
                        const statusCalculated = (!isNaN(vendaInicioDate.getTime()) && vendaInicioDate >= currentDate) ? 'Ativo' : 'Encerrado';

                        console.log(`--- Processando Evento: ${be.nomeEvento} ---`);
                        console.log(`  Data Venda Início (backend): ${be.dataVendaInicio}`);
                        console.log(`  Data Objeto JS (dataVendaInicio): ${vendaInicioDate}`);
                        console.log(`  É uma data válida (dataVendaInicio)? ${!isNaN(vendaInicioDate.getTime())}`);
                        console.log(`  Data Atual (apenas dia): ${currentDate}`);
                        console.log(`  Comparação: ${vendaInicioDate.toISOString().split('T')[0]} >= ${currentDate.toISOString().split('T')[0]} ?`);
                        console.log(`  Status Calculado: ${statusCalculated}`);
                        console.log(`-------------------------------------`);


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
                    console.log("EventContext Depuração: Eventos no estado atualizados.");
                } catch (error) {
                    console.error("EventContext Depuração: Erro ao carregar eventos do backend:", error);
                    if (error.response) {
                        console.error("EventContext Depuração: Resposta do erro:", error.response.status, error.response.data);
                    }
                    setEvents([]); 
                    console.log("EventContext Depuração: Eventos definidos como vazios devido a erro na busca do backend.");
                }

            } else {
                console.log("EventContext Depuração: Autenticação ainda não pronta ou token ausente. Não buscando eventos ainda.");
            }
        };

        fetchEvents();
    }, [authToken, isAuthenticated, isAuthReady]);

    const addEvent = (newEvent) => {
        setEvents((prevEvents) => [{ id: newEvent.id, ...newEvent }, ...prevEvents]);
    };

    const updateEvent = (updatedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    };

    const deleteEvent = (id) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    };

    return (
        <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    return useContext(EventContext);
};