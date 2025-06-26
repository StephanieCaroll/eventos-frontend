import axios from "axios";
import InputMask from "comigo-tech-react-input-mask"; 
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";

export default function FormCliente() {
  const [nome, setNome] = useState(""); // Inicializado com string vazia
  const [email, setEmail] = useState(""); // Inicializado com string vazia
  const [dataNascimento, setDataNascimento] = useState(""); // Inicializado com string vazia
  const [foneCelular, setFoneCelular] = useState(""); // Inicializado com string vazia
  const [senha, setSenha] = useState(""); // Inicializado com string vazia
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(false); // Novo estado para mensagem de sucesso
  const [mensagemErro, setMensagemErro] = useState(false); // Novo estado para mensagem de erro

  function salvar() {
    setMensagemSucesso(false);
    setMensagemErro(false);
    setErroSenha("");
    if (senha !== confirmaSenha) {
      setErroSenha("As senhas não são iguais.");
      return;
    }

    let clienteRequest = {
      nome: nome,
      email: email,
      dataNascimento: dataNascimento,
      foneCelular: foneCelular,
      senha: senha,
    };

    axios
      .post("http://localhost:8080/api/cliente", clienteRequest)
      .then((response) => {
        console.log("Expositor cadastrado com sucesso.");
        setMensagemSucesso(true); // Exibe mensagem de sucesso
        setNome("");
        setEmail("");
        setDataNascimento("");
        setFoneCelular("");
        setSenha("");
        setConfirmaSenha("");
      })
      .catch((error) => {
        console.log("Erro ao incluir Expositor.", error);
        setMensagemErro(true); // Exibe mensagem de erro
      });
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '80vh' }}>
      <MenuSistema tela={"form-cliente"} />
      <div style={{ marginTop: "3%" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #e0e7ef", padding: 48 }}
        >
          <h2 style={{ color: "#222", marginBottom: 16, fontWeight: 700, fontSize: 28, letterSpacing: 0.5 }}>
            <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
              Expositor &nbsp;
              <span style={{ fontSize: 18, verticalAlign: "middle" }}>&raquo;</span>
            </span>
            &nbsp;Cadastro
          </h2>
          <hr style={{ margin: "20px 0 28px 0", border: 0, borderTop: "1.5px solid #f0f0f0" }} />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: 12 }}
            onSubmit={e => { e.preventDefault(); salvar(); }}
          >
            {/* Nome e Email */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Nome <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe seu nome completo"
                  maxLength={100}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>E-mail <span style={{ color: 'red' }}>*</span></label>
                  <input
                    required
                    type="email"
                    placeholder="Informe seu email"
                    maxLength={100}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                  />
              </div>
            </div>
            {/* Senha e validação de Senha juntos */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Senha <span style={{ color: 'red' }}>*</span></label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    required
                    type="password"
                    placeholder="Crie uma senha"
                    maxLength={100}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e0e7ef', fontSize: 15, background: '#fafbfc', outline: 'none' }}
                  />
                  <input
                    required
                    type="password"
                    placeholder="Confirme a senha"
                    maxLength={100}
                    value={confirmaSenha}
                    onChange={e => setConfirmaSenha(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e0e7ef', fontSize: 15, background: '#fafbfc', outline: 'none' }}
                  />
                </div>
                {erroSenha && (
                  <span style={{ color: 'red', fontSize: 13, marginTop: 4, display: 'block' }}>{erroSenha}</span>
                )}
              </div>
            </div>
            {/* Data de nascimento e telefone */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Data de Nascimento</label>
               <InputMask
                  mask="99/99/9999"
                  maskChar={null}
                  required
                  placeholder="Ex: 20/03/1985"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Telefone Celular</label>
                <input
                  type="text"
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                  value={foneCelular}
                  onChange={e => setFoneCelular(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </div>
            {mensagemSucesso && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "#e6ffed", color: "#256029", border: "1.5px solid #b7eb8f", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
              >
                <strong>Cadastro Realizado!</strong> Cliente cadastrado com sucesso.
              </motion.div>
            )}
            {mensagemErro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "#fff1f0", color: "#a8071a", border: "1.5px solid #ffa39e", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
              >
                <strong>Erro no Cadastro:</strong> Ocorreu um erro ao tentar cadastrar o cliente. Tente novamente.
              </motion.div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, gap: 16 }}>

              <Link to={"/dono-login"} style={{ textDecoration: 'none' }}>
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
                Salvar
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