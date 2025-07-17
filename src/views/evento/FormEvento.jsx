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

// Lista completa de stands disponíveis
const STANDS_DISPONIVEIS = [
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

export default function FormEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { authToken } = useContext(AuthContext);
  const { addEvent, updateEvent } = useEvents();

  // Estado principal unificado
  const [formData, setFormData] = useState({
    nomeEvento: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    horaInicio: "",
    horaFim: "",
    categoria: "",
    organizador: "",
    contatoOrganizador: "",
    urlImagem: "",
    tipoIngresso: "gratuito",
    quantidadeIngressos: "",
    dataVendaInicio: "",
    dataVendaFim: "",
    stands: [],
    standsInput: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState({ sucesso: false, erro: false });

  const isEditing = !!id && location.state?.event;

  // Carrega dados para edição
  useEffect(() => {
    if (!isEditing) {
      // Reset para novo evento
      setFormData({
        nomeEvento: "",
        descricao: "",
        dataInicio: "",
        dataFim: "",
        horaInicio: "",
        horaFim: "",
        categoria: "",
        organizador: "",
        contatoOrganizador: "",
        urlImagem: "",
        tipoIngresso: "gratuito",
        quantidadeIngressos: "",
        dataVendaInicio: "",
        dataVendaFim: "",
        stands: [],
        standsInput: "",
      });
      return;
    }

    const eventToEdit = location.state.event;

    const processarStands = (stands) => {
      // Verificação mais robusta
      if (typeof stands === 'string' && stands.trim() === '') return [];

      // Se for string (ex: "A1,B2"), converte para array
      if (typeof stands === "string") {
       return stands.split(',')
          .map((stand) => stand.trim().toUpperCase())
          .filter(
            (stand) => stand !== "" && STANDS_DISPONIVEIS.includes(stand)
          );
      }

     // Se já for array
    if (Array.isArray(stands)) {
        return stands
            .map(stand => {
                if (typeof stand === 'string') return stand.trim().toUpperCase();
                if (stand?.codigo) return stand.codigo.toString().trim().toUpperCase();
                return null;
            })
            .filter(stand => stand !== null && STANDS_DISPONIVEIS.includes(stand));
    }
    
    return [];
    };

    setFormData({
      nomeEvento: eventToEdit.nomeEvento || eventToEdit.name || "",
      descricao: eventToEdit.descricao || eventToEdit.description || "",
      dataInicio: formatDateForInput(
        eventToEdit.dataInicio || eventToEdit.date
      ),
      dataFim: formatDateForInput(eventToEdit.dataFim),
      horaInicio: eventToEdit.horaInicio || "",
      horaFim: eventToEdit.horaFim || "",
      categoria: eventToEdit.categoria || eventToEdit.category || "",
      organizador: eventToEdit.organizador || "",
      contatoOrganizador: eventToEdit.contatoOrganizador || "",
      urlImagem: eventToEdit.urlImagem || eventToEdit.image || "",
      tipoIngresso: eventToEdit.tipoIngresso || "gratuito",
      quantidadeIngressos: eventToEdit.quantidadeIngressos || "",
      dataVendaInicio: formatDateForInput(eventToEdit.dataVendaInicio),
      dataVendaFim: formatDateForInput(eventToEdit.dataVendaFim),
      stands: processarStands(eventToEdit.stands),
      standsInput: processarStands(eventToEdit.stands).join(", "),
    });
  }, [isEditing, id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStand = (stand) => {
    setFormData((prev) => ({
      ...prev,
      stands: prev.stands.includes(stand)
        ? prev.stands.filter((s) => s !== stand)
        : [...prev.stands, stand],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ sucesso: false, erro: false });

    try {
      const dadosParaEnviar = {
        ...formData,
        stands: formData.stands.filter((stand) =>
          STANDS_DISPONIVEIS.includes(stand)
        ), // Filtra apenas stands válidos
        quantidadeIngressos: formData.quantidadeIngressos
          ? parseInt(formData.quantidadeIngressos)
          : null,
      };

      console.log("DEBUG - Dados sendo enviados:", dadosParaEnviar); // Verifique no console

      if (isEditing) {
        await updateEvent(parseInt(id), dadosParaEnviar);
      } else {
        await addEvent(dadosParaEnviar);
      }

      setMensagem({ sucesso: true, erro: false });
      setTimeout(() => navigate("/homeGerenciador"), 1500);
    } catch (error) {
      console.error(
        "Erro ao salvar evento:",
        error.response?.data || error.message
      );
      setMensagem({ sucesso: false, erro: true });
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
            onSubmit={handleSubmit}
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
                  name="nomeEvento"
                  placeholder="Ex: Workshop de Tecnologia"
                  maxLength={150}
                  value={formData.nomeEvento}
                  onChange={handleChange}
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
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
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
                name="descricao"
                placeholder="Detalhes completos sobre o evento, programação, etc."
                rows={5}
                value={formData.descricao}
                onChange={handleChange}
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

            {/* Datas e Horários */}
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
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleChange}
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
                  name="dataFim"
                  value={formData.dataFim}
                  onChange={handleChange}
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
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
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
                  name="horaFim"
                  value={formData.horaFim}
                  onChange={handleChange}
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
                  name="organizador"
                  placeholder="Nome ou empresa organizadora"
                  value={formData.organizador}
                  onChange={handleChange}
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
                  Contato do Organizador <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="contatoOrganizador"
                  placeholder="email@exemplo.com ou (99) 99999-9999"
                  value={formData.contatoOrganizador}
                  onChange={handleChange}
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

            {/* URL da Imagem */}
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
                URL da Imagem/Banner
              </label>
              <input
                type="url"
                name="urlImagem"
                placeholder="Ex: http://exemplo.com/imagem-evento.jpg"
                value={formData.urlImagem}
                onChange={handleChange}
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
                onClick={() => setModalIsOpen(true)}
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
                {formData.stands.length > 0
                  ? `Stands selecionados: ${formData.stands.join(", ")}`
                  : "Clique para selecionar os stands"}
              </button>
            </div>

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
                  name="tipoIngresso"
                  value={formData.tipoIngresso}
                  onChange={handleChange}
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
                  <option value="pago">Pago</option>
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
                  name="quantidadeIngressos"
                  placeholder="Ex: 100"
                  value={formData.quantidadeIngressos}
                  onChange={handleChange}
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
                  name="dataVendaInicio"
                  value={formData.dataVendaInicio}
                  onChange={handleChange}
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
                  name="dataVendaFim"
                  value={formData.dataVendaFim}
                  onChange={handleChange}
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

            {/* Modal de Stands */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                content: {
                  position: "relative",
                  width: "700px",
                  height: "85%",
                  maxHeight: "700px",
                  margin: "auto",
                  borderRadius: "12px",
                  padding: "30px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  border: "none",
                  overflow: "hidden",
                  inset: "auto",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    flexShrink: 0,
                  }}
                >
                  <h3
                    style={{
                      color: "#222",
                      fontWeight: 600,
                      fontSize: "20px",
                      margin: 0,
                    }}
                  >
                    Selecionar Stands
                  </h3>
                  <button
                    onClick={() => setModalIsOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "22px",
                      cursor: "pointer",
                      color: "#666",
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </div>

                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "8px",
                    marginRight: "-8px",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "15px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid #e0e7ef",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <img
                      src="/MapaDoEvento.jpg"
                      alt="Mapa do Evento"
                      style={{
                        width: "36%",
                        display: "block",
                        margin: "0 auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: 450,
                        color: "#444",
                        fontSize: "14px",
                      }}
                    >
                      Digite os números dos stands (separados por vírgula):
                    </label>
                    <textarea
                      placeholder="Ex: A1, B2, C3"
                      value={formData.standsInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const processedStands = inputValue
                          .split(",")
                          .map((stand) => stand.trim().toUpperCase())
                          .filter((stand) => stand !== "");

                        setFormData((prev) => ({
                          ...prev,
                          standsInput: inputValue,
                          stands:
                            processedStands.length > 0 ? processedStands : [],
                        }));
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e0e7ef",
                        fontSize: "14px",
                        minHeight: "50px",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        color: "#444",
                        fontSize: "15px",
                      }}
                    >
                      Stands Selecionados ({formData.stands?.length || 0})
                    </h4>
                    {(formData.stands?.length || 0) > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          maxHeight: "120px",
                          overflowY: "auto",
                          padding: "8px",
                          background: "#f8f9fa",
                          borderRadius: "6px",
                        }}
                      >
                        {formData.stands.map((stand) => (
                          <div
                            key={stand}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              background: STANDS_DISPONIVEIS.includes(stand)
                                ? "#e6f4ff"
                                : "#ffebe9",
                              color: STANDS_DISPONIVEIS.includes(stand)
                                ? "#1677ff"
                                : "#cf1322",
                              border: `1px solid ${
                                STANDS_DISPONIVEIS.includes(stand)
                                  ? "#91caff"
                                  : "#ffa39e"
                              }`,
                              display: "flex",
                              alignItems: "center",
                              fontSize: "13px",
                            }}
                          >
                            {stand}
                            <button
                              onClick={() => toggleStand(stand)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "inherit",
                                cursor: "pointer",
                                marginLeft: "4px",
                                padding: "0 4px",
                                fontSize: "12px",
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "10px",
                          background: "#f8f9fa",
                          borderRadius: "6px",
                          color: "#8c8c8c",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        Nenhum stand selecionado
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid #f0f0f0",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => setModalIsOpen(false)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "1px solid #e0e7ef",
                      background: "#fff",
                      color: "#444",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const standsValidos = [
                        ...new Set( // Remove duplicatas
                          formData.standsInput
                            .split(",")
                            .map((stand) => stand.trim().toUpperCase())
                            .filter(
                              (stand) =>
                                stand !== "" &&
                                STANDS_DISPONIVEIS.includes(stand)
                            )
                        ),
                      ];

                      setFormData((prev) => ({
                        ...prev,
                        stands: standsValidos,
                        standsInput: standsValidos.join(", "),
                      }));

                      setModalIsOpen(false);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "1px solid #1677ff",
                      background: "#1677ff",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </Modal>

            {/* Mensagens de feedback */}
            {mensagem.sucesso && (
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

            {mensagem.erro && (
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
                {isEditing ? "atualizar" : "cadastrar"} o evento.
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
