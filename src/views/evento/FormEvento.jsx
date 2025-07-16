import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";
import { useEvents, formatDateForInput } from "../../contexts/EventContext";
import { AuthContext } from "../../AuthContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function FormEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { addEvent, updateEvent } = useEvents();
  const { authToken } = useContext(AuthContext);

  const [nomeEvento, setNomeEvento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [categoria, setCategoria] = useState("");
  const [organizador, setOrganizador] = useState("");
  const [contatoOrganizador, setContatoOrganizador] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [tipoIngresso, setTipoIngresso] = useState("gratuito");
  const [quantidadeIngressos, setQuantidadeIngressos] = useState("");
  const [dataVendaInicio, setDataVendaInicio] = useState("");
  const [dataVendaFim, setDataVendaFim] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);

  // Estados para o modal de stands
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [standsSelecionados, setStandsSelecionados] = useState([]);
  const standsDisponiveis = [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
    "D1",
    "D2",
    "E1",
    "E2",
    "F1",
    "F2",
    "G1",
    "G2",
    "G3",
    "H1",
    "H2",
    "H3",
    "I1",
    "I2",
    "I3",
  ];

  const isEditing = id !== undefined && location.state && location.state.event;

  useEffect(() => {
    if (isEditing) {
      const eventToEdit = location.state.event;

      // Convert stands to the correct format if they are just strings
      const standsFormatados = eventToEdit.stands
        ? eventToEdit.stands.map((stand) =>
            typeof stand === "string"
              ? {
                  codigo: stand,
                  nome: `Stand ${stand}`,
                  descricao: `Descrição do Stand ${stand}`,
                  dimensoes: "3x3m",
                  preco: 1000.0,
                }
              : stand
          )
        : [];

      setStandsSelecionados(standsFormatados);
      setNomeEvento(eventToEdit.name || "");
      setDescricao(eventToEdit.description || "");
      setDataInicio(formatDateForInput(eventToEdit.date));
      setDataFim(formatDateForInput(eventToEdit.dataFim));
      setHoraInicio(eventToEdit.horaInicio || "");
      setHoraFim(eventToEdit.horaFim || "");
      setCategoria(eventToEdit.category || "");
      setOrganizador(eventToEdit.organizador || "");
      setContatoOrganizador(eventToEdit.contatoOrganizador || "");
      setUrlImagem(eventToEdit.image || "");
      setTipoIngresso(eventToEdit.tipoIngresso || "gratuito");
      setQuantidadeIngressos(eventToEdit.quantidadeIngressos || "");
      setDataVendaInicio(formatDateForInput(eventToEdit.dataVendaInicio));
      setDataVendaFim(formatDateForInput(eventToEdit.dataVendaFim));
    } else {
      // Reset all fields for new event
      setNomeEvento("");
      setDescricao("");
      setDataInicio("");
      setDataFim("");
      setHoraInicio("");
      setHoraFim("");
      setCategoria("");
      setOrganizador("");
      setContatoOrganizador("");
      setUrlImagem("");
      setTipoIngresso("gratuito");
      setQuantidadeIngressos("");
      setDataVendaInicio("");
      setDataVendaFim("");
      setStandsSelecionados([]);
    }
  }, [isEditing, id, location.state]);

  const toggleStand = (standCodigo) => {
    const standCompleto = {
      codigo: standCodigo,
      nome: `Stand ${standCodigo}`,
      descricao: `Descrição do Stand ${standCodigo}`,
      dimensoes: "3x3m",
      preco: 1000.0,
    };

    if (standsSelecionados.some((s) => s.codigo === standCodigo)) {
      setStandsSelecionados(
        standsSelecionados.filter((s) => s.codigo !== standCodigo)
      );
    } else {
      setStandsSelecionados([...standsSelecionados, standCompleto]);
    }
  };

  const abrirModalStands = () => {
    setModalIsOpen(true);
  };

  const fecharModalStands = () => {
    setModalIsOpen(false);
  };

  const salvar = async () => {
    setMensagemSucesso(false);
    setMensagemErro(false);

    if (!authToken) {
      console.error(
        "Erro: Token de autenticação não encontrado. Por favor, faça login."
      );
      setMensagemErro(true);
      return;
    }

    const standsIds = standsSelecionados.map((stand) => stand.id);

    let eventoBackendRequest = {
      nomeEvento: nomeEvento,
      descricao: descricao,
      dataInicio: dataInicio,
      dataFim: dataFim,
      horaInicio: horaInicio,
      horaFim: horaFim,
      categoria: categoria,
      organizador: organizador,
      contatoOrganizador: contatoOrganizador,
      urlImagem: urlImagem,
      tipoIngresso: tipoIngresso,
      quantidadeIngressos: quantidadeIngressos
        ? parseInt(quantidadeIngressos)
        : null,
      dataVendaInicio: dataVendaInicio,
      dataVendaFim: dataVendaFim,
      standsIds: standsIds
    };

    try {
      if (isEditing) {
        await updateEvent(parseInt(id), eventoBackendRequest);
      } else {
        await addEvent(eventoBackendRequest);
      }

      console.log("Operação no backend bem-sucedida!");
      setMensagemSucesso(true);

      setTimeout(() => {
        navigate("/homeGerenciador");
      }, 1500);
    } catch (error) {
      console.error("Erro ao processar Evento:", error);
      setMensagemErro(true);
      if (error.response) {
        console.error("Dados do erro:", error.response.data);
        console.error("Status do erro:", error.response.status);
      }
    }
  };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "80vh" }}>
      <MenuSistema tela={"form-evento"} />
      <div style={{ marginTop: "3%" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #e0e7ef",
            padding: 48,
          }}
        >
          <h2
            style={{
              color: "#222",
              marginBottom: 16,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 0.5,
            }}
          >
            <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
              Evento &nbsp;
              <span style={{ fontSize: 18, verticalAlign: "middle" }}>
                &raquo;
              </span>
            </span>
            &nbsp;{isEditing ? "Edição" : "Cadastro"}
          </h2>
          <hr
            style={{
              margin: "20px 0 28px 0",
              border: 0,
              borderTop: "1.5px solid #f0f0f0",
            }}
          />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: 12 }}
            onSubmit={(e) => {
              e.preventDefault();
              salvar();
            }}
          >
            {/* Nome do Evento e Categoria */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 2, minWidth: "min(100%, 220px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Nome do Evento <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Workshop de Tecnologia"
                  maxLength={150}
                  value={nomeEvento}
                  onChange={(e) => setNomeEvento(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 150px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Categoria <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Arte">Arte</option>
                  <option value="Entretenimento">Entretenimento</option>
                  <option value="Conferencia">Conferência</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Show">Show</option>
                  <option value="Feira">Feira</option>
                  <option value="Esportivo">Esportivo</option>
                  <option value="Educacional">Educacional</option>
                  <option value="Gastronomico">Gastronômico</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  color: "#444",
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                Descrição
              </label>
              <textarea
                placeholder="Detalhes completos sobre o evento, programação, etc."
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #e0e7ef",
                  fontSize: 15,
                  background: "#fafbfc",
                  outline: "none",
                  resize: "vertical",
                  transition: "border 0.2s",
                }}
              />
            </div>

            {/* Datas e Horários do Evento */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "min(100%, 120px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Data Início <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 120px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 100px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Hora Início <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 100px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Hora Fim
                </label>
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Organizador e Contato */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "min(100%, 200px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Organizador <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nome ou empresa organizadora"
                  value={organizador}
                  onChange={(e) => setOrganizador(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 200px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Contato do Organizador (E-mail/Telefone){" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="email@exemplo.com ou (99) 99999-9999"
                  value={contatoOrganizador}
                  onChange={(e) => setContatoOrganizador(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
            </div>

            {/* URL da Imagem/Banner */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  color: "#444",
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                URL da Imagem/Banner do Evento
              </label>
              <input
                type="url"
                placeholder="Ex: http://exemplo.com/imagem-evento.jpg"
                value={urlImagem}
                onChange={(e) => setUrlImagem(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #e0e7ef",
                  fontSize: 15,
                  background: "#fafbfc",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />
            </div>

            {/* Seção de Stands */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                  color: "#444",
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                Stands do Evento
              </label>
              <button
                type="button"
                onClick={abrirModalStands}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #e0e7ef",
                  fontSize: 15,
                  background: "#fafbfc",
                  outline: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {standsSelecionados.length > 0
                  ? `Stands selecionados: ${standsSelecionados
                      .map((s) => s.codigo)
                      .join(", ")}`
                  : "Clique para selecionar os stands"}
              </button>
            </div>

            <br />

            {/* Seção de Ingressos */}
            <hr
              style={{
                margin: "20px 0 28px 0",
                border: 0,
                borderTop: "1.5px solid #f0f0f0",
              }}
            />
            <h3
              style={{
                color: "#222",
                marginBottom: 16,
                fontWeight: 600,
                fontSize: 22,
              }}
            >
              Informações de Ingressos
            </h3>

            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "min(100%, 150px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Tipo de Ingresso <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  required
                  value={tipoIngresso}
                  onChange={(e) => setTipoIngresso(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                >
                  <option value="gratuito">Gratuito</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 150px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Quantidade de Ingressos
                </label>
                <input
                  type="number"
                  placeholder="Ex: 100"
                  value={quantidadeIngressos}
                  onChange={(e) => setQuantidadeIngressos(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                  min="0"
                />
              </div>
            </div>

            {/* Período de Vendas */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "min(100%, 150px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Início das Vendas
                </label>
                <input
                  type="date"
                  value={dataVendaInicio}
                  onChange={(e) => setDataVendaInicio(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: "min(100%, 150px)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                    color: "#444",
                    fontSize: 15,
                    textAlign: "left",
                  }}
                >
                  Fim das Vendas
                </label>
                <input
                  type="date"
                  value={dataVendaFim}
                  onChange={(e) => setDataVendaFim(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 15,
                    background: "#fafbfc",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Modal de seleção de stands */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={fecharModalStands}
              contentLabel="Seleção de Stands"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                },
                content: {
                  maxWidth: "800px",
                  margin: "auto",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{ color: "#222", fontWeight: 700, fontSize: "24px" }}
                >
                  Selecione os Stands
                </h2>
                <button
                  onClick={fecharModalStands}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <img
                    src="/MapaDoEvento.jpg"
                    alt="Mapa do Evento"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #e0e7ef",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "16px", color: "#444" }}>
                    Stands Disponíveis
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {standsDisponiveis.map((stand) => (
                      <button
                        key={stand}
                        type="button"
                        onClick={() => toggleStand(stand)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: `1.5px solid ${
                            standsSelecionados.some((s) => s.codigo === stand)
                              ? "#1677ff"
                              : "#e0e7ef"
                          }`,
                          background: standsSelecionados.some(
                            (s) => s.codigo === stand
                          )
                            ? "#e6f4ff"
                            : "#fff",
                          color: standsSelecionados.some(
                            (s) => s.codigo === stand
                          )
                            ? "#1677ff"
                            : "#444",
                          cursor: "pointer",
                          fontWeight: standsSelecionados.some(
                            (s) => s.codigo === stand
                          )
                            ? "600"
                            : "400",
                          transition: "all 0.2s",
                        }}
                      >
                        {stand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  onClick={fecharModalStands}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "24px",
                    border: "1.5px solid #e0e7ef",
                    background: "#fff",
                    color: "#444",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={fecharModalStands}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "24px",
                    border: "1.5px solid #1677ff",
                    background: "#1677ff",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Confirmar
                </button>
              </div>
            </Modal>

            {/* Mensagens de feedback */}
            {mensagemSucesso && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "#e6ffed",
                  color: "#256029",
                  border: "1.5px solid #b7eb8f",
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 18,
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                <strong>Sucesso!</strong> Evento{" "}
                {isEditing ? "atualizado" : "cadastrado"} com sucesso.
              </motion.div>
            )}
            {mensagemErro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "#fff1f0",
                  color: "#a8071a",
                  border: "1.5px solid #ffa39e",
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 18,
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                <strong>Erro!</strong> Ocorreu um erro ao tentar{" "}
                {isEditing ? "atualizar" : "cadastrar"} o evento. Por favor,
                tente novamente.
              </motion.div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 30,
              }}
            >
              <Link to="/homeGerenciador">
                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 24,
                    border: "1.5px solid #e0e7ef",
                    background: "#fff",
                    color: "#444",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  Cancelar
                </button>
              </Link>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  borderRadius: 24,
                  border: "1.5px solid #1677ff",
                  background: "#1677ff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                Salvar Evento
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
