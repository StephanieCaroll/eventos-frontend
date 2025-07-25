
import axios from 'axios';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import PopupCadastro from '../../componentes/PopupCadastro';
import MenuSistema from '../../MenuSistema';
import { decodeTokenData } from '../../views/util/AuthenticationService';
import { Footer } from '../home/Home';

export default function FormLogin() {
  const navigate = useNavigate(); 
  const { login: authLogin } = useContext(AuthContext); 

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);

  async function entrar() {
    setErro(''); 

    if (username !== '' && senha !== '') {
      let authenticationRequest = {
        username: username,
        password: senha,
      };

      try {
        console.log('[FormLogin] Tentando login para:', username);
      
        const response = await axios.post('http://localhost:8080/api/auth', authenticationRequest);
        
        const { token, tokenExpiresIn } = response.data; 

        authLogin(token, tokenExpiresIn);
      
        const decodedData = decodeTokenData(token); 
        const rolesFromToken = decodedData.roles;
        const loggedInUsername = decodedData.username;
        
        console.log('[FormLogin] Login bem-sucedido. Token JWT recebido:', token);
        console.log('[FormLogin] Papéis detectados para redirecionamento:', rolesFromToken, 'Nome de usuário:', loggedInUsername);

        if (rolesFromToken.includes('ROLE_ADMINISTRADOR')) {
          navigate('/dashboard-admin'); // Redireciona para o dashboard do administrador
        } else if (rolesFromToken.includes('ROLE_GERENCIADOR')) {
          navigate('/homeGerenciador'); // Redireciona para a página do dono (gerenciador)
        } else if (rolesFromToken.includes('ROLE_EXPOSITOR')) {
          navigate('/homeExpositor'); // Redireciona para a HomeExpositor para o Expositor
        } else {
          

          navigate('/homeExpositor');
        }
      } catch (error) {

        console.error('[FormLogin] Erro ao fazer login:', error.response?.data || error.message);
        setErro('Usuário ou senha inválidos.');
      }
    } else {
      setErro('Por favor, preencha todos os campos.'); 
    }
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <MenuSistema tela={'form-login'} /> 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: 370, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e7ef', padding: 40, textAlign: 'center' }}
        >
          <center>
            <h2 style={{ color: '#1677ff', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Login</h2>
          </center>

          <h3 style={{ color: '#8c8c8c', fontWeight: 500, fontSize: 18, marginBottom: 30 }}>
            Informe suas credenciais de acesso
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault(); 
              entrar(); 
            }}
          >
            <div style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15 }}>E-mail</label>
              <input
                type="email"
                required
                placeholder="Informe seu e-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e0e7ef', fontSize: 15, background: '#fafbfc', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: 18, textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15 }}>Senha</label>
              <input
                type="password"
                required
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
                  style={{ flex: 1, width: '100%', background: '#fff7e6', color: "#d46b08", border: "1.5px solid #ffd591", borderRadius: 24, padding: "10px 0", cursor: "pointer", fontWeight: 600, fontSize: 17, boxShadow: '0 1px 4px #f5e6d6', transition: 'background 0.2s' }}
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
            Esqueceu a sua senha:
            <Link to="#" style={{ color: '#1677ff', fontWeight: 600, marginLeft: 6, textDecoration: 'underline' }}>
              clique aqui 
            </Link>
          </div>

          <div style={{ marginTop: 18, fontSize: 15, color: '#444' }}>
            Não tem conta?
            <button
              onClick={() => setMostrarPopup(true)}
              style={{ background: 'none', border: 'none', color: '#1677ff', fontWeight: 600, marginLeft: 6, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cadastre-se
            </button>
          </div>

          <PopupCadastro aberto={mostrarPopup} fechar={() => setMostrarPopup(false)} /> 
        </motion.div>
      </div>
      <Footer /> 
    </div>
  );
}