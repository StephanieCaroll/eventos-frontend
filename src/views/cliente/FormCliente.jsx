import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuSistema from "../../MenuSistema";
import { Footer } from "../home/Home";
// Se você tem notifyError e notifySuccess, certifique-se de que estão no local certo ou comente-os se não os usa.
// import { notifyError, notifySuccess } from "../../views/util/Util";


export default function FormCliente() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // InputMask já está para DD/MM/YYYY
  const [foneCelular, setFoneCelular] = useState("");
  const [password, setPassword] = useState("");
  const [confirmaPassword, setConfirmaPassword] = useState("");
  const [erroPassword, setErroPassword] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);

  function salvar() {
    setMensagemSucesso(false);
    setMensagemErro(false);
    setErroPassword("");

    if (password !== confirmaPassword) {
      setErroPassword("As senhas não são iguais.");
      console.error("[FormCliente] Erro de validação: As senhas não são iguais.");
      return;
    }

    // A data é enviada no formato DD/MM/AAAA conforme InputMask
    const dataParaBackend = dataNascimento; 

    let clienteRequest = {
      nome: nome,
      usuario: { // Objeto 'usuario' aninhado
          username: email,
          password: password // <<-- AQUI A SENHA ESTÁ A SER ENVIADA
      },
      dataNascimento: dataParaBackend,
      foneCelular: foneCelular,
    };

    // Log do objeto que está realmente a ser enviado
    console.log("[FormCliente] Enviando requisição POST para /api/clientes com dados:", JSON.stringify(clienteRequest, null, 2));

    axios
      .post("http://localhost:8080/api/clientes", clienteRequest)
      .then((response) => {
        console.log("[FormCliente] Cliente cadastrado com sucesso. Resposta do backend:", response.data);
        setMensagemSucesso(true);
        // Limpar os campos após o sucesso
        setNome("");
        setEmail("");
        setDataNascimento("");
        setFoneCelular("");
        setPassword("");
        setConfirmaPassword("");
        // if (typeof notifySuccess === 'function') notifySuccess("Cliente cadastrado com sucesso.");
      })
      .catch((error) => {
        setMensagemErro(true);
        console.error("[FormCliente] Erro ao incluir Cliente."); // Alterado de Expositor para Cliente
        
        if (error.response) {
            console.error("[FormCliente] Resposta de erro do servidor (status " + error.response.status + "):", error.response.data);
            if (error.response.data && typeof error.response.data === 'string' && error.response.data.includes("JSON parse error: Cannot deserialize value of type `java.time.LocalDate`")) {
                console.error("[FormCliente] POSSÍVEL CAUSA: Formato da data incorreto no backend. Verifique a anotação @JsonFormat(pattern = \"dd/MM/yyyy\") na sua classe ClienteRequest.java.");
            } else if (error.response.data && error.response.data.includes("rawPassword cannot be null")) { // <<-- Mensagem específica para este erro
                console.error("[FormCliente] ERRO: Senha nula no backend. Verifique se o campo 'password' no seu ClienteRequest.java e UsuarioRequest.java (se existir) está correto, e se o método build() está a passar a senha para o Usuario.");
            } else if (error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    console.error("[FormCliente] Erro de validação: Campo '" + err.field + "' - " + err.defaultMessage);
                });
            } else if (error.response.data && error.response.data.message) {
                console.error("[FormCliente] Mensagem de erro do backend:", error.response.data.message);
            } else {
                console.error("[FormCliente] Resposta de erro inesperada do backend:", error.response.data);
            }
        } else if (error.request) {
            console.error("[FormCliente] Nenhuma resposta do servidor. Verifique se o backend está rodando e se há problemas de CORS. Detalhes:", error.request);
        } else {
            console.error("[FormCliente] Erro na configuração da requisição:", error.message);
        }
        console.error("[FormCliente] Objeto erro completo:", error);
      });
  }

  return (
    <div style={{ background: "#f5f7fa", minHeight: "80vh" }}>
      <MenuSistema tela={"form-cliente"} />
      <div style={{ marginTop: "3%" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 700,
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
              Cliente &nbsp;
              <span style={{ fontSize: 18, verticalAlign: "middle" }}>
                &raquo;
              </span>
            </span>
            &nbsp;Cadastro
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
            {/* Nome e Email */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
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
                  Nome <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Informe seu nome completo"
                  maxLength={100}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
              <div style={{ flex: 1, minWidth: 220 }}>
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
                  E-mail <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="Informe seu email"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            {/* Senha e validação de Senha juntos */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
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
                  Senha <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    required
                    type="password"
                    placeholder="Crie uma senha"
                    maxLength={100}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 10px",
                      borderRadius: 8,
                      border: "1.5px solid #e0e7ef",
                      fontSize: 15,
                      background: "#fafbfc",
                      outline: "none",
                      transition: "border 0.2s",
                    }}
                  />
                  <input
                    required
                    type="password"
                    placeholder="Confirme a senha"
                    maxLength={100}
                    value={confirmaPassword}
                    onChange={(e) => setConfirmaPassword(e.target.value)}
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
                {erroPassword && (
                  <span
                    style={{
                      color: "red",
                      fontSize: 13,
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {erroPassword}
                  </span>
                )}
              </div>
            </div>
            {/* Data de nascimento e telefone */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 140 }}>
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
                  Data de Nascimento
                </label>
                <InputMask
                  mask="99/99/9999" // Máscara para DD/MM/YYYY
                  maskChar={null}
                  required
                  placeholder="Ex: 20/03/1985"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
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
              <div style={{ flex: 1, minWidth: 140 }}>
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
                  Telefone Celular
                </label>
                <input
                  type="text"
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                  value={foneCelular}
                  onChange={(e) => setFoneCelular(e.target.value)}
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
                <strong>Cadastro Realizado!</strong> Cliente cadastrado com
                sucesso.
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
                <strong>Erro no Cadastro:</strong> Ocorreu um erro ao tentar
                cadastrar o cliente. Tente novamente.
              </motion.div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 36,
                gap: 16,
              }}
            >
              <Link to={"/login"} style={{ textDecoration: "none" }}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1, backgroundColor: "#ffd591" }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "#fff7e6",
                    color: "#d46b08",
                    border: "1.5px solid #ffd591",
                    borderRadius: 24,
                    padding: "10px 32px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 16,
                    boxShadow: "0 1px 4px #f5e6d6",
                    transition: "background 0.2s",
                  }}
                >
                  Voltar
                </motion.button>
              </Link>

              <motion.button
                type="submit"
                whileHover={{ scale: 1, backgroundColor: "#91caff" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#e6f4ff",
                  color: "#1677ff",
                  border: "1.5px solid #91caff",
                  borderRadius: 24,
                  padding: "10px 32px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: "0 1px 4px #d6eaff",
                  transition: "background 0.2s",
                }}
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