import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Star, Briefcase, Settings, LogOut, PlusCircle, CalendarCheck, Phone, ChevronLeft } from 'lucide-react'; 
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const API_BASE_URL = 'http://localhost:8080'; 

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

export default function UserProfilePage() {
    const navigate = useNavigate();
    const { isAuthenticated, userName, userEmail, userRoles, logout, authToken, isAuthReady } = useContext(AuthContext);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const firstName = userName ? userName.split(' ')[0] : 'Utilizador';

    const formatDate = (dateParam) => {
        if (!dateParam) return 'Não informado';

        if (Array.isArray(dateParam) && dateParam.length === 3) {
            const [year, month, day] = dateParam;
            const date = new Date(year, month - 1, day); 
            return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
        }

        if (typeof dateParam === 'string' && dateParam.includes('/')) {
            const parts = dateParam.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
            }
        }

        if (typeof dateParam === 'string' && dateParam.includes('-')) {
            const parts = dateParam.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts;
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
            }
        }

        return 'Data inválida';
    };


    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!userEmail || !authToken) {
            console.warn("Email do utilizador ou token de autenticação não disponíveis. Não é possível buscar o perfil.");
            setError("Dados de autenticação incompletos. Por favor, tente iniciar sessão novamente.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes/by-email/${encodeURIComponent(userEmail)}`, {
         
            });

            const backendData = response.data;

            setProfileData({

                name: backendData.nome || userName,
                email: backendData.usuario?.username || userEmail,
                phone: backendData.foneCelular || 'Não informado', 
                memberSince: formatDate(backendData.dataNascimento), 
                role: (Array.isArray(userRoles) && userRoles.length > 0) ? userRoles.join(', ') : 'Expositor',
                favoritedEvents: [], 
                myStands: [] 
            });

        } catch (err) {
            setError("Não foi possível carregar os dados do perfil do backend. Verifique o console para mais detalhes.");
            console.error("Erro ao buscar perfil do utilizador do backend.");

            if (err.response) {
              
                console.error("Resposta de erro do servidor (status " + err.response.status + "):", err.response.data);
                if (err.response.data && typeof err.response.data === 'string' && err.response.data.includes("No static resource")) {
                    console.error("POSSÍVEL CAUSA: O backend não tem um endpoint GET mapeado para '/api/clientes/by-email/{email}'. Verifique o @RequestMapping e @GetMapping no ClienteController.java.");
                } else if (err.response.data && typeof err.response.data === 'string' && err.response.data.includes("rawPassword cannot be null")) {
                    console.error("ERRO: Senha nula no backend. Verifique se o campo 'password' no seu ClienteRequest.java e UsuarioRequest.java (se existir) está correto, e se o método build() está a passar a senha para o Usuario.");
                } else if (err.response.data && err.response.data.message) {
                    console.error("Mensagem de erro do backend:", err.response.data.message);
                } else {
                    console.error("Resposta de erro inesperada do backend:", err.response.data);
                }
            } else if (err.request) {
                console.error("Nenhuma resposta do servidor. Verifique se o backend está rodando e se há problemas de CORS. Detalhes:", err.request);
            } else {
                console.error("Erro na configuração da requisição:", err.message);
            }
            console.error("Objeto erro completo:", err);

            setProfileData({ 
                name: userName || 'Utilizador',
                email: userEmail || 'Não informado',
                phone: "Não informado",
                memberSince: "Não informado",
                role: (Array.isArray(userRoles) && userRoles.length > 0) ? userRoles.join(', ') : "Utilizador",
                favoritedEvents: [],
                myStands: []
            });
        } finally {
            setLoading(false);
        }
    }, [userEmail, authToken, userName, userRoles]);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Busca o perfil apenas se estiver autenticado e ainda não houver dados de perfil
        if (isAuthenticated && userEmail && authToken && profileData === null) {
            fetchUserProfile();
        } else if (isAuthenticated && (!userEmail || !authToken)) {
            // Se autenticado, mas sem email/token (estado inconsistente), faz logout
            logout();
        }
    }, [isAuthenticated, navigate, userEmail, authToken, isAuthReady, logout, fetchUserProfile, profileData]);


    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em' }}>
                A carregar perfil...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em', padding: '20px', textAlign: 'center' }}>
                <p className="text-danger">{error}</p>
                <button onClick={fetchUserProfile} style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    padding: '0.8em 2em',
                    fontSize: '1em',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: 30,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px #2563eb55',
                    marginTop: '20px'
                }}>Tentar Novamente</button>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em' }}>
                Nenhuns dados de perfil disponíveis.
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/homeExpositor')}>
                    
                    <h1 style={{ fontSize: '2.5em', fontWeight: '800', letterSpacing: '1px', color: '#3b82f6', margin: 0 }}
                    onClick={() => navigate('/homeExpositor')}
                    >
                        Events Stands
                    </h1>
                </div>

                <div className="d-flex align-items-center gap-3 ms-auto">
                    {isAuthenticated && userName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
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
                                    alt="Avatar do Utilizador"
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
                            whileHover={{ scale: 1.05, backgroundColor: '#3b82f6' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                backgroundColor: '#2563eb', 
                                color: '#fff',
                                padding: '0.6em 1.5em',
                                fontSize: '0.9em',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: 32,
                                cursor: 'pointer',
                                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.2)', 
                                transition: 'background 0.2s',
                                outline: 'none',
                                display: 'inline-flex', 
                                alignItems: 'center',
                                gap: '8px' 
                            }}
                            onClick={() => navigate('/homeExpositor')}
                        >
                            <ChevronLeft size={20} /> Retornar 
                        </motion.button>
                    )}
                </div>
            </section>

            <main style={{ flex: 1, padding: '4em 2em', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '5px', fontSize: '2.8em', fontWeight: '700', textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                    Meu Perfil
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e293b, #0a192f)',
                        borderRadius: 20,
                        padding: '40px',
                        marginBottom: '3em',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '5px solid #2563eb',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={`https://placehold.co/120x120/3b82f6/ffffff?text=${firstName.charAt(0).toUpperCase()}`}
                            alt="Avatar do Utilizador"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.target.src = `https://placehold.co/120x120/3b82f6/ffffff?text=${firstName.charAt(0).toUpperCase()}`}
                        />
                    </div>
                    <h3 style={{ fontSize: '2.5em', marginBottom: '10px', color: '#fff', fontWeight: '700' }}>{profileData.name}</h3>
                    <p style={{ fontSize: '1.2em', color: '#cbd5e1', marginBottom: '15px' }}>{profileData.role}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', width: '100%', maxWidth: '500px', textAlign: 'left' }}>
                        <p><strong style={{ color: '#3b82f6' }}><User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />E-mail:</strong> {profileData.email}</p>
                        <p><strong style={{ color: '#3b82f6' }}><Phone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Telefone:</strong> {profileData.phone || 'Não informado'}</p>
                        <p><strong style={{ color: '#3b82f6' }}><CalendarCheck size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Data de Aniversário:</strong> {profileData.memberSince || 'Não informado'}</p>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                        <motion.button
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
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onClick={() => navigate('/edit-profile')}
                        >
                            <Settings size={20} /> Editar Perfil
                        </motion.button>
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
                                display: 'inline-block'
                            }}
                            onClick={handleLogout}
                        >
                            Sair <span style={{ marginLeft: 8, fontSize: 18 }}>→</span>
                        </motion.button>
                    </div>
                </motion.div>

                <h3 style={{ fontSize: '2em', fontWeight: '600', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginBottom: '2em' }}>
                    <Star size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Meus Eventos Favoritos
                </h3>
                
                <p style={{ fontSize: '1.1em', color: '#cbd5e1', textAlign: 'center', marginBottom: '20px' }}>Você ainda não favoritou nenhum evento.</p>
                <div style={{ textAlign: 'center' }}>
                    <motion.button
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
                            outline: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onClick={() => navigate('/homeExpositor')}
                    >
                        Veja alguns eventos
                    </motion.button>
                </div>
                
                    <>
                        <h3 style={{ fontSize: '2em', fontWeight: '600', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginTop: '3em', marginBottom: '2em' }}>
                            <Briefcase size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Meus Stands
                        </h3>
                        
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.1em', color: '#cbd5e1', marginBottom: '20px' }}>Você ainda não possui nenhum stand registrado.</p>
                            <motion.button
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
                                    outline: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onClick={() => navigate('/homeExpositor')}
                            >
                                <PlusCircle size={20} /> Criar Novo Stand
                            </motion.button>
                        </div>
                    </>

            </main>
            <Footer />
        </div>
    );
}