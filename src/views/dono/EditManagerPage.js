import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputMask from "comigo-tech-react-input-mask"; 
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; 
import MenuSistema from '../../MenuSistema'; 
import { Footer } from '../home/Home'; 

const API_BASE_URL = 'http://localhost:8080';

export default function EditManagerPage() {
    const navigate = useNavigate();
    const { isAuthenticated, userEmail, authToken, isAuthReady, userName, logout } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        razaoSocial: '', 
        cpf: '' 
    });
    const [donoId, setDonoId] = useState(null); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const formatDateForInput = useCallback((dateParam) => {
        if (!dateParam) return '';
        if (Array.isArray(dateParam) && dateParam.length === 3) {
            const [year, month, day] = dateParam;
            const date = new Date(year, month - 1, day); 
            return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
        }

        if (typeof dateParam === 'string' && dateParam.includes('-') && dateParam.split('-').length === 3) {
            const parts = dateParam.split('-');
            const [year, month, day] = parts;
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
        }

        if (typeof dateParam === 'string' && dateParam.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            return dateParam;
        }

        return '';
    }, []);

    const fetchDonoProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!userEmail || !authToken) {
            console.warn("EditDonoProfilePage: Email ou token ausentes. Redirecionando para login.");
            setError("Dados de autenticação incompletos. Por favor, inicie sessão novamente.");
            setLoading(false);
            logout();
            navigate('/login');
            return;
        }

        try {

            const response = await axios.get(`${API_BASE_URL}/api/dono/by-email/${encodeURIComponent(userEmail)}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            const backendData = response.data;

            setDonoId(backendData.id); 

            setFormData({
                nome: backendData.nome || userName,
                dataNascimento: formatDateForInput(backendData.dataNascimento), 
                razaoSocial: backendData.razaoSocial || '', 
                cpf: backendData.cpf || '' 
            });
        } catch (err) {
            setError("Não foi possível carregar os dados do perfil do Dono. Verifique o console.");
            console.error("Erro ao buscar perfil do Dono:", err);
            if (err.response) {
                if (err.response.status === 403 || err.response.status === 401) {
                    setError("Sessão expirada ou acesso negado. Por favor, inicie sessão novamente.");
                    logout();
                    navigate('/login');
                } else {
                    setError(`Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido.'}`);
                }
            } else if (err.request) {
                setError("Sem resposta do servidor. O backend está offline ou problema de CORS.");
            }
        } finally {
            setLoading(false);
        }
    }, [userEmail, authToken, userName, logout, navigate, formatDateForInput]);

    useEffect(() => {
        if (isAuthReady && isAuthenticated) {
            fetchDonoProfile();
        } else if (isAuthReady && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthReady, isAuthenticated, navigate, fetchDonoProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!donoId) { 
            setError("ID do Dono não disponível. Tente carregar o perfil novamente.");
            setLoading(false);
            return;
        }

        const dateToSend = formData.dataNascimento;

        const updateRequest = {
            nome: formData.nome,
            dataNascimento: dateToSend, 
            razaoSocial: formData.razaoSocial, 
            cpf: formData.cpf 
           
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/api/dono/${donoId}`, updateRequest, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            console.log("Perfil do Dono atualizado com sucesso:", response.data);
            setSuccessMessage("Perfil do Dono atualizado com sucesso!");
            setLoading(false);
            setTimeout(() => navigate('/profileManager'), 1500); 
        } catch (err) {
            setError("Erro ao atualizar o perfil do Dono. Verifique o console para mais detalhes.");
            console.error("Erro ao atualizar perfil do Dono:", err);
            if (err.response) {
                console.error("Resposta de erro do servidor (status " + err.response.status + "):", err.response.data);
                if (err.response.status === 403 || err.response.status === 401) {
                    setError("Sessão expirada ou acesso negado. Por favor, inicie sessão novamente.");
                    logout();
                    navigate('/login');
                } else if (err.response.data && err.response.data.message) {
                    setError("Erro do backend: " + err.response.data.message);
                }
            } else if (err.request) {
                setError("Sem resposta do servidor. O backend está offline ou problema de CORS.");
            }
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profileManager'); 
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em' }}>
                A carregar dados para edição...
            </div>
        );
    }

    if (error && !successMessage) {
        return (
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <motion.button onClick={fetchDonoProfile} 
                    whileHover={{ scale: 1.05, backgroundColor: '#3b82f6' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        padding: '0.8em 2em',
                        fontSize: '1em',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: 30,
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}>
                    Tentar Carregar Novamente
                </motion.button>
                <motion.button onClick={handleCancel}
                    whileHover={{ scale: 1.05, backgroundColor: '#dc3545' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        padding: '0.8em 2em',
                        fontSize: '1em',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: 30,
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}>
                    Voltar para o Perfil
                </motion.button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <MenuSistema tela={"edit-dono-profile"} /> 
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e293b, #0a192f)',
                        borderRadius: 20,
                        padding: '40px',
                        maxWidth: '700px',
                        width: '100%',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        textAlign: 'center'
                    }}
                >
                    <h2 style={{ fontSize: '2.8em', fontWeight: '700', color: '#fff', marginBottom: '30px' }}>
                        Editar Perfil do Gerenciador
                    </h2>

                    {successMessage && (
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
                            {successMessage}
                        </motion.div>
                    )}
                    {error && !successMessage && (
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
                            {error}
                        </motion.div>
                    )}

                    {/* Nome */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '1.1em' }}>Nome:</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    backgroundColor: '#1e293b',
                                    color: '#fff',
                                    fontSize: '1em',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Razão Social */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '1.1em' }}>Razão Social:</label>
                            <input
                                type="text"
                                name="razaoSocial"
                                value={formData.razaoSocial}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    backgroundColor: '#1e293b',
                                    color: '#fff',
                                    fontSize: '1em',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* CPF */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '1.1em' }}>CPF:</label>
                            <InputMask
                                mask="999.999.999-99"
                                maskChar={null}
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    backgroundColor: '#1e293b',
                                    color: '#fff',
                                    fontSize: '1em',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '1.1em' }}>Data de Nascimento (DD/MM/AAAA):</label>
                            <InputMask
                                mask="99/99/9999"
                                maskChar={null}
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    backgroundColor: '#1e293b',
                                    color: '#fff',
                                    fontSize: '1em',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05, backgroundColor: '#ef4444' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    backgroundColor: '#dc2626',
                                    color: '#fff',
                                    padding: '0.8em 2em',
                                    fontSize: '1em',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: 30,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px #dc262655',
                                    transition: 'background 0.2s',
                                    outline: 'none'
                                }}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, backgroundColor: '#3b82f6' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: '#fff',
                                    padding: '0.8em 2em',
                                    fontSize: '1em',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: 30,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px #2563eb55',
                                    transition: 'background 0.2s',
                                    outline: 'none'
                                }}
                            >
                                Salvar Alterações
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
