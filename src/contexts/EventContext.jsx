import React, { createContext, useState, useContext } from 'react';

// Dados fictícios iniciais para os eventos
const initialFictitiousEvents = [
    {
        id: 1,
        name: "Tech Expo 2025",
        description: "A maior feira de tecnologia da América Latina, apresentando inovações em IA, robótica e software.",
        longDescription: "A Tech Expo 2025 é o ponto de encontro de líderes e entusiastas da tecnologia. Com palestras inspiradoras, workshops práticos e uma área de exposição com as mais recentes inovações em inteligência artificial, realidade virtual e cibersegurança, este evento é imperdível para quem busca se manter atualizado no mundo digital. Oportunidade perfeita para networking e descoberta de novas tendências.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0-kHojs43wQrnfQvM8It1k6oTjJwfyv2RQ&s",
        category: "Tecnologia",
        status: "Ativo",
        date: "2025-09-15", 
        dataFim: "2025-09-17",
        horaInicio: "09:00",
        horaFim: "18:00",
        organizador: "Tech Events Inc.",
        contatoOrganizador: "contact@techexpo.com",
        tipoIngresso: "gratuito",
        quantidadeIngressos: null,
        dataVendaInicio: null,
        dataVendaFim: null,
    },
    {
        id: 2,
        name: "Festival de Artes Primavera",
        description: "Celebração da arte e cultura com exposições, performances e oficinas para todas as idades.",
        longDescription: "O Festival de Artes Primavera é um evento vibrante que transforma a cidade em uma galeria a céu aberto. Descubra talentos locais e internacionais através de exposições de pintura, escultura, fotografia e instalações interativas. Desfrute de apresentações de música, dança e teatro ao vivo, e participe de oficinas criativas para todas as idades. Uma verdadeira imersão no universo artístico.",
        image: "https://i.ytimg.com/vi/UPtDj3iGEPY/maxresdefault.jpg",
        category: "Arte",
        status: "Ativo",
        date: "2025-10-20", 
        dataFim: "2025-10-22",
        horaInicio: "10:00",
        horaFim: "20:00",
        organizador: "Cultura Viva",
        contatoOrganizador: "contato@festivalartes.com",
        tipoIngresso: "pago",
        quantidadeIngressos: 500,
        dataVendaInicio: "2025-08-01",
        dataVendaFim: "2025-10-19",
    },
    {
        id: 3,
        name: "GameCon Brasil",
        description: "Imersão no mundo dos games, com lançamentos, torneios e áreas de experimentação.",
        longDescription: "A GameCon Brasil é o paraíso dos gamers! Prepare-se para experimentar os jogos mais aguardados, participar de torneios emocionantes com grandes prêmios, encontrar desenvolvedores e influenciadores, e mergulhar em experiências de realidade virtual e esports. Não importa se você é um jogador casual ou competitivo, a GameCon tem algo para todos.",
        image: "https://sm.ign.com/ign_br/screenshot/default/image_e7eh.jpg",
        category: "Entretenimento",
        status: "Ativo",
        date: "2025-11-05",
        dataFim: "2025-11-07",
        horaInicio: "11:00",
        horaFim: "22:00",
        organizador: "Gaming Worlds S.A.",
        contatoOrganizador: "info@gamecon.com.br",
        tipoIngresso: "pago",
        quantidadeIngressos: 2000,
        dataVendaInicio: "2025-09-01",
        dataVendaFim: "2025-11-04",
    },
    {
        id: 4,
        name: "Conferência de Inovação Sustentável",
        description: "Debates e soluções sobre energias renováveis e desenvolvimento sustentável.",
        longDescription: "A Conferência de Inovação Sustentável reúne especialistas, empresas e governos para discutir e apresentar soluções para os desafios ambientais atuais. Explore as últimas tendências em energias renováveis, economia circular e tecnologias verdes. Participe de painéis interativos e faça parte da construção de um futuro mais sustentável.",
        image: "https://i.ytimg.com/vi/JkCpqu8CJEA/sddefault.jpg",
        category: "Tecnologia",
        status: "Encerrado",
        date: "2024-03-10",
        dataFim: "2024-03-12",
        horaInicio: "09:00",
        horaFim: "17:00",
        organizador: "Green Futures",
        contatoOrganizador: "contato@inovacaosustentavel.org",
        tipoIngresso: "gratuito",
        quantidadeIngressos: null,
        dataVendaInicio: null,
        dataVendaFim: null,
    },
    {
        id: 5,
        name: "Feira Literária da Cidade",
        description: "Encontro de autores, leitores e editoras com lançamentos e sessões de autógrafos.",
        longDescription: "A Feira Literária da Cidade é um paraíso para os amantes de livros. Descubra novos autores, participe de sessões de autógrafos com seus escritores favoritos e explore uma vasta gama de gêneros literários. Há também contação de histórias para crianças, debates e workshops para aspirantes a escritores. Uma celebração da leitura e do conhecimento.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeJZ623X0Orp9tRfYwBQcgd7cfZqVyWQb-nw&s",
        category: "Arte",
        status: "Ativo",
        date: "2025-08-25", // dataInicio
        dataFim: "2025-08-30",
        horaInicio: "10:00",
        horaFim: "19:00",
        organizador: "Editora Livro Aberto",
        contatoOrganizador: "info@feiraliteraria.com",
        tipoIngresso: "gratuito",
        quantidadeIngressos: null,
        dataVendaInicio: null,
        dataVendaFim: null,
    },
    {
        id: 6,
        name: "Comic & Geek Fest",
        description: "Tudo sobre quadrinhos, filmes, séries e cultura geek em um só lugar.",
        longDescription: "O Comic & Geek Fest é o evento definitivo para fãs de cultura pop! Vista seu melhor cosplay, encontre seus artistas e dubladores favoritos, participe de concursos, painéis e workshops. Explore um mercado cheio de colecionáveis, quadrinhos raros e produtos exclusivos. Prepare-se para um dia épico de celebração nerd!",
        image: "https://www.oliberal.com/image/contentid/policy:1.602555:1666191450/1-308.jpg?f=2x1&$p$f=42d70cd&w=1500&$w=f075b93",
        category: "Entretenimento",
        status: "Encerrado",
        date: "2024-07-01", 
        dataFim: "2024-07-03",
        horaInicio: "12:00",
        horaFim: "21:00",
        organizador: "Geek Universe",
        contatoOrganizador: "contato@geekfest.com",
        tipoIngresso: "pago",
        quantidadeIngressos: 1000,
        dataVendaInicio: "2024-05-15",
        dataVendaFim: "2024-06-30",
    }
];

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState(initialFictitiousEvents);
    let nextId = Math.max(...initialFictitiousEvents.map(event => event.id)) + 1;

    // Função para adicionar um novo evento
    const addEvent = (newEvent) => {
        setEvents((prevEvents) => [{ id: nextId++, ...newEvent }, ...prevEvents]);
    };

    // Função para atualizar um evento existente
    const updateEvent = (updatedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    };

    // Função para deletar um evento
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
