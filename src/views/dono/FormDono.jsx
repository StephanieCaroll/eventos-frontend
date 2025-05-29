import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";

export default function FormDono() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [enderecoRua, setEnderecoRua] = useState("");
  const [enderecoComplemento, setEnderecoComplemento] = useState("");
  const [enderecoNumero, setEnderecoNumero] = useState("");
  const [enderecoBairro, setEnderecoBairro] = useState("");
  const [enderecoCidade, setEnderecoCidade] = useState("");
  const [enderecoCep, setEnderecoCep] = useState("");
  const [enderecoUf, setEnderecoUf] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);

  function salvar() {
    setMensagemSucesso(false);
    setMensagemErro(false);

    let donoRequest = {
      razaoSocial,
      nome,
      email,
      cpf,
      rg,
      dataNascimento,
      enderecoRua,
      enderecoComplemento,
      enderecoNumero,
      enderecoBairro,
      enderecoCidade,
      enderecoCep,
      enderecoUf,
    };

    axios
      .post("http://localhost:8080/api/dono", donoRequest)
      .then(() => {
        setRazaoSocial("");
        setNome("");
        setEmail("");
        setCpf("");
        setRg("");
        setDataNascimento("");
        setEnderecoRua("");
        setEnderecoComplemento("");
        setEnderecoNumero("");
        setEnderecoBairro("");
        setEnderecoCidade("");
        setEnderecoCep("");
        setEnderecoUf("");
        setMensagemSucesso(true);
      })
      .catch(() => setMensagemErro(true));
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <MenuSistema tela={"dono"} />
      <div style={{ marginTop: "3%", marginBottom: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #e0e7ef", padding: 48 }}
        >
          <h2 style={{ color: "#222", marginBottom: 16, fontWeight: 700, fontSize: 28, letterSpacing: 0.5 }}>
            <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
              Dono &nbsp;
              <span style={{ fontSize: 18, verticalAlign: "middle" }}>&raquo;</span>
            </span>
            &nbsp;  Cadastro
          </h2>
          <hr style={{ margin: "20px 0 28px 0", border: 0, borderTop: "1.5px solid #f0f0f0" }} />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: 12 }}
            onSubmit={e => { e.preventDefault(); salvar(); }}
          >
            <h3 style={{ marginBottom: 18, color: '#1677ff', fontWeight: 600 }}> Dados Pessoais</h3>
            {/* Nome e Razão Social */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Nome <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe seu nome"
                  maxLength={100}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Razão Social <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe a razão social"
                  maxLength={100}
                  value={razaoSocial}
                  onChange={e => setRazaoSocial(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </div>
            {/* Email e CPF */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Email <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="email"
                  placeholder="Informe o email"
                  maxLength={100}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>CPF <span style={{ color: 'red' }}>*</span></label>
                <InputMask
                  mask="999.999.999-99"
                  placeholder="Ex: 123.456.789-00"
                  maskChar={null}
                  required
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </div>
            {/* RG e Data de Nascimento */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>RG <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe o RG"
                  maxLength={20}
                  value={rg}
                  onChange={e => setRg(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Data de Nascimento <span style={{ color: 'red' }}>*</span></label>
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
            </div>
            <hr style={{ margin: "28px 0 24px 0", border: 0, borderTop: "1.5px solid #f0f0f0" }} />
            <h3 style={{ marginBottom: 18, color: '#1677ff', fontWeight: 600 }}>Dados de Endereço</h3>
            {/* Rua e Número */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Rua <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe sua Rua"
                  maxLength={150}
                  value={enderecoRua}
                  onChange={e => setEnderecoRua(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Número <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Número da Rua"
                  maxLength={10}
                  value={enderecoNumero}
                  onChange={e => setEnderecoNumero(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </div>
            {/* Complemento e Bairro */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Complemento</label>
                <input
                  type="text"
                  placeholder="Ex: Apt 101, Bloco A"
                  maxLength={100}
                  value={enderecoComplemento}
                  onChange={e => setEnderecoComplemento(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Bairro <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe seu bairro"
                  maxLength={100}
                  value={enderecoBairro}
                  onChange={e => setEnderecoBairro(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </div>
            {/* Cidade, CEP, UF */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: 220 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>Cidade <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Informe sua cidade"
                  maxLength={100}
                  value={enderecoCidade}
                  onChange={e => setEnderecoCidade(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>CEP <span style={{ color: 'red' }}>*</span></label>
                <InputMask
                  mask="99999-999"
                  placeholder="Ex: 12345-678"
                  required
                  value={enderecoCep}
                  onChange={e => setEnderecoCep(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#444', fontSize: 15, textAlign: 'left' }}>UF <span style={{ color: 'red' }}>*</span></label>
                <input
                  required
                  type="text"
                  placeholder="UF (Ex: PE)"
                  maxLength={2}
                  value={enderecoUf}
                  onChange={e => setEnderecoUf(e.target.value)}
                  style={{ width: "100%", padding: '12px 14px', borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 15, background: '#fafbfc', outline: 'none', transition: 'border 0.2s', textTransform: 'uppercase' }}
                />
              </div>
            </div>
            {mensagemSucesso && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "#e6ffed", color: "#256029", border: "1.5px solid #b7eb8f", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
              >
                <strong>Cadastro Realizado!</strong> Dono cadastrado com sucesso.
              </motion.div>
            )}
            {mensagemErro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: "#fff1f0", color: "#a8071a", border: "1.5px solid #ffa39e", borderRadius: 6, padding: 14, marginBottom: 18, fontWeight: 500, fontSize: 15 }}
              >
                <strong>Erro no Cadastro:</strong> Ocorreu um erro ao tentar cadastrar o Dono. Tente novamente.
              </motion.div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, gap: 16 }}>
              <Link to={"/dono-login"} style={{ textDecoration: 'none' }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, backgroundColor: '#ffd591' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: "#fff7e6", color: "#d46b08", border: "1.5px solid #ffd591", borderRadius: 24, padding: "10px 32px", cursor: "pointer", fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #f5e6d6', transition: 'background 0.2s' }}
                >
                  Voltar
                </motion.button>
              </Link>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: '#91caff' }}
                whileTap={{ scale: 0.95 }}
                style={{ background: "#e6f4ff", color: "#1677ff", border: "1.5px solid #91caff", borderRadius: 24, padding: "10px 32px", cursor: "pointer", fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #d6eaff', transition: 'background 0.2s' }}
              >
                Salvar
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
      <br />
            <Footer />
    </div>
  );
}