import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";
import { useEvents } from '../../contexts/EventContext';
import { AuthContext } from '../../AuthContext'; 

export default function FormEvento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { addEvent, updateEvent } = useEvents();
    const { authToken } = useContext(AuthContext);

    // Estados locais para os campos do formulário
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

    // Determina se o formulário está no modo de edição
    const isEditing = id !== undefined && location.state?.event;

    // Efeito para preencher o formulário quando em modo de edição
    useEffect(() => {
        if (isEditing) {
            const eventToEdit = location.state.event;
            setNomeEvento(eventToEdit.name || "");
            setDescricao(eventToEdit.description || "");
            setDataInicio(eventToEdit.date || "");
            setDataFim(eventToEdit.dataFim || "");
            setHoraInicio(eventToEdit.horaInicio || "");
            setHoraFim(eventToEdit.horaFim || "");
            setCategoria(eventToEdit.category || "");
            setOrganizador(eventToEdit.organizador || "");
            setContatoOrganizador(eventToEdit.contatoOrganizador || "");
            setUrlImagem(eventToEdit.image || "");            
            setTipoIngresso(eventToEdit.tipoIngresso || "gratuito");
            setQuantidadeIngressos(eventToEdit.quantidadeIngressos || "");
            setDataVendaInicio(eventToEdit.dataVendaInicio || "");
            setDataVendaFim(eventToEdit.dataVendaFim || "");
        } else {
            // Limpa o formulário para nova criação
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
        }
    }, [isEditing, id, location.state]);

    const salvar = async () => {
        setMensagemSucesso(false);
        setMensagemErro(false);

        if (!authToken) {
            console.error("Erro: Token de autenticação não encontrado. Por favor, faça login.");
            setMensagemErro(true);
            return;
        }

        const config = {
            headers: {
                
                'Authorization': `Bearer ${authToken}`
            }
        };

        // Prepara os dados para o backend
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
            quantidadeIngressos: parseInt(quantidadeIngressos) || null,
            dataVendaInicio: dataVendaInicio,
            dataVendaFim: dataVendaFim,
        };

        try {
            let response;
            if (isEditing) {
                // Requisição PUT para atualização, incluindo o token nos headers
                response = await axios.put(`http://localhost:8080/api/evento/${id}`, eventoBackendRequest, config);
            } else {
                // Requisição POST para criação, incluindo o token nos headers
                response = await axios.post("http://localhost:8080/api/evento", eventoBackendRequest, config);
            }

            console.log("Operação no backend bem-sucedida:", response.data);
            setMensagemSucesso(true);

            const eventForContext = {
                id: isEditing ? parseInt(id) : response.data.id || Math.floor(Math.random() * 100000) + 100,
                name: nomeEvento,
                description: descricao,
                longDescription: descricao,
                image: urlImagem,
                category: categoria,
                status: 'Ativo', 
                date: dataInicio,
            };

            if (isEditing) {
                updateEvent(eventForContext);
            } else {
                addEvent(eventForContext);
            }

            // Limpa o formulário apenas se for uma nova criação
            if (!isEditing) {
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
            }

            navigate('/homeGerenciador');

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
        <div style={{ background: '#f5f7fa', minHeight: '80vh' }}>
            <MenuSistema tela={"form-evento"} />
            <div style={{ marginTop: "3%" }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #e0e7ef", padding: 48 }}
                >
                    <h2 style={{ color: "#222", marginBottom: 16, fontWeight: 700, fontSize: 28, letterSpacing: 0.5 }}>
                        <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
                            Evento &nbsp;
                            <span style={{ fontSize: 18, verticalAlign: "middle" }}>&raquo;</span>
                        </span>
                        &nbsp;{isEditing ? 'Edição' : 'Cadastro'}
                    </h2>
                    <hr style={{ margin: "20px 0 28px 0", border: 0, borderTop: "1.5px solid #f0f0f0" }} />
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginTop: 12 }}
                        onSubmit={e => { e.preventDefault(); salvar(); }}
                    >
                        {/* Nome do Evento e Categoria */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                            <div style={{ flex: 2, minWidth: 'min(100%, 220px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Nome do Evento <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ex: Workshop de Tecnologia"
                                    maxLength={150}
                                    value={nomeEvento}
                                    onChange={e => setNomeEvento(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 150px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Categoria <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    required
                                    value={categoria}
                                    onChange={e => setCategoria(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
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
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Descrição</label>
                            <textarea
                                placeholder="Detalhes completos sobre o evento, programação, etc."
                                rows={5}
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', resize: 'vertical', transition: 'border 0.2s' }}
                            />
                        </div>

                        {/* Datas e Horários do Evento */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 'min(100%, 120px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Data Início <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    required
                                    type="date"
                                    value={dataInicio}
                                    onChange={e => setDataInicio(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 120px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Data Fim</label>
                                <input
                                    type="date"
                                    value={dataFim}
                                    onChange={e => setDataFim(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 100px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Hora Início <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    required
                                    type="time"
                                    value={horaInicio}
                                    onChange={e => setHoraInicio(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 100px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Hora Fim</label>
                                <input
                                    type="time"
                                    value={horaFim}
                                    onChange={e => setHoraFim(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                        </div>

                        {/* Organizador e Contato */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Organizador <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Nome ou empresa organizadora"
                                    value={organizador}
                                    onChange={e => setOrganizador(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Contato do Organizador (E-mail/Telefone) <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="email@exemplo.com ou (99) 99999-9999"
                                    value={contatoOrganizador}
                                    onChange={e => setContatoOrganizador(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                        </div>

                        {/* URL da Imagem/Banner */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>URL da Imagem/Banner do Evento</label>
                            <input
                                type="url"
                                placeholder="Ex: http://exemplo.com/imagem-evento.jpg"
                                value={urlImagem}
                                onChange={e => setUrlImagem(e.target.value)}
                                style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                            />
                        </div>

                        <br />

                        {/* Seção de Ingressos */}
                        <hr style={{ margin: "20px 0 28px 0", border: 0, borderTop: "1.5px solid #f0f0f0" }} />
                        <h3 style={{ color: "#222", marginBottom: 16, fontWeight: 600, fontSize: 22 }}>Informações de Ingressos</h3>

                        <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 'min(100%, 150px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Tipo de Ingresso <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    required
                                    value={tipoIngresso}
                                    onChange={e => setTipoIngresso(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                >
                                    <option value="gratuito">Gratuito</option>
                                  
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 150px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Quantidade de Ingressos</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 100"
                                    value={quantidadeIngressos}
                                    onChange={e => setQuantidadeIngressos(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Período de Vendas */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 'min(100%, 150px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Início das Vendas</label>
                                <input
                                    type="date"
                                    value={dataVendaInicio}
                                    onChange={e => setDataVendaInicio(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 'min(100%, 150px)' }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Fim das Vendas</label>
                                <input
                                    type="date"
                                    value={dataVendaFim}
                                    onChange={e => setDataVendaFim(e.target.value)}
                                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                                />
                            </div>
                        </div>

                        {/* Mensagens de feedback */}
                        {mensagemSucesso && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ background: "#e6ffed", color: "#256029", border: "1.5px solid #b7eb8f", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
                            >
                                <strong>Cadastro Realizado!</strong> Evento cadastrado com sucesso.
                            </motion.div>
                        )}
                        {mensagemErro && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ background: "#fff1f0", color: "#a8071a", border: "1.5px solid #ffa39e", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
                            >
                                <strong>Erro no Cadastro:</strong> Ocorreu um erro ao tentar cadastrar o evento. Verifique se você está logado.
                            </motion.div>
                        )}

                        {/* Botões de Ação */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, gap: 16 }}>
                            <Link to={"/homeGerenciador"} style={{ textDecoration: 'none' }}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1, backgroundColor: '#ffd591' }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ background: "#fff7e6", color: "#d46b08", border: "1.5px solid #ffd591", borderRadius: 24, padding: "10px 32px", cursor: "pointer", fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #f5e6d6', transition: 'background 0.2s' }}
                                >
                                    Voltar
                                </motion.button>
                            </Link>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1, backgroundColor: '#91caff' }}
                                whileTap={{ scale: 0.95 }}
                                style={{ background: "#e6f4ff", color: "#1677ff", border: "1.5px solid #91caff", borderRadius: 24, padding: "10px 32px", cursor: "pointer", fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #d6eaff', transition: 'background 0.2s' }}
                            >
                                {isEditing ? 'Atualizar Evento' : 'Salvar Evento'}
                            </motion.button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>

            <br /> <br />
            <Footer />
        </div>
    );
}
