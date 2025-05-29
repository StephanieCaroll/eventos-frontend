import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";

export default function LoginCliente() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro("");
        try {
            const response = await fetch("http://localhost:8080/api/cliente/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });
            if (response.ok) {
                navigate("/");
            } else {
                setErro("E-mail ou senha inválidos.");
            }
        } catch (err) {
            setErro("Erro ao conectar com o servidor.");
        }
    }

    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
            <MenuSistema tela={"cliente-login"} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: 370, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e7ef', padding: 40, textAlign: 'center' }}
                >
                    <h2 style={{ color: '#1677ff', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Login do Cliente</h2>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: 18, textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15 }}>E-mail</label>
                            <input
                                type="email"
                                required
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e0e7ef', fontSize: 15, background: '#fafbfc', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: 18, textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15 }}>Senha</label>
                            <input
                                type="password"
                                required
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e0e7ef', fontSize: 15, background: '#fafbfc', outline: 'none' }}
                            />
                        </div>
                        {erro && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#a8071a', marginBottom: 14, fontWeight: 500, fontSize: 15 }}>
                                {erro}
                            </motion.div>
                        )}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                            <Link to="/" style={{ textDecoration: 'none', flex: 1 }}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05, backgroundColor: '#ffd591' }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ flex: 1, width: '100%', background: "#fff7e6", color: "#d46b08", border: "1.5px solid #ffd591", borderRadius: 24, padding: "10px 0", cursor: "pointer", fontWeight: 600, fontSize: 17, boxShadow: '0 1px 4px #f5e6d6', transition: 'background 0.2s' }}
                                >
                                    Voltar
                                </motion.button>
                            </Link>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05, backgroundColor: '#91caff' }}
                                whileTap={{ scale: 0.95 }}
                                style={{ flex: 1, width: '100%', background: '#e6f4ff', color: '#1677ff', border: '1.5px solid #91caff', borderRadius: 24, padding: '10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 17, boxShadow: '0 1px 4px #d6eaff', transition: 'background 0.2s' }}
                            >
                                Entrar
                            </motion.button>
                        </div>
                    </form>
                    <div style={{ marginTop: 18, fontSize: 15, color: '#444' }}>
                        Não tem conta?
                        <Link to="/cliente/form" style={{ color: '#1677ff', fontWeight: 600, marginLeft: 6, textDecoration: 'none' }}>
                            Cadastre-se
                        </Link>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div >
    );
}
